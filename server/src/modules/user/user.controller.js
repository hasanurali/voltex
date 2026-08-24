import { StatusCodes } from "http-status-codes";

import { asyncHandler, ApiResponse } from "../../shared/utils/index.js";
import * as services from "./user.service.js";
import { USER_MESSAGES } from "../../shared/constants/messages/index.js";

export const fetchUsersController = asyncHandler(async (req, res) => {

    const { page, limit, search } = req.query;

    const userData = await services.fetchUsersService(page, limit, search);

    return res.status(StatusCodes.OK)
        .json(new ApiResponse(USER_MESSAGES.FETCH_SUCCESS, userData));
});

export const checkUserStatusesController = asyncHandler(async (req, res) => {

    const userIds = req.body.userIds;

    const userStatuses = await services.checkUserStatusesService(userIds);

    return res.status(StatusCodes.OK)
        .json(new ApiResponse(USER_MESSAGES.USER_STATUSES_FETCH_SUCCESS, userStatuses));
});