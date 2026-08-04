import commentModel from "./comment.model.js";

export const createComment = async (commentData, session) => {

    const comment = await commentModel.create(
        [commentData],
        { session }
    );

    return comment;
};

export const findComment = async (commentId) => {

    const comment = await commentModel.findOne({
        _id: commentId,
        isDeleted: false
    })

    return comment;
};

export const incrementRepliesCount = async (commentId, session) => {

    await commentModel.findByIdAndUpdate(commentId, {
        $inc: {
            repliesCount: 1
        }
    }, { session });
};

export const fetchComment = async (postId, skip, safeLimit) => {

    const [result] = await commentModel.aggregate([
        {
            $match: {
                post: postId,
                parentComment: null,
                isDeleted: false
            },
        },

        {
            $sort: {
                createdAt: -1
            }
        },

        {
            $facet: {
                data: [
                    {
                        $skip: skip
                    },
                    {
                        $limit: safeLimit
                    }
                ],

                metadata: [
                    {
                        $count: "total"
                    }
                ]
            }
        }
    ]);

    return result;
};

export const fetchCommentReplies = async (commentId) => {

    const commentReplies = await commentModel.find({
        parentComment: commentId,
        isDeleted: false
    }).sort({ createdAt: 1 });

    return commentReplies;
};

export const updateComment = async (commentId, whitelistedData) => {

    const updatedComment = await commentModel.findByIdAndUpdate(commentId, {
        $set: whitelistedData
    }, { returnDocument: "after" });

    return updatedComment;
};

export const softDeleteCommentAndReplies = async (userId, commentId, session) => {

    const [result] = await commentModel.aggregate([
        {

            $match: {
                _id: commentId,
                isDeleted: false
            }
        },
        {
            $graphLookup: {
                from: "comments",
                startWith: "$_id",
                connectFromField: "_id",
                connectToField: "parentComment",
                as: "descendants",
                restrictSearchWithMatch: { isDeleted: false }
            }
        },

        {
            $project: {
                allTargetIds: {
                    $concatArrays: [["$_id"], "$descendants._id"]
                }
            }
        },
    ], { session });

    const allTargetIds = result.allTargetIds;

    await commentModel.updateMany({
        _id: {
            $in: allTargetIds
        },
    },
        {
            $set: {
                isDeleted: true,
                deletedAt: new Date(),
                deletedBy: userId
            }
        }, { session });

    return allTargetIds.length;
};