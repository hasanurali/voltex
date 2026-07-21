import { StatusCodes } from "http-status-codes";

import { asyncHandler, ApiResponse } from "../../shared/utils/index.js";
import * as services from "./auth.service.js";
import { AUTH_MESSAGES } from "../../shared/constants/messages/index.js";
import COOKIE_CONFIG from "../../config/cookie.js";

export const registerController = asyncHandler(async (req, res) => {

    const userData = req.body;

    const user = await services.registerService(userData);

    return res.status(StatusCodes.OK).json(new ApiResponse(AUTH_MESSAGES.REGISTER_SUCCESS, user));
});

export const verifyEmailController = asyncHandler(async (req, res) => {

    const varificationData = req.body;

    const { user, refreshToken, accessToken } = await services.verifyEmailService(varificationData);

    return res.status(StatusCodes.OK)
        .cookie("refreshToken", refreshToken, COOKIE_CONFIG.REFRESH)
        .cookie("accessToken", accessToken, COOKIE_CONFIG.ACCESS)
        .json(new ApiResponse(AUTH_MESSAGES.EMAIL_VERIFIED, user));
});