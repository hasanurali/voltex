import mongoose from "mongoose";

import { MEDIA_TYPE, VISIBILITY_TYPE } from "../../shared/constants/enums/index.js";

const postSchema = new mongoose.Schema({

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        trim: true,
        maxLength: 2000,
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
    hashtags: [
        {
            type: String,
            trim: true,
            lowercase: true
        }
    ],
    commentsCount: {
        type: Number,
        default: 0
    },
    likesCount: {
        type: Number,
        default: 0
    },
    visibility: {
        type: String,
        enum: [VISIBILITY_TYPE.PUBLIC, VISIBILITY_TYPE.FOLLOWERS],
        default: VISIBILITY_TYPE.PUBLIC
    },
    isEdited: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    }
}, { timestamps: true });


postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ visibility: 1, createdAt: -1 });
postSchema.index({ hashtags: 1 });


export default mongoose.model("Post", postSchema);