import mongoose from "mongoose";

const TranscriptionSchema = new mongoose.Schema({
    noteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', required: true, index: true },
    text: { type: String, required: true },
    language: { type: String, default: 'en' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

export default mongoose.model('Transcription', TranscriptionSchema);