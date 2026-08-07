import { StatusCodes } from "http-status-codes";

import * as services from "./notification.service.js";
import { asyncHandler, ApiResponse } from "../../shared/utils/index.js";
import { NOTIFICATION_MESSAGES } from "../../shared/constants/messages/index.js";

export const fetchNotificationController = asyncHandler(async (req, res) => {

    const userId = req.user.id;

    const { page, limit } = req.query;

    const notifications = await services.fetchNotificationService(userId, page, limit);

    return res.status(StatusCodes.OK)
        .json(new ApiResponse(NOTIFICATION_MESSAGES.NOTIFICATION_FETCH_SUCCESS, notifications));
});

export const markNotificationAsReadController = asyncHandler(async (req, res) => {

    const notificationId = req.params.notificationId;

    const userId = req.user.id;

    await services.markNotificationAsReadService(userId, notificationId);

    return res.status(StatusCodes.OK)
        .json(new ApiResponse(NOTIFICATION_MESSAGES.NOTIFICATION_MARK_READ_SUCCESS));
});

export const markAllNotificationAsReadController = asyncHandler(async (req, res) => {

    const userId = req.user.id;

    await services.markAllNotificationAsReadService(userId);

    return res.status(StatusCodes.OK)
        .json(new ApiResponse(NOTIFICATION_MESSAGES.NOTIFICATIONS_MARK_READ_ALL_SUCCESS));
});

export const deleteNotificationController = asyncHandler(async (req, res) => {

    const notificationId = req.params.notificationId;

    const userId = req.user.id;

    await services.deleteNotificationService(userId, notificationId);

    return res.status(StatusCodes.OK)
        .json(new ApiResponse(NOTIFICATION_MESSAGES.NOTIFICATION_DELETE_SUCCESS));
});