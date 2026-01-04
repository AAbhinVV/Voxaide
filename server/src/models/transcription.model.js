import mongoose from "mongoose";

const TranscriptionSchema = new mongoose.Schema({
    noteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', required: true, index: true },
    transcription: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

export default mongoose.model('Transcription', TranscriptionSchema);