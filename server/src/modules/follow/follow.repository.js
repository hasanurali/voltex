import followModel from "./follow.model.js";

export const followUser = async (follower, following, session) => {

    await followModel.create([{
        follower,
        following
    }], { session });
};

export const checkFollowing = async (follower, following) => {

    const isFollowing = await followModel.exists({
        follower,
        following
    });

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
            $lookup: {
                from: "users",
                localField: "follower",
                foreignField: "_id",
                pipeline: [
                    {
                        $match: {
                            isEmailVerified: true,
                            status: "active",
                            isDeleted: false
                        }
                    },
                ],
                as: "user"
            }
        },

        {
            $unwind: "$user"
        },

        {
            $lookup: {
                from: "profiles",
                localField: "user._id",
                foreignField: "user",
                as: "profile"
            }
        },

        {
            $unwind: "$profile"
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
                        $project: {
                            _id: "$user._id",
                            displayName: "$user.displayName",
                            username: "$user.username",
                            avatar: {
                                url: "$profile.avatar.url"
                            }
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
            $lookup: {
                from: "users",
                localField: "following",
                foreignField: "_id",
                pipeline: [
                    {
                        $match: {
                            isEmailVerified: true,
                            status: "active",
                            isDeleted: false
                        }
                    },
                ],
                as: "user"
            }
        },

        {
            $unwind: "$user"
        },

        {
            $lookup: {
                from: "profiles",
                localField: "user._id",
                foreignField: "user",
                as: "profile"
            }
        },

        {
            $unwind: "$profile"
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
                        $project: {
                            _id: "$user._id",
                            displayName: "$user.displayName",
                            username: "$user.username",
                            avatar: {
                                url: "$profile.avatar.url"
                            }
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

    await followModel.deleteOne({
        follower,
        following
    }, { session });
};

export const fetchUserFollowingIds = async (userId) => {

    const followingIds = await followModel.find({
        follower: userId
    });

    return followingIds;
};

export const fetchUsersFollowingIds = async (userIds) => {

    const followingIds = await followModel.find({
        follower: {
            $in: userIds
        }
    });

    return followingIds;
};