import conversationModel from "./conversation.model.js";
import { executeWithConfig } from "../../shared/utils/index.js";


// Reusable aggregation pipelines
const participantProfileFetchingPipeline = [
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
];


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
            $facet: {
                data: [
                    {
                        $skip: skip
                    },
                    {
                        $limit: limit
                    },

                    ...participantProfileFetchingPipeline,

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
                        $unwind: {
                            path: "$message",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $group: {
                            _id: "$_id",
                            name: {
                                $first: "$name"
                            },
                            participant: {
                                $first: {
                                    _id: "$user._id",
                                    displayName: "$user.displayName",
                                    username: "$user.username",
                                    avatar: "$profile.avatar.url"
                                }
                            },
                            lastMessage: { $first: "$message" },
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

        ...participantProfileFetchingPipeline,

        {
            $group: {
                _id: "$_id",
                name: {
                    $first: "$name"
                },
                participants: {
                    $push: {
                        _id: "$user._id",
                        displayName: "$user.displayName",
                        username: "$user.username",
                        avatar: "$profile.avatar.url"
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

export const findConversationByIdAndUser = async (conversationId, userId, queryConfig = {}) => {

    const baseQuery = conversationModel.findOne(
        {
            _id: conversationId,
            participants: userId
        }
    );

    return await executeWithConfig(baseQuery, queryConfig);
};

export const checkConversationExistsByIdAndUser = async (conversationId, userId) => {

    const isConversationExists = await conversationModel.exists(
        {
            _id: conversationId,
            participants: userId
        }
    );

    return isConversationExists;
};

export const setLastMessage = async (conversationId, lastMessageId, session) => {

    await conversationModel.updateOne(
        {
            _id: conversationId
        },
        {
            $set: {
                lastMessage: lastMessageId
            }
        },
        {
            session
        }
    );
};