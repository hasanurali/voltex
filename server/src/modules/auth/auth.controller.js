import { StatusCodes } from "http-status-codes";

import { asyncHandler, ApiResponse } from "../../shared/utils/index.js";
import * as services from "./auth.service.js";
import { AUTH_MESSAGES } from "../../shared/constants/messages/index.js";

export const registerController = asyncHandler(async (req, res) => {

    const userData = req.body;

    const user = await services.registerService(userData);

    return res.status(StatusCodes.OK).json(new ApiResponse(AUTH_MESSAGES.REGISTER_SUCCESS, user));
});