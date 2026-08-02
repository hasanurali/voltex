import postModel from "./post.model.js";
import { VISIBILITY_TYPE } from "../../shared/constants/enums/index.js"

export const createPost = async (postData, session) => {

    const post = await postModel.create([postData], { session });

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
                                    $lt: new mongoose.Types.ObjectId(cursor.postId)
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

        // Lookup user for displayName and username
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

        // Lookup profile for user avatar
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

        // Return only feed data
        {
            $project: {
                _id: 1,
                author: {
                    _id: "$user._id",
                    displayName: "$user.displayName",
                    username: "$user.username",
                    avatar: {
                        url: "$profile.avatar.url"
                    }
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
                commentsCount: 1,
                likesCount: 1,
                visibility: 1,
                isEdited: 1,
                createdAt: 1,
                finalScore: 1
            }
        }
    ]);

    return feedPosts;
};

export const fetchPostDetails = async (postId) => {

    const detailedPost = await postModel.aggregate([
        {
            $match: {
                _id: postId,
                isDeleted: false
            }
        },

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
                    avatar: {
                        url: "$profile.avatar.url"
                    }
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
                hashtags: 1,
                commentsCount: 1,
                likesCount: 1,
                visibility: 1,
                isEdited: 1,
                createdAt: 1,
                finalScore: 1
            }
        }
    ]);

    return detailedPost;
}

export const fetchUserPosts = async (userId, limit, skip) => {

    const userPostsData = postModel.aggregate([
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
                                avatar: {
                                    url: "$profile.avatar.url"
                                }
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
                            commentsCount: 1,
                            likesCount: 1,
                            visibility: 1,
                            isEdited: 1,
                            createdAt: 1,
                        }
                    }
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