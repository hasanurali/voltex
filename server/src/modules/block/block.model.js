import mongoose from "mongoose";

const blockSchema = new mongoose.Schema({

    blocker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    blocked: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

export default mongoose.model("Block", blockSchema);