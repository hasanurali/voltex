import conversationModel from "./conversation.model.js";

export const fetchConversation = async (userId, skip, limit) => {

    const [result] = await conversationModel.aggregate([
        {
            $match: {
                participants: userId
            },
        },

        {
            $sort: {
                updatedAt: -1
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
                        $unwind: "$participants"
                    },
                    {
                        $match: {
                            participants: {
                                $ne: userId
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "participants",
                            foreignField: "_id",
                            pipeline: [
                                {
                                    $project: {
                                        _id: 1,
                                        displayName: 1,
                                        username: 1,
                                    }
                                }
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
                        $group: {
                            _id: "$_id",
                            name: { $first: "$name" },
                            lastMessage: { $first: "$lastMessage" },
                            participant: {
                                $first: {
                                    _id: "$user._id",
                                    displayName: "$user.displayName",
                                    username: "$user.username",
                                    avatar: {
                                        url: "$profile.avatar.url"
                                    }
                                }
                            }
                        }
                    },
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