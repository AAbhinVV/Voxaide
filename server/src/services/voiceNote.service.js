import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multers3, { AUTO_CONTENT_TYPE } from "multer-s3";
import constants from "../config/constant.js"
import voiceNoteModel from "../models/voiceNote.model.js";
import streamToBuffer from "../utils/streamToBuffer.js";
import transcriptionModel from "../models/transcription.model.js";
import TranscriptionChunk from "../models/chunks.model.js";
import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";

dotenv.config({path: "../../.env"});

const s3 = new S3Client({ region: constants.aws_region });


const pinecone = new Pinecone({
	apiKey: constants.pinecone_api_key
});

if(!constants.pinecone_api_key){
	throw new Error("Pinecone API key is not set in environment variables");
}

const pineconeIndex = pinecone.Index(constants.pinecone_index_name);

export const upload = multer({
	storage: multers3({
		s3: s3,
		bucket: constants.aws_bucket_name,
		contentType: AUTO_CONTENT_TYPE,
		metadata: (req, file, cb) => {
			cb(null, {
				fieldname: file.fieldname,
				userId: req.user?._id?.toString(),
			});
		},
		key: (req, file, cb) => {
			const ext = file.originalname.split(".").pop();
			const random = Math.randomBytes(6).toString("hex");
			const filename = `voicenotes/${req.user._id}/${Date.now()}-${random}.${ext}`;
			cb(null, filename);
		},

		fileFilter(req, file, cb) {
			if (!file.mimetype.startsWith("audio/")) {
				return cb(new Error("Only audio files are allowed"));
			}
			cb(null, true);
		},
	}),
});

export const getVoiceNoteFile = async (voiceNoteId, userId) => {

	const voiceNotesInstance = await voiceNoteModel.findOne({
		_id: voiceNoteId,
		userId: userId,
	})

	if(!voiceNotesInstance){
		throw new Error("Voice note not found. Recheck the ID");
	}

	const s3Response = await s3.send(
		new GetObjectCommand({
			Bucket: constants.aws_bucket_name,
			Key: voiceNotesInstance.s3Key,
		})
	)

	if(!s3Response.Body){
		throw new Error("Voice note file not found in S3");
	}

	const voiceNoteBuffer = await streamToBuffer(s3Response.Body);

	return {
		buffer: voiceNoteBuffer,
		contentType: voiceNotesInstance.contentType,
		filename: voiceNotesInstance.filename,
	}
}

export const deleteVoiceNoteFile = async(voiceNoteId, userId) => {
	
	const voiceNote = await voiceNoteModel.findOne({
		_id: voiceNoteId,
		userId: userId,
	})
	
	if(!voiceNote){
		throw new Error("Voice note not found. Recheck the ID");
	}
	
	await s3.send(
		new DeleteObjectCommand({
			Bucket: constants.aws_bucket_name,
			Key: voiceNote.s3Key,
		})
	)

	await transcriptionModel.deleteOne({
		voiceNoteId: voiceNoteId,
		userId: userId,
	})

	await TranscriptionChunk.deleteMany({
		transcriptionId: voiceNote.transcriptionId,
		userId: userId,
	})

	await pineconeIndex.deleteMany({
		filter:{
			userId: userId.toString(),
			transcriptionId: voiceNote.transcriptionIdId.toString(),
		}
	})

	await voiceNoteModel.deleteOne({
		_id: voiceNoteId,
		userId: userId,
	})

	return true;
}


export const getAllVoiceNotesForUser = async (userId) => {
    const voiceNotes = await voiceNoteModel
        .find({ userId })
        .select("-__v")
        .sort({ createdAt: -1 }); // newest first

    return voiceNotes;
};
