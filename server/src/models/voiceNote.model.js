import mongoose from "mongoose";

const VoiceNoteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true},
    // audiopath: { type: String, required: true},
    filename: { type: String , required: true},
    duration: {type: Number, required: true},
    // title: { type: String },
    // transcription: { type: String },
    status: {type: String, enum: ['UPLOADED', 'TRANSCRIBED', 'FAILED'], default: "UPLOADED"},
    
}, {
    timestamps: true,
    collection: 'voice_notes'
});

export default mongoose.model('VoiceNote', VoiceNoteSchema);