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