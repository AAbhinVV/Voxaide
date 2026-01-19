import mongoose from "mongoose";

const VoiceNoteSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			index: true,
			required: true,
		},
		filename: { type: String, required: true },
		duration: { type: Number },
		s3Key: { type: String, required: true, index: true, unique: true },
		s3Url: { type: String, required: true, unique: true },
		contentType: { type: String, required: true },
		size: { type: Number, required: true },

		status: {
			type: String,
			enum: ["UPLOADED", "TRANSCRIBED", "FAILED"],
			default: "UPLOADED",
		},
	},
	{
		timestamps: true,
		collection: "voice_notes",
	},
);

VoiceNoteSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("VoiceNote", VoiceNoteSchema);
