import noteModel from "../models/note.model.js";
import transcriptionModel from "../models/transcription.model.js";
import { generateNotes } from "../utils/openAI_func.js";

const notesGenerator = async (transcriptionId, userId) => {
	const transcription = await transcriptionModel.findOne({
		_id: transcriptionId,
		userId: userId,
	});

	if (!transcription) {
		throw new Error("Transcription not found");
	}

	if (transcription.status !== "COMPLETED") {
		throw new Error("Transcription not completed yet");
	}

	const notes = await noteModel.findOne({
		transcriptionId: transcriptionId,
		userId: userId,
	});
	if (notes) {
		return notes;
	}

	const generatedNotes = await generateNotes(transcription.text);

	const newNotes = new noteModel({
		userId,
		transcriptionId,
		title: generatedNotes.title,
		summary: generatedNotes.summary,
		bulletPoints: generatedNotes.bulletPoints,
		actionItems: generatedNotes.actionItems,
	});

	await newNotes.save();

	return newNotes;
};

export default notesGenerator;
