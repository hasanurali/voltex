import { StatusCodes } from "http-status-codes";

import * as notificationRepository from "./notification.repository.js";
import { ApiError, convertToObjectId, log, pagination } from "../../shared/utils/index.js";
import { NOTIFICATION_TARGET_TYPE, NOTIFICATION_TYPE } from "../../shared/constants/enums/index.js";
import { NOTIFICATION_MESSAGES } from "../../shared/constants/messages/index.js"

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

export const fetchNotificationService = async (userId, page, limit) => {

    const { page: safePage, limit: safeLimit, skip } = pagination(page, limit);

    const result = await notificationRepository.fetchNotificationsByUserId(userId, skip, safeLimit);

    const notifications = result?.data ?? [];
    const total = result?.metadata?.[0]?.total ?? 0;
    const unreadCount = result?.unread?.[0]?.unreadCount ?? 0;

    const totalPages = Math.ceil(total / safeLimit);

    return {
        notifications,
        unreadCount,
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

export const markNotificationAsReadService = async (userId, notificationId) => {

    const notificationObjectId = convertToObjectId(notificationId);
    if (!notificationObjectId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, NOTIFICATION_MESSAGES.INVALID_NOTIFICATION_ID);
    };

    const notification = await notificationRepository.findNotificationById(notificationObjectId, { select: "user isRead", lean: true });
    if (!notification) {
        throw new ApiError(StatusCodes.NOT_FOUND, NOTIFICATION_MESSAGES.NOT_FOUND);
    };

    if (notification.user.toString() !== userId.toString()) {
        throw new ApiError(StatusCodes.FORBIDDEN, NOTIFICATION_MESSAGES.NOT_OWNER);
    };

    if (notification.isRead) {
        return;
    };

    await notificationRepository.markNotificationAsRead(notificationObjectId);
};

export const markAllNotificationAsReadService = async (userId) => {

    await notificationRepository.markAllNotificationAsRead(userId);
};

export const deleteNotificationService = async (userId, notificationId) => {

    const notificationObjectId = convertToObjectId(notificationId);
    if (!notificationObjectId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, NOTIFICATION_MESSAGES.INVALID_NOTIFICATION_ID);
    };

    const notification = await notificationRepository.findNotificationById(notificationObjectId, { select: "user", lean: true });
    if (!notification) {
        throw new ApiError(StatusCodes.NOT_FOUND, NOTIFICATION_MESSAGES.NOT_FOUND);
    };

    if (notification.user.toString() !== userId.toString()) {
        throw new ApiError(StatusCodes.FORBIDDEN, NOTIFICATION_MESSAGES.NOT_OWNER);
    };

    await notificationRepository.deleteNotification(notificationObjectId);
};