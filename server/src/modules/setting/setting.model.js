import mongoose from "mongoose";

import { PROFILE_VISIBILITY, MESSAGE_PERMISSION } from "../../shared/constants/enums/index.js"

const settingSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        unique: true,
        required: true
    },
    privacy: {
        profileVisibility: {
            type: String,
            enum: [PROFILE_VISIBILITY.PUBLIC, PROFILE_VISIBILITY.PRIVATE],
            default: PROFILE_VISIBILITY.PUBLIC
        },
        messagePermission: {
            type: String,
            enum: [MESSAGE_PERMISSION.EVERYONE, MESSAGE_PERMISSION.FOLLOWER],
            default: MESSAGE_PERMISSION.EVERYONE
        },
    },
    notifications: {
        likes: {
            type: Boolean,
            default: true
        },
        comments: {
            type: Boolean,
            default: true
        },
        follows: {
            type: Boolean,
            default: true
        },
        messages: {
            type: Boolean,
            default: true
        }
    }

}, { timestamps: true });

export default mongoose.model("Setting", settingSchema);