import notificationModel from "./notification.model.js";
import { executeWithConfig } from "../../shared/utils/index.js";

export const createNotification = async (notificationData) => {

    const notification = await notificationModel.create(notificationData);

    return notification;
};

export const fetchNotificationsByUserId = async (userId, skip, safeLimit) => {

    const [result] = await notificationModel.aggregate([
        {
            $match: {
                user: userId,
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
                        $limit: safeLimit
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "triggeredBy",
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
                            as: "triggerdUser"
                        }
                    },
                    {
                        $unwind: "$triggerdUser"
                    },
                    {
                        $lookup: {
                            from: "profiles",
                            localField: "triggerdUser._id",
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
                            from: "posts",
                            localField: "metadata.postId",
                            foreignField: "_id",
                            as: "post"
                        }
                    },
                    {
                        $unwind: {
                            path: "$post",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $lookup: {
                            from: "comments",
                            localField: "metadata.commentId",
                            foreignField: "_id",
                            as: "comment"
                        }
                    },
                    {
                        $unwind: {
                            path: "$comment",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            user: 1,
                            triggeredBy: {
                                id: "$triggerdUser._id",
                                displayName: "$triggerdUser.displayName",
                                username: "$triggerdUser.username",
                                avatar: "$profile.avatar.url"
                            },
                            entityId: 1,
                            entityType: 1,
                            type: 1,
                            metadata: {
                                post: {
                                    $cond: {
                                        if: { $eq: [{ $ifNull: ["$post", null] }, null] },
                                        then: null,
                                        else: {
                                            _id: "$post._id",
                                            author: "$post.author",
                                            content: {
                                                $substrCP: ["$post.content", 0, 60]
                                            },
                                            media: {
                                                $cond: {
                                                    if: { $gt: [{ $size: { $ifNull: ["$post.media", []] } }, 0] },
                                                    then: {
                                                        mediaType: { $arrayElemAt: ["$post.media.mediaType", 0] },
                                                        url: { $arrayElemAt: ["$post.media.url", 0] }
                                                    },
                                                    else: null
                                                }
                                            }
                                        }
                                    },
                                },

                                comment: {
                                    $cond: {
                                        if: { $eq: [{ $ifNull: ["$comment", null] }, null] },
                                        then: null,
                                        else: {
                                            _id: "$comment._id",
                                            author: "$comment.author",
                                            content: {
                                                $substrCP: ["$comment.content", 0, 60]
                                            },
                                        }
                                    }
                                }

                            },
                            isRead: 1,
                            createdAt: 1
                        }
                    }
                ],

                metadata: [
                    {
                        $count: "total"
                    },
                ],

                unread: [
                    {
                        $match: {
                            isRead: false
                        }
                    },
                    {
                        $count: "unreadCount"
                    }
                ]
            }
        }
    ]);

    return result;
};

export const findNotificationById = async (notificationId, queryConfig = {}) => {

    const baseQuery = notificationModel.findById(notificationId);

    return await executeWithConfig(baseQuery, queryConfig);
};

export const markNotificationAsRead = async (notificationId) => {

    await notificationModel.updateOne(
        {
            _id: notificationId
        },
        {
            $set: {
                isRead: true
            }
        }
    );
};

export const markAllNotificationAsRead = async (userId) => {

    await notificationModel.updateMany(
        {
            user: userId,
            isRead: false
        },
        {
            $set: {
                isRead: true
            }
        });
};

export const deleteNotification = async (notificationId) => {

    await notificationModel.deleteOne(
        {
            _id: notificationId
        }
    );
};