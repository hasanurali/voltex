import { StatusCodes } from "http-status-codes";

import { asyncHandler, ApiResponse } from "../../shared/utils/index.js";
import * as services from "./user.service.js";
import { USER_MESSAGE } from "../../shared/constants/messages/index.js";

export const fetchUsersController = asyncHandler(async (req, res) => {

    const { page, limit, search } = req.query;

    const userData = await services.fetchUsersService(page, limit, search);

    return res.status(StatusCodes.OK)
        .json(new ApiResponse(USER_MESSAGE.FETCH_SUCCESS, userData));
});