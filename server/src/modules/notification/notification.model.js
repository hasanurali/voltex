import mongoose from "mongoose";

import { NOTIFICATION_TARGET_TYPE, NOTIFICATION_TYPE } from "../../shared/constants/enums/index.js";

const notificationSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    triggeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "entityType",
        required: true
    },
    entityType: {
        type: String,
        enum: [
            NOTIFICATION_TARGET_TYPE.USER,
            NOTIFICATION_TARGET_TYPE.POST,
            NOTIFICATION_TARGET_TYPE.COMMENT
        ],
        required: true
    },
    type: {
        type: String,
        enum: [
            NOTIFICATION_TYPE.FOLLOW,
            NOTIFICATION_TYPE.POST_LIKE,
            NOTIFICATION_TYPE.COMMENT_LIKE,
            NOTIFICATION_TYPE.POST_COMMENT,
            NOTIFICATION_TYPE.COMMENT_REPLY
        ],
        required: true
    },
    metadata: {
        _id: false,
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            default: null
        },
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);