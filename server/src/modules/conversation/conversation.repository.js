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

export const fetchConversationDetails = async (userId, conversationId) => {

    const [conversationDetails] = await conversationModel.aggregate([
        {
            $match: {
                _id: conversationId,
                participants: userId
            },
        },
        {
            $unwind: "$participants"
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
                participants: {
                    $push: {
                        _id: "$user._id",
                        displayName: "$user.displayName",
                        username: "$user.username",
                        avatar: {
                            url: "$profile.avatar.url"
                        }
                    }
                }
            }
        }
    ]);

    return conversationDetails;
};

export const createConversation = async (conversationId, participants) => {

    const conversationExists = await (
        conversationId && conversationModel.findById(conversationId)
    );
    if (conversationExists) {
        return conversationExists;
    };

    const isValidParticipants = participants.every(Boolean);
    if (!isValidParticipants) {
        return null;
    };

    const name = [...participants].sort().join("-");

    const conversation = await conversationModel.findOneAndUpdate(
        {
            name
        },
        {
            $setOnInsert: {
                name,
                participants
            }
        },
        {
            upsert: true,
            returnDocument: "after"
        },
    );

    return conversation;
};

export const findConversation = async (conversationId, userId) => {

    const conversation = await conversationModel.findOne({
        _id: conversationId,
        participants: userId
    });

    return conversation;
};