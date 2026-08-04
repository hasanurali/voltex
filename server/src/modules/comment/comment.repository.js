import commentModel from "./comment.model.js";

export const createComment = async (commentData, session) => {

    const comment = await commentModel.create(
        [commentData],
        { session }
    );

    return comment;
};

export const findComment = async (commentId) => {

    const comment = await commentModel.findById(commentId)

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