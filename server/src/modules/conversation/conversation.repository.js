import conversationModel from "./conversation.model.js";

export const fetchConversations = async (userId, skip, limit) => {

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
                        $match: {
                            isEmailVerified: true,
                            status: "active",
                            isDeleted: false
                        }
                    },
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

            $lookup: {
                from: "messages",
                localField: "lastMessage",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: {
                            _id: 0,
                            content: 1,
                            createdAt: 1,
                        }
                    }
                ],
                as: "message"
            }

        },

        {
            $unwind: "$message"
        },

        {
            $group: {
                _id: "$_id",
                name: { $first: "$name" },
                participant: {
                    $first: {
                        _id: "$user._id",
                        displayName: "$user.displayName",
                        username: "$user.username",
                        avatar: {
                            url: "$profile.avatar.url"
                        }
                    }
                },
                lastMessage: { $first: "$message" },
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
            $lookup: {
                from: "users",
                localField: "participants",
                foreignField: "_id",
                pipeline: [
                    {
                        $match: {
                            isEmailVerified: true,
                            status: "active",
                            isDeleted: false
                        }
                    },
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
            $match: {
                $expr: {
                    $eq: [
                        { $size: "$user" },
                        { $size: "$participants" }
                    ]
                }
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

export const createConversation = async (participants) => {

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

export const findConversationByIdAndUser = async (conversationId, userId) => {

    const conversation = await conversationModel.findOne({
        _id: conversationId,
        participants: userId
    });

    return conversation;
};

export const setLastMessage = async (conversationId, lastMessageId, session) => {

    await conversationModel.findByIdAndUpdate(conversationId,
        {
            $set: {
                lastMessage: lastMessageId
            }
        }, { session }
    );
};