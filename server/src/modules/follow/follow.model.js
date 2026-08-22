import mongoose from "mongoose";

const followModel = new mongoose.Schema({

    follower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    following: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, { timestamps: true });


// Indexes
followModel.index({ follower: 1, following: 1 }, { unique: true });
followModel.index({ follower: 1, createdAt: -1 });
followModel.index({ following: 1, createdAt: -1 });


export default mongoose.model("Follow", followModel);