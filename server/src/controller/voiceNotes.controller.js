import VoiceNote from "../models/voiceNote.model.js";
import startTranscriptionJob from "../services/transcription.service.js";
import { getVoiceNoteFile, deleteVoiceNoteFile } from "../services/voiceNote.service.js";



const createVoiceNote = async (req, res) => {
	try {
		if (!req.file) {
			return res
				.status(400)
				.json({ success: false, message: "No file uploaded" });
		}

		const userId = req.user._id;

		const voiceNoteInstance = new VoiceNote({
			userId,
			filename: req.file.originalname,
			duration: req.body.duration,
			s3Key: req.file.key,
			s3Url: req.file.location,
			contentType: req.file.mimetype,
			size: req.file.size,
			status: "UPLOADED",
		});

		await voiceNoteInstance.save();

		startTranscriptionJob(voiceNoteInstance._id, userId);

		res.status(201).json({
			success: true,
			message: "Audio received",
			voiceNoteId: voiceNoteInstance._id,
		});
	} catch (error) {
		res.status(503).json({ success: false, message: error.message });
	}
};

const getVoiceNoteById = async (req, res) => {
	const voiceNoteId = req.params.id;
	const userId = req.user._id;

	try {
		const voiceNote = await getVoiceNoteFile(voiceNoteId, userId);

		res.setHeader("Content-Type", voiceNote.contentType);
		res.setHeader("Content-Disposition", `inline; filename="${voiceNote.filename}"`);

		res.send(voiceNote.buffer);

		res.status(200).json({success:true, buffer: voiceNote.buffer, message: "Voice note fetched successfully"});
	} catch (error) {
		res.status(503).json({ success: false, message: error.message });
	}
}; // format this function

const getAllVoiceNotes = async (req, res) => {
	const userId = req.user._id;


	try {
		const voiceNotes = await getAllVoiceNotesForUser(userId);

		res.status(200).json({
			success: true,
			count: voiceNotes.length,
			data: voiceNotes,
			message: "Voice notes fetched successfully",
		});
	} catch (error) {
		res.status(503).json({ success: false, message: error.message });
	}
}; // format this function

const deleteVoiceNote = async (req, res) => {
	
	const voiceNoteId = req.params.id;
	const userId = req.user._id;

	try {
		await deleteVoiceNoteFile(voiceNoteId, userId);
		res
			.status(200)
			.json({ success: true, message: "Voice Note deleted successfully" });
	} catch (error) {
		res.status(503).json({ success: false, message: error.message });
	}
};

export default {
	createVoiceNote,
	getVoiceNoteById,
	getAllVoiceNotes,
	deleteVoiceNote,
};
