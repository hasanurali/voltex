import userModel from "../auth/user.model.js";


export const searchUsers = async (search, skip, limit) => {

    const [users] = await userModel.aggregate([
        {
            $search: {
                index: "user_search",
                compound: {

                    // Exclude unverified, inactive, and deleted users.
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

                    // Search by username and display name.
                    // Username receives a higher relevance score.
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

        // Attach the user's profile so the avatar can be returned.
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

        // Convert the profile array into a single profile object.
        {
            $unwind: {
                path: "$profile",
            },
        },

        // Return only fields required by the user-search response.
        {
            $project: {
                _id: 1,
                username: 1,
                displayName: 1,
                avatar: "$profile.avatar.url"
            },
        },

        // Return paginated results and the total matching user count.
        {
            $facet: {
                data: [
                    {
                        $skip: skip
                    },
                    {
                        $limit: limit
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