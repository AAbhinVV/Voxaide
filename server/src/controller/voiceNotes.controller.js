import path from "path";
import VoiceNote from "../models/voiceNote.model.js";
import startTranscriptionJob from "../services/transcription.service.js";

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
	const noteId = req.params.id;
	try {
		const note = await VoiceNote.findById(noteId);
		if (!note) {
			return res
				.status(400)
				.json({ success: false, message: "note not found" });
		}

		const absolutePath = path.resolve(process.cwd(), note.audiopath);

		res.status(200).sendFile(absolutePath, (err) => {
			if (err) {
				console.error("Error sending file:", err);
			}
		});
	} catch (error) {
		res.status(503).json({ success: false, message: error.message });
	}
}; // format this function

const getAllVoiceNotes = async (req, res) => {
	try {
		const note = await VoiceNote.find();
		res.status(200).json({ success: true, notes: note });
	} catch (error) {
		res.status(503).json({ success: false, message: error.message });
	}
}; // format this function

const deleteVoiceNote = async (req, res) => {
	try {
		const noteId = req.params.id;
		const note = await VoiceNote.findByIdAndDelete(noteId);
		if (!note) {
			return res
				.status(400)
				.json({ success: false, message: "Note not found" });
		}
		res
			.status(200)
			.json({ success: true, message: "Note deleted successfully" });
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
