import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({

    name: {
        type: String,
        trim: true,
        required: true
    },
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    ],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: null
    }
}, { timestamps: true });

export default mongoose.model("Conversation", conversationSchema);