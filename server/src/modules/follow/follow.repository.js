import followModel from "./follow.model.js";


// Reusable aggregation pipelines
const userProfileFetchingPipeline = [
    {
        $lookup: {
            from: "profiles",
            localField: "user._id",
            foreignField: "user",
            pipeline: [
                {
                    $project: {
                        _id: 0,
                        avatar: 1
                    }
                },
            ],
            as: "profile"
        }
    },
    {
        $unwind: "$profile"
    },
];


export const followUser = async (follower, following, session) => {

    await followModel.create(
        [
            {
                follower,
                following
            }
        ],
        {
            session
        }
    );
};

export const checkFollowingExists = async (follower, following) => {

    const isFollowing = await followModel.exists(
        {
            follower,
            following
        }
    );

    return isFollowing;
};

export const fetchFollowersByUserId = async (userId, skip, limit) => {

    const [followers] = await followModel.aggregate([
        {
            $match: {
                following: userId
            }
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
                    {
                        $lookup: {
                            from: "users",
                            localField: "follower",
                            foreignField: "_id",
                            pipeline: [
                                {
                                    $project: {
                                        _id: 1,
                                        displayName: 1,
                                        username: 1
                                    }
                                },
                            ],
                            as: "user"
                        }
                    },
                    {
                        $unwind: "$user"
                    },

                    ...userProfileFetchingPipeline,

                    {
                        $project: {
                            _id: "$user._id",
                            displayName: "$user.displayName",
                            username: "$user.username",
                            avatar: "$profile.avatar.url"
                        }
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

    return followers;
};

export const fetchFollowingsByUserId = async (userId, skip, limit) => {

    const [followings] = await followModel.aggregate([
        {
            $match: {
                follower: userId
            }
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
                    {
                        $lookup: {
                            from: "users",
                            localField: "following",
                            foreignField: "_id",
                            pipeline: [
                                {
                                    $project: {
                                        _id: 1,
                                        displayName: 1,
                                        username: 1
                                    }
                                },
                            ],
                            as: "user"
                        }
                    },
                    {
                        $unwind: "$user"
                    },

                    ...userProfileFetchingPipeline,

                    {
                        $project: {
                            _id: "$user._id",
                            displayName: "$user.displayName",
                            username: "$user.username",
                            avatar: "$profile.avatar.url"
                        }
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

    return followings;
};

export const unfollowUser = async (follower, following, session) => {

    await followModel.deleteOne(
        {
            follower,
            following
        },
        {
            session
        }
    );
};

export const fetchUserFollowingIds = async (userId) => {

    const followingIds = await followModel.find(
        {
            follower: userId
        }
    ).select("following").lean();

    return followingIds;
};

export const fetchUsersFollowingIds = async (userIds) => {

    const followingIds = await followModel.find(
        {
            follower: {
                $in: userIds
            }
        }
    ).select("following").lean();

    return followingIds;
};