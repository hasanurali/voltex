import postModel from "./post.model.js";
import { VISIBILITY_TYPE } from "../../shared/constants/enums/index.js"
import { executeWithConfig } from "../../shared/utils/index.js";


// Reusable aggregation pipelines
const postResponsePipeline = (projectionFields = {}) => [
    {
        $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "user"
        }
    },
    {
        $unwind: "$user"
    },
    {
        $lookup: {
            from: "profiles",
            localField: "author",
            foreignField: "user",
            as: "profile"
        }
    },
    {
        $unwind: "$profile"
    },
    {
        $project: {
            _id: 1,
            author: {
                _id: "$user._id",
                displayName: "$user.displayName",
                username: "$user.username",
                avatar: "$profile.avatar.url"
            },
            content: 1,
            media: {
                $map: {
                    input: "$media",
                    as: "item",
                    in: {
                        mediaType: "$$item.mediaType",
                        url: "$$item.url"
                    }
                }
            },
            ...projectionFields,
            commentsCount: 1,
            likesCount: 1,
            visibility: 1,
            isEdited: 1,
            createdAt: 1,
        }
    }
];


export const createPost = async (postData, session) => {

    const [createdPost] = await postModel.create(
        [
            postData
        ],
        {
            session
        }
    );

    const [post] = await postModel.aggregate([
        {
            $match: {
                _id: createdPost._id
            }
        },

        ...postResponsePipeline()
    ],
        {
            session
        }
    );

    return post;
};

export const fetchHomeFeed = async ({ userFollowingIds = [], suggestedFollowingIds = [], cursor = null }) => {

    const candidateAuthorIds = [
        ...userFollowingIds,
        ...suggestedFollowingIds
    ];

    const facet = {

        popularPosts: [
            {
                $match: {
                    author: {
                        $nin: candidateAuthorIds
                    },
                    visibility: VISIBILITY_TYPE.PUBLIC,
                    isDeleted: false
                }
            },
            {
                $addFields: {
                    popularityScore: {
                        $add: [
                            "$likesCount",
                            {
                                $multiply: [
                                    "$commentsCount",
                                    3
                                ]
                            }
                        ]
                    }
                }
            },
            {
                $sort: {
                    popularityScore: -1,
                    _id: -1
                }
            },
            {
                $limit: 200
            }
        ]
    };

    if (userFollowingIds.length) {

        facet.followingPosts = [
            {
                $match: {
                    author: {
                        $in: userFollowingIds
                    },
                    isDeleted: false
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $limit: 200
            }
        ];
    }

    if (suggestedFollowingIds.length) {

        facet.recommendedPosts = [
            {
                $match: {
                    author: {
                        $in: suggestedFollowingIds
                    },
                    isDeleted: false
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $limit: 200
            }
        ];
    }

    const feedPosts = await postModel.aggregate([

        // Generate candidates from different sources
        {
            $facet: facet
        },

        // Merge all candidate sources
        {
            $project: {
                candidates: {
                    $concatArrays: [
                        {
                            $ifNull: ["$followingPosts", []]
                        },
                        {
                            $ifNull: ["$recommendedPosts", []]
                        },
                        {
                            $ifNull: ["$popularPosts", []]
                        }
                    ]
                }
            }
        },
        {
            $unwind: "$candidates"
        },
        {
            $group: {
                _id: "$candidates._id",
                post: {
                    $first: "$candidates"
                }
            }
        },
        {
            $replaceRoot: {
                newRoot: "$post"
            }
        },

        // Visibility filtering
        {
            $match: {
                $or: [
                    {
                        visibility: VISIBILITY_TYPE.PUBLIC
                    },
                    {
                        visibility: VISIBILITY_TYPE.FOLLOWERS,
                        author: {
                            $in: userFollowingIds
                        }
                    }
                ]
            }
        },

        // Engagement score
        {
            $addFields: {
                engagementScore: {
                    $add: [
                        "$likesCount",
                        {
                            $multiply: [
                                "$commentsCount",
                                3
                            ]
                        }
                    ]
                }
            }
        },

        // Relationship score
        {
            $addFields: {
                relationshipScore: {
                    $cond: [
                        {
                            $in: [
                                "$author",
                                userFollowingIds
                            ]
                        },
                        30,
                        0
                    ]
                }
            }
        },

        // Calculate post age
        {
            $addFields: {
                hoursSincePost: {
                    $dateDiff: {
                        startDate: "$createdAt",
                        endDate: "$$NOW",
                        unit: "hour"
                    }
                }
            }
        },

        // Freshness score
        {
            $addFields: {
                freshnessScore: {
                    $divide: [
                        100,
                        {
                            $add: [
                                "$hoursSincePost",
                                1
                            ]
                        }
                    ]
                }
            }
        },

        // Final ranking score
        {
            $addFields: {
                finalScore: {
                    $add: [
                        "$engagementScore",
                        "$relationshipScore",
                        "$freshnessScore"
                    ]
                }
            }
        },

        // Use cursor for get next batch of post
        ...(cursor
            ? [
                {
                    $match: {
                        $or: [
                            {
                                finalScore: {
                                    $lt: cursor.score
                                }
                            },
                            {
                                finalScore: cursor.score,
                                _id: {
                                    $lt: cursor.postId
                                }
                            }
                        ]
                    }
                }
            ]
            : []
        ),

        // Rank posts
        {
            $sort: {
                finalScore: -1,
                _id: -1
            }
        },

        // Feed page size
        {
            $limit: 20
        },

        // Return only feed data
        ...postResponsePipeline({ finalScore: 1 }),
    ]);

    return feedPosts;
};

export const fetchPostDetails = async (postId) => {

    const [detailedPost] = await postModel.aggregate([
        {
            $match: {
                _id: postId,
                isDeleted: false
            }
        },

        ...postResponsePipeline({ hashtags: 1 }),
    ]);

    return detailedPost;
}

export const fetchUserPosts = async (userId, limit, skip) => {

    const [userPostsData] = await postModel.aggregate([
        {
            $match: {
                author: userId,
                isDeleted: false
            }
        },
        {
            $facet: {
                data: [
                    {
                        $sort: {
                            createdAt: -1,
                            _id: -1
                        }
                    },
                    {
                        $skip: skip
                    },
                    {
                        $limit: limit
                    },

                    ...postResponsePipeline()
                ],

                metadata: [
                    {
                        $count: "total"
                    },
                ],
            },
        },
    ]);

    return userPostsData;
};

export const findPost = async (postId, queryConfig = {}) => {

    const baseQuery = postModel.findOne(
        {
            _id: postId,
            isDeleted: false
        }
    );

    return await executeWithConfig(baseQuery, queryConfig);
};

export const checkPostExistsById = async (postId) => {

    const isPostExists = await postModel.exists(
        {
            _id: postId,
            isDeleted: false
        }
    );

    return isPostExists;
};

export const updatePost = async (postId, whitelistedData) => {

    await postModel.updateOne(
        {
            _id: postId,
            isDeleted: false
        },
        {
            $set: {
                ...whitelistedData,
                isEdited: true
            }
        }
    );

    const [post] = await postModel.aggregate([
        {
            $match: {
                _id: postId
            }
        },

        ...postResponsePipeline()
    ]);

    return post;
};

export const softDeletePost = async (postId, userId, session) => {

    return await postModel.updateOne(
        {
            _id: postId,
            isDeleted: false
        },
        {
            $set: {
                isDeleted: true,
                deletedBy: userId,
                deletedAt: new Date()
            }
        },
        {
            session
        }
    );
};

export const incrementPostComment = async (postId, session) => {

    await postModel.updateOne(
        {
            _id: postId,
            isDeleted: false
        },
        {
            $inc: {
                commentsCount: 1
            }
        },
        {
            session
        }
    );
};

export const decrementPostComment = async (postId, decrementCount, session) => {

    await postModel.updateOne(
        {
            _id: postId,
            isDeleted: false
        },
        {
            $inc: {
                commentsCount: -decrementCount
            }
        },
        {
            session
        }
    );
};

export const incrementLikeCount = async (postId, session) => {

    await postModel.updateOne(
        {
            _id: postId,
            isDeleted: false
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

export const decrementLikeCount = async (postId, session) => {

    await postModel.updateOne(
        {
            _id: postId,
            isDeleted: false
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