import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    audiopath: { type: String, required: true},
    filename: { type: String , required: true},
    title: { type: String },
    tags: [{ type: String}],
    transcription: { type: String },
    createdAt: { type: Date, default: Date.now},
    
});

export default mongoose.model('Note', NoteSchema);