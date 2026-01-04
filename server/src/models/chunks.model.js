import mongoose from "mongoose";

const ChunkSchema = new mongoose.Schema({
    transcriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transcription', required: true, index: true },
    noteId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Note', index: true },
    index: { type: Number},
    content: { type: String, required: true },
    embedding: { type: [Number], default: [], required: true },
    createdAt: { type: Date, default: Date.now }
});