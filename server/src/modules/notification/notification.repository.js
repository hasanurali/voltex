import notificationModel from "./notification.model.js";

export const createNotification = async (notificationData) => {

    const notification = await notificationModel.create(notificationData);

    return notification;
};