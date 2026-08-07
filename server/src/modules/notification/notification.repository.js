import notificationModel from "./notification.model.js";

export const createNotification = async (notificationData) => {

    const notification = await notificationModel.create(notificationData);

    return notification;
};

export const fetchNotifications = async (userId, skip, safeLimit) => {

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
                    }
                ]
            }
        }
    ]);

    return result;
};



