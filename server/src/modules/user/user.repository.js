import userModel from "../auth/user.model.js";


export const searchUsers = async (search, skip, limit, userId = null) => {

    const [users] = await userModel.aggregate([
        {
            $search: {
                index: "user_search",
                compound: {

                    // Exclude unverified, inactive and deleted users
                    filter: [
                        {
                            equals: {
                                path: "isEmailVerified",
                                value: true,
                            },
                        },
                        {
                            equals: {
                                path: "status",
                                value: "active",
                            },
                        },
                        {
                            equals: {
                                path: "isDeleted",
                                value: false,
                            },
                        },
                    ],

                    // Search by username and display name
                    // Username receives a higher relevance score
                    should: [
                        {
                            autocomplete: {
                                query: search,
                                path: "username",
                                score: {
                                    boost: {
                                        value: 5,
                                    },
                                },
                            },
                        },
                        {
                            autocomplete: {
                                query: search,
                                path: "displayName",
                            },
                        },
                    ],

                    minimumShouldMatch: 1,

                },
            },
        },

        // Return paginated results and the total matching user count
        {
            $facet: {
                data: [
                    {
                        $skip: skip
                    },
                    {
                        $limit: limit
                    },

                    // Attach the user's profile so the avatar can be returned
                    {
                        $lookup: {
                            from: "profiles",
                            localField: "_id",
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
                        },
                    },

                    // Convert the profile array into a single profile object
                    {
                        $unwind: {
                            path: "$profile",
                        },
                    },

                    // Attach the following data so the isFollowing flag can be returned
                    {
                        $lookup: {
                            from: "follows",
                            let: {
                                targetId: "$_id"
                            },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ["$following", "$$targetId"] },
                                                { $ne: [userId, null] },
                                                { $eq: ["$follower", userId] }
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
                            as: "following"
                        }
                    },

                    // Return only fields required by the user-search response
                    {
                        $project: {
                            _id: 1,
                            username: 1,
                            displayName: 1,
                            avatar: "$profile.avatar.url",
                            isFollowing: {
                                $gt: [{ $size: { $ifNull: ["$following", []] } }, 0]
                            }
                        },
                    },
                ],

                metadata: [
                    {
                        $count: "total"
                    },
                ],
            },
        },

    ]);

    return users;
};