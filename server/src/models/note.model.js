import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true},
    transcriptionId: {type: mongoose.Schema.Types.ObjectId, ref: "Transcription", required: true, index: true},
    title: { type: String, required: true },
    summary: { type: String, required: true },
    bulletPoints: { type: [String], required: true, default: [] },
    actionItems: {type: [String], default: []}


}, {
    timestamps: true,
    collection: 'notes'
});

NoteSchema.index({userId: 1, transcriptionId: 1});


export default mongoose.model("Note", NoteSchema);