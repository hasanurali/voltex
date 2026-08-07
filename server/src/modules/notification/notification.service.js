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

export const fetchNotificationService = async (userId, page = 1, limit = 10) => {

    const userObjectId = convertToObjectId(userId);

    const parsedPage = Number(page);
    const parsedLimit = Number(limit);

    const safePage = Number.isFinite(parsedPage) ?
        Math.max(Math.floor(parsedPage), 1)
        :
        1;

    const safeLimit = Number.isFinite(parsedLimit) ?
        Math.min(Math.max(Math.floor(parsedLimit), 1), 50)
        :
        10;

    const skip = (safePage - 1) * safeLimit;

    const result = await notificationRepository.fetchNotifications(userObjectId, skip, safeLimit);

    const notifications = result?.data ?? [];
    const total = result?.metadata?.[0]?.total ?? 0;

    const totalPages = Math.ceil(total / safeLimit);

    return {
        data: notifications,
        pagination: {
            total,
            page: safePage,
            limit: safeLimit,
            totalPages,
            hasNextPage: safePage < totalPages,
            hasPrevPage: safePage > 1
        }
    };
};