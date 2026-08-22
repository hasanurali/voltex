import mongoose from "mongoose";
import { DEFAULT_AVATAR, DEFAULT_COVER_IMAGE } from "../../shared/constants/assets/default.assets.js";

const profileSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        unique: true,
        required: true
    },
    avatar: {
        url: {
            type: String,
            default: function () {
                return DEFAULT_AVATAR(this.user);
            }
        },
        publicId: {
            type: String,
            default: null
        }
    },
    coverImage: {
        url: {
            type: String,
            default: DEFAULT_COVER_IMAGE
        },
        publicId: {
            type: String,
            default: null
        }
    },
    bio: {
        type: String,
        default: null
    },
    website: {
        type: String,
        default: null
    },
    location: {
        type: String,
        default: null
    }

}, { timestamps: true });


profileSchema.methods.toJSON = function () {
    const obj = this.toObject();

    delete obj.avatar.publicId;
    delete obj.coverImage.publicId;
    delete obj.__v;

    return obj;
};

export default mongoose.model("Profile", profileSchema);