import * as notificationRepository from "./notification.repository.js";
import { convertToObjectId, log } from "../../shared/utils/index.js";
import { NOTIFICATION_TARGET_TYPE, NOTIFICATION_TYPE } from "../../shared/constants/enums/index.js";

export const createNotification = async ({ user, triggeredBy, entityId, entityType, type, metadata = null }) => {

    if (user.toString() === triggeredBy.toString()) {
        return;
    };

    const userObjectId = convertToObjectId(user);
    const triggeredByObjectId = convertToObjectId(triggeredBy);
    const entityObjectId = convertToObjectId(entityId);

    if (!userObjectId || !triggeredByObjectId || !entityObjectId) {
        throw new Error("Invalid notification entity ID");
    };

    if (!Object.values(NOTIFICATION_TARGET_TYPE).includes(entityType)) {
        throw new Error(`Invalid notification target type: ${entityType}`);
    };

    if (!Object.values(NOTIFICATION_TYPE).includes(type)) {
        throw new Error(`Invalid notification type: ${type}`);
    };

    const notificationData = {
        user: userObjectId,
        triggeredBy: triggeredByObjectId,
        entityId: entityObjectId,
        entityType,
        type,
        ...(metadata && { metadata })
    };

    try {

        const notification = await notificationRepository.createNotification(notificationData);

        // Socket.io later

        return notification;

    } catch (error) {
        log(`Notification creation failed: ${error.message}`);
    };
}; 