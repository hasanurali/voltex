import messageModel from "./message.model.js";
import { executeWithConfig } from "../../shared/utils/index.js";


// Reusable aggregation pipelines
const messageResponsePipeline = [
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
        $project: {
            _id: 1,
            conversation: 1,
            sender: {
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
            isSeen: 1,
            seenAt: 1,
            isDeleted: 1,
            createdAt: 1
        }
    }
];


export const createMessage = async (messageData, session) => {

    const [createdMessage] = await messageModel.create(
        [
            messageData
        ],
        {
            session
        }
    );

    const [message] = await messageModel.aggregate([
        {
            $match: {
                _id: createdMessage._id
            }
        },

        ...messageResponsePipeline
    ],
        {
            session
        });

    return message
};

export const fetchConversationMessages = async (conversationId, skip, limit) => {

    const [result] = await messageModel.aggregate([
        {
            $match: {
                conversation: conversationId,
                isDeleted: false
            },
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

                    ...messageResponsePipeline
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

export const findMessageById = async (messageId, queryConfig = {}) => {

    const baseQuery = messageModel.findOne(
        {
            _id: messageId,
            isDeleted: false
        }
    );

    return await executeWithConfig(baseQuery, queryConfig);
};

export const findLastMessageByConversationId = async (conversationId, session, queryConfig = {}) => {

    const baseQuery = messageModel.findOne(
        {
            conversation: conversationId,
            isDeleted: false
        }
    ).session(session).sort(
        {
            createdAt: -1
        }
    );

    return await executeWithConfig(baseQuery, queryConfig);
};

export const softDeleteMessage = async (messageId, session) => {

    await messageModel.updateOne(
        {
            _id: messageId,
            isDeleted: false
        },
        {
            $set: {
                isDeleted: true,
                deletedAt: new Date()
            }
        },
        {
            session
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