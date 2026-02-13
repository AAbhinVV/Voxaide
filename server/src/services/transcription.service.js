import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { OpenAI } from "openai";
import env from "../config/env.js";
import transcriptionModel from "../models/transcription.model.js";
import voiceNoteModel from "../models/voiceNote.model.js";
import generateChunksAndEmbeddings from "./embedding.service.js";
import streamToBuffer from "../utils/streamToBuffer.js";
import {File} from "node:buffer";

const s3 = new S3Client({ region: env.aws_region });

const client = new OpenAI({ apiKey: env.openai_api_key });

const startTranscriptionJob = async (voiceNoteId, userId) => {
	const voiceNoteInstance = await voiceNoteModel.findOne({
		_id: voiceNoteId,
		userId: userId,
	});

	if (!voiceNoteInstance) {
		throw new Error("Voice note not found. Recheck the ID");
	}

	if (voiceNoteInstance.status !== "UPLOADED") {
		throw new Error("Voice note already processed or failed");
	}

	const s3Response = await s3.send(
		new GetObjectCommand({
			Bucket: env.aws_bucket_name,
			Key: voiceNoteInstance.s3Key,
		}),
	);

	const voiceNoteBuffer = await streamToBuffer(s3Response.Body);

	if (!voiceNoteBuffer) {
		throw new Error("Voice note file not found in S3");
	}

	const file = new File([voiceNoteBuffer], voiceNoteInstance.filename || "audio.webm", { type: voiceNoteInstance.contentType });

	const response = await client.audio.transcriptions.create({
		file: file,
		model: "gpt-4o-transcribe",
	});

	const transcription = response.output_text;

	if (!transcription) {
		throw new Error("Transcription failed");
	}

	const transcriptionInstance = new transcriptionModel({
		userId,
		voiceNoteId,
		text: transcription,
		status: "COMPLETED",
	});

	await transcriptionInstance.save();

	voiceNoteInstance.status = "TRANSCRIBED";
	await voiceNoteInstance.save();

	await generateChunksAndEmbeddings({
		transcriptionId: transcriptionInstance._id,
		userId,
		transcriptionText: transcription,
	});
};

export default startTranscriptionJob;
