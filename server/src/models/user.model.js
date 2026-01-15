import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, index: true },
    username: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
    lastLogin: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date },
    // resetPasswordToken: { type: String },
    // resetPasswordExpiresAt: { type: Date },
    verificationToken: { type: String },
    verificationTokenExpiresAt: { type: Date }
}, {
    timestamps: true,
    collection: 'users'
});

UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });

export default mongoose.model('User', UserSchema);