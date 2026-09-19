import commentModel from "./comment.model.js";
import { executeWithConfig } from "../../shared/utils/index.js";
import { REACTION_TARGET_TYPE } from "../../shared/constants/enums/index.js";


// Reusable aggregation pipelines
const commentResponsePipeline = (userId = null) => [
    {
        $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            pipeline: [
                {
                    $project: {
                        _id: 1,
                        username: 1,
                        displayName: 1
                    }
                }
            ],
            as: "author"
        }
    },
    {
        $unwind: "$author"
    },
    {
        $lookup: {
            from: "profiles",
            localField: "author._id",
            foreignField: "user",
            pipeline: [
                {
                    $project: {
                        _id: 0,
                        avatar: 1
                    }
                }
            ],
            as: "profile"
        }
    },
    {
        $unwind: "$profile"
    },
    {
        $lookup: {
            from: "reactions",
            let: {
                targetId: "$_id"
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ["$targetType", REACTION_TARGET_TYPE.COMMENT] },
                                { $eq: ["$targetId", "$$targetId"] },
                                { $ne: [userId, null] },
                                { $eq: ["$user", userId] }
                            ]
                        }
                    }
                },
                {
                    $project: {
                        _id: 1
                    }
                }
            ],
            as: "reaction"
        }
    },
    {
        $project: {
            _id: 1,
            post: 1,
            author: {
                _id: "$author._id",
                username: "$author.username",
                displayName: "$author.displayName",
                avatar: "$profile.avatar.url"
            },
            parentComment: 1,
            content: 1,
            likesCount: 1,
            repliesCount: 1,
            hasReacted: {
                $gt: [{ $size: { $ifNull: ["$reaction", []] } }, 0]
            },
            depth: 1,
            createdAt: 1,
            updatedAt: 1
        }
    }
];


export const createComment = async (commentData, session) => {

    const [createdComment] = await commentModel.create(
        [
            commentData
        ],
        {
            session
        }
    );

    const [comment] = await commentModel.aggregate([
        {
            $match: {
                _id: createdComment._id
            }
        },

        ...commentResponsePipeline()
    ],
        {
            session
        }
    );

    return comment;
};

export const findCommentById = async (commentId, queryConfig = {}) => {

    const baseQuery = commentModel.findOne(
        {
            _id: commentId,
            isDeleted: false
        }
    );

    return await executeWithConfig(baseQuery, queryConfig);
};

export const checkCommentExistsById = async (commentId) => {

    const isCommentExists = await commentModel.exists(
        {
            _id: commentId,
            isDeleted: false
        }
    );

    return isCommentExists;
};

export const incrementRepliesCount = async (commentId, session) => {

    await commentModel.updateOne(
        {
            _id: commentId,
            isDeleted: false
        },
        {
            $inc: {
                repliesCount: 1
            }
        },
        {
            session
        }
    );
};

export const decrementRepliesCount = async (commentId, session) => {

    await commentModel.updateOne(
        {
            _id: commentId,
            isDeleted: false
        },
        {
            $inc: {
                repliesCount: -1
            }
        },
        {
            session
        }
    );
};

export const fetchCommentsByPostId = async (postId, skip, limit, userId = null) => {

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
                        $limit: limit
                    },

                    ...commentResponsePipeline(userId)
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

export const fetchRepliesByCommentId = async (commentId, skip, limit, userId = null) => {

    const [commentReplies] = await commentModel.aggregate([
        {
            $match: {
                parentComment: commentId,
                isDeleted: false
            }
        },
        {
            $sort: {
                createdAt: 1
            }
        },
        {
            $facet: {
                data: [
                    {
                        $skip: skip
                    },
                    {
                        $limit: limit
                    },

                    ...commentResponsePipeline(userId)
                ],

                metadata: [
                    {
                        $count: "total"
                    }
                ]
            }
        }
    ]);

    return commentReplies;
};

export const updateComment = async (commentId, whitelistedData, userId = null) => {

    await commentModel.updateOne(
        {
            _id: commentId,
            isDeleted: false
        },
        {
            $set: whitelistedData
        }
    );

    const [comment] = await commentModel.aggregate([
        {
            $match: {
                _id: commentId
            }
        },

        ...commentResponsePipeline(userId)
    ]);

    return comment;
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
                restrictSearchWithMatch: {
                    isDeleted: false
                }
            }
        },

        {
            $project: {
                allTargetIds: {
                    $concatArrays: [["$_id"], "$descendants._id"]
                }
            }
        },
    ],
        {
            session
        }
    );

    const allTargetIds = result.allTargetIds;

    await commentModel.updateMany(
        {
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
        },
        {
            session
        }
    );

    return allTargetIds.length;
};

export const incrementLikeCount = async (commentId, session) => {

    await commentModel.updateOne(
        {
            _id: commentId,
            isDeleted: true
        },
        {
            $inc: {
                likesCount: 1
            }
        },
        {
            session
        }
    );
};

export const decrementLikeCount = async (commentId, session) => {

    await commentModel.updateOne(
        {
            _id: commentId,
            isDeleted: true
        },
        {
            $inc: {
                likesCount: -1
            }
        },
        {
            session
        }
    );
};