import mongoose from "mongoose";
import crypto from "crypto";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    otp: {
        type: String,
        required: true
    }
}, { timestamps: true });

// Using ttl index in otp model for auto expire after 10 minutes
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

otpSchema.statics.hashOtp = function (otp) {
    const hashedOtp = crypto.createHash("sha256").update(String(otp)).digest("hex");
    return hashedOtp;
};

export default mongoose.model("Otp", otpSchema);