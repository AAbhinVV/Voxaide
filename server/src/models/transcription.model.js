import mongoose from "mongoose";

const TranscriptionSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true},
    voiceNoteId: { type: mongoose.Schema.Types.ObjectId, ref: 'VoiceNote', required: true, index: true },
    text: { type: String, required: true },
    status: {type: String, enum: ["Pending", "COMPLETED", , "FAILED"], default: "Pending"},
}, { 
    timestamps: true,
    collection: 'transcriptions'
 });

TranscriptionSchema.index({ userId: 1, voiceNoteId: 1 });

export default mongoose.model('Transcription', TranscriptionSchema);