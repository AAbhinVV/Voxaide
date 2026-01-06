import mongoose from "mongoose";

const ChunkSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true},
    transcriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transcription', required: true, index: true},
    chunkIndex: { type: Number, required: true },
    text: { type: String, required: true },
    embeddingId: { type: String, index: true },
}, { 
    timestamps: true,
    collection: 'chunks'
 });

ChunkSchema.index({ userId: 1, transcriptionId: 1 });
ChunkSchema.index({transcriptionId: 1, chunkIndex: 1}, {unique: true});


export default mongoose.model('TranscriptionChunk', ChunkSchema);