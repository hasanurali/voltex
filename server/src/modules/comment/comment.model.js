import mongoose from "mongoose";

const commentSehema = new mongoose.Schema({

    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default: null
    },
    content: {
        type: String,
        required: true
    },

    likesCount: {
        type: Number,
        default: 0
    },
    repliesCount: {
        type: Number,
        default: 0
    },
    depth: {
        type: Number,
        required: true,
        min: 0,
        max: 2
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


// Indexes
commentSehema.index({ post: 1, parentComment: 1, createdAt: -1 });
commentSehema.index({ parentComment: 1, createdAt: 1 });

commentSehema.methods.toJSON = function () {
    const obj = this.toObject();

    delete obj.deletedAt;
    delete obj.deletedBy;
    delete obj.__v;

    return obj;
};


export default mongoose.model("Comment", commentSehema);