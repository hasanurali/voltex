import notificationModel from "./notification.model.js";

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
                    }
                ],

                metadata: [
                    {
                        $count: "total"
                    },
                ],

                unread: [
                    { $match: { isRead: false } },
                    { $count: "unreadCount" }
                ]
            }
        }
    ]);

    return result;
};

export const findNotificationById = async (notificationId) => {

    const notification = await notificationModel.findById(notificationId);

    return notification;
};

export const markNotificationAsRead = async (notificationId) => {

    await notificationModel.findByIdAndUpdate(notificationId, {
        $set: {
            isRead: true
        }
    });
};

export const markAllNotificationAsRead = async (userId) => {

    await notificationModel.updateMany({ user: userId, isRead: false }, {
        $set: {
            isRead: true
        }
    });
};

export const deleteNotification = async (notificationId) => {

    await notificationModel.findByIdAndDelete(notificationId);
};