import { StatusCodes } from "http-status-codes";

import * as authRepository from "./auth.repository.js";
import { ApiError, otpGenerator } from "../../shared/utils/index.js";
import * as mailService from "../../shared/mail/mail.service.js";
import { AUTH_MESSAGES } from "../../shared/constants/messages/index.js";


export const registerService = async (userData) => {

    const user = await authRepository.createUser(userData);

    const otp = otpGenerator();

    await authRepository.createOtp({ email: user.email, otp });

    await mailService.sendOtp(user.email, user.displayName, otp);

    return user;
};

export const verifyEmailService = async ({ email, otp }) => {

    if (!email) {
        throw new ApiError(StatusCodes.BAD_REQUEST, AUTH_MESSAGES.VERIFICATION_SESSION_EXPIRED);
    };

    const user = await authRepository.findUserByEmail(email);
    if (!user) {
        throw new ApiError(StatusCodes.BAD_REQUEST, AUTH_MESSAGES.VERIFICATION_SESSION_EXPIRED);
    };

    if (user.isEmailVerified) {
        throw new ApiError(StatusCodes.CONFLICT, AUTH_MESSAGES.EMAIL_ALREADY_VERIFIED)
    };

    const isValidOtp = await authRepository.matchOtp(email, otp);
    if (!isValidOtp) {
        throw new ApiError(StatusCodes.BAD_REQUEST, AUTH_MESSAGES.INVALID_OTP);
    };

    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();

    const [updatedUser] = await Promise.all([
        authRepository.markEmailVerified(user._id),
        authRepository.deleteOtpByEmail(email)
    ]);

    await updatedUser.setRefreshTokenWithHash(refreshToken);

    return { user: updatedUser, refreshToken, accessToken };
};

export const resendOtpService = async (email) => {

    if (!email) {
        throw new ApiError(StatusCodes.BAD_REQUEST, AUTH_MESSAGES.VERIFICATION_SESSION_EXPIRED);
    };

    const user = await authRepository.findUserByEmail(email);
    if (!user) {
        throw new ApiError(StatusCodes.BAD_REQUEST, AUTH_MESSAGES.VERIFICATION_SESSION_EXPIRED);
    };

    if (user.isEmailVerified) {
        throw new ApiError(StatusCodes.CONFLICT, AUTH_MESSAGES.EMAIL_ALREADY_VERIFIED)
    };

    const otp = otpGenerator();

    await authRepository.setNewOtp({ email, otp });

    await mailService.sendOtp(email, user.displayName, otp);
};

export const loginService = async ({ email, password }) => {

    const user = await authRepository.findUserByEmail(email, "+password");
    if (!user) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, AUTH_MESSAGES.INVALID_CREDENTIALS);
    };

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, AUTH_MESSAGES.INVALID_CREDENTIALS);
    };

    if (!user.isEmailVerified) {
        const otp = otpGenerator();

        await authRepository.setNewOtp({ email, otp });

        await mailService.sendOtp(email, user.displayName, otp);

        throw new ApiError(StatusCodes.FORBIDDEN, AUTH_MESSAGES.VERIFY_YOUR_EMAIL);
    };

    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();

    await user.setRefreshTokenWithHash(refreshToken);

    return { user, refreshToken, accessToken };
};