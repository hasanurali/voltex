import { StatusCodes } from "http-status-codes";

import { asyncHandler, ApiResponse } from "../../shared/utils/index.js";
import * as services from "./auth.service.js";
import { AUTH_MESSAGES } from "../../shared/constants/messages/index.js";
import COOKIE_CONFIG from "../../config/cookie.js";

export const registerController = asyncHandler(async (req, res) => {

    const userData = req.body;

    const user = await services.registerService(userData);

    return res.status(StatusCodes.CREATED)
        .json(new ApiResponse(AUTH_MESSAGES.REGISTER_SUCCESS, user));
});

export const verifyEmailController = asyncHandler(async (req, res) => {

    const varificationData = req.body;

    const { user, refreshToken, accessToken } = await services.verifyEmailService(varificationData);

    return res.status(StatusCodes.OK)
        .cookie("refreshToken", refreshToken, COOKIE_CONFIG.REFRESH)
        .cookie("accessToken", accessToken, COOKIE_CONFIG.ACCESS)
        .json(new ApiResponse(AUTH_MESSAGES.EMAIL_VERIFIED, user));
});

export const resendOtpController = asyncHandler(async (req, res) => {

    const email = req.body.email;

    await services.resendOtpService(email);

    return res.status(StatusCodes.OK)
        .json(new ApiResponse(AUTH_MESSAGES.OTP_SENT_SUCCESS));
});

export const loginController = asyncHandler(async (req, res) => {

    const loginData = req.body;

    const { user, refreshToken, accessToken } = await services.loginService(loginData);

    return res.status(StatusCodes.OK)
        .cookie("refreshToken", refreshToken, COOKIE_CONFIG.REFRESH)
        .cookie("accessToken", accessToken, COOKIE_CONFIG.ACCESS)
        .json(new ApiResponse(AUTH_MESSAGES.LOGIN_SUCCESS, user));
});

export const logoutController = asyncHandler(async (req, res) => {

    const userId = req.user.id;

    await services.logoutService(userId);

    return res.status(StatusCodes.OK)
        .clearCookie("refreshToken", COOKIE_CONFIG.REFRESH)
        .clearCookie("accessToken", COOKIE_CONFIG.ACCESS)
        .json(new ApiResponse(AUTH_MESSAGES.LOGOUT_SUCCESS));
});

export const refreshTokenController = asyncHandler(async (req, res) => {

    const refreshToken = req.cookies.refreshToken;

    const { newRefreshToken, newAccessToken } = await services.refreshTokenService(refreshToken);

    return res.status(StatusCodes.OK)
        .cookie("refreshToken", newRefreshToken, COOKIE_CONFIG.REFRESH)
        .cookie("accessToken", newAccessToken, COOKIE_CONFIG.ACCESS)
        .json(new ApiResponse(AUTH_MESSAGES.TOKEN_REFRESH_SUCCESS));
});

export const forgotPasswordController = asyncHandler(async (req, res) => {

    const email = req.body.email;

    await services.forgotPasswordService(email);

    return res.status(StatusCodes.OK)
        .json(new ApiResponse(AUTH_MESSAGES.PASSWORD_RESET_LINK_SENT_SUCCESS));
});

export const resetPasswordController = asyncHandler(async (req, res) => {

    const resetPasswordData = req.body;

    await services.resetPasswordService(resetPasswordData);

    return res.status(StatusCodes.OK)
        .json(new ApiResponse(AUTH_MESSAGES.PASSWORD_RESET_SUCCESS));
});