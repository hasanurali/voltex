import messageModel from "./message.model.js";

export const createMessage = async (messageData, session) => {

    const [message] = await messageModel.create([messageData], { session });

    return message;
};

export const findAllConversationMessages = async (conversationId, skip, limit) => {

    const [result] = await messageModel.aggregate([
        {
            $match: {
                conversation: conversationId,
                isDeleted: false
            },
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
                    {
                        $lookup: {
                            from: "users",
                            localField: "sender",
                            foreignField: "_id",
                            pipeline: [
                                {
                                    $project: {
                                        _id: 1,
                                        displayName: 1,
                                        username: 1
                                    }
                                }
                            ],
                            as: "sender"
                        }
                    },
                    {
                        $unwind: "$sender"
                    },
                    {
                        $lookup: {
                            from: "profiles",
                            localField: "sender._id",
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
                        $project: {
                            _id: 1,
                            conversation: 1,
                            content: 1,
                            media: 1,
                            isSeen: 1,
                            seenAt: 1,
                            isDeleted: 1,
                            deletedAt: 1,
                            createdAt: 1,
                            sender: {
                                _id: "$sender._id",
                                displayName: "$sender.displayName",
                                username: "$sender.username",
                                avatar: {
                                    url: "$profile.avatar.url"
                                }
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

    return result;
};

export const findMessage = async (messageId) => {

    const message = await messageModel.findOne({
        _id: messageId,
        isDeleted: false
    });

    return message;
};

export const softDeleteMessage = async (messageId) => {

    await messageModel.findOneAndUpdate(
        {
            _id: messageId,
            isDeleted: false
        },
        {
            $set: {
                isDeleted: true,
                deletedAt: new Date()
            }
        }
    );
};

export const markMessagesAsRead = async (conversationId, userId) => {

    await messageModel.updateMany(
        {
            conversation: conversationId,
            sender: {
                $ne: userId
            },
            isDeleted: false,
            isSeen: false
        },
        {
            $set: {
                isSeen: true,
                seenAt: new Date()
            }
        }
    );
};