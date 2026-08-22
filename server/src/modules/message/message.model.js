import mongoose from "mongoose";

import { MEDIA_TYPE } from "../../shared/constants/enums/index.js";

const messageSchema = new mongoose.Schema({

    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        trim: true,
        maxLength: 500,
        default: ""
    },
    media: [
        {
            _id: false,

            mediaType: {
                type: String,
                enum: [MEDIA_TYPE.IMAGE, MEDIA_TYPE.VIDEO],
                required: true
            },
            url: {
                type: String,
                required: true
            },
            publicId: {
                type: String,
                required: true
            }
        }
    ],
    isSeen: {
        type: Boolean,
        default: false
    },
    seenAt: {
        type: Date,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    }

}, { timestamps: true });


// Indexes
messageSchema.index({ conversation: 1, createdAt: -1 });

messageSchema.methods.toJSON = function () {
    const obj = this.toObject();

    if (Array.isArray(obj.media)) {
        obj.media.forEach(item => {
            if (item) delete item.publicId;
        });
    };

    delete obj.deletedAt;
    delete obj.__v;

    return obj;
};


export default mongoose.model("Message", messageSchema);