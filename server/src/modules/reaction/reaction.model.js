import mongoose from "mongoose";

import { REACTION_TARGET_TYPE } from "../../shared/constants/enums/index.js";

const reactionSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "targetType",
        required: true
    },
    targetType: {
        type: String,
        enum: [REACTION_TARGET_TYPE.POST, REACTION_TARGET_TYPE.COMMENT],
        required: true
    }
}, { timestamps: true });

export default mongoose.model("Reaction", reactionSchema);