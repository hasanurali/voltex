import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

import * as authRepository from "./auth.repository.js";
import { settingRepository } from "../setting/index.js";
import { ApiError, otpGenerator, resetPasswordTokenGenerator, hashToken, whitelistInput } from "../../shared/utils/index.js";
import * as mailService from "../../shared/mail/mail.service.js";
import { AUTH_MESSAGES } from "../../shared/constants/messages/index.js";
import JWT_CONFIG from "../../config/jwt.js";
import env from "../../config/env.js";
import { profileRepository } from "../profile/index.js";


export const registerService = async (userData) => {

    const allowedFields = ['displayName', 'username', 'email', 'password'];
    const whitelistedData = whitelistInput(userData, allowedFields);

    const user = await authRepository.createUser(whitelistedData);

    const profile = await profileRepository.createProfile({ user: user._id });

    await settingRepository.createSetting(user._id);

    const otp = otpGenerator();

    await authRepository.createOtp({ email: user.email, otp });

    await mailService.sendOtp(user.email, user.displayName, otp);

    return {
        user,
        profile
    };
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

    const verifiedUser = await authRepository.markEmailVerified(user._id);

    const [profile] = await Promise.all([
        profileRepository.getProfileByUserId(verifiedUser._id),
        verifiedUser.setRefreshTokenWithHash(refreshToken),
        authRepository.deleteOtpByEmail(email),
    ]);

    return {
        user: verifiedUser,
        profile,
        refreshToken,
        accessToken
    };
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

    const [profile] = await Promise.all([
        profileRepository.getProfileByUserId(user._id),
        user.setRefreshTokenWithHash(refreshToken)
    ]);

    return {
        user,
        profile,
        refreshToken,
        accessToken
    };
};

export const logoutService = async (userId) => {

    await authRepository.removeRefreshToken(userId);
};

export const refreshTokenService = async (refreshToken) => {

    if (!refreshToken) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, AUTH_MESSAGES.UNAUTHORIZED);
    };

    const decoded = jwt.verify(refreshToken, JWT_CONFIG.REFRESH.KEY);

    if (!decoded?.userId) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, AUTH_MESSAGES.UNAUTHORIZED);
    };

    const user = await authRepository.findUserById(decoded.userId, "refreshToken");
    if (!user) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, AUTH_MESSAGES.UNAUTHORIZED);
    };

    const isValidToken = user.matchRefreshToken(refreshToken);
    if (!isValidToken) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, AUTH_MESSAGES.UNAUTHORIZED);
    };

    const newRefreshToken = user.generateRefreshToken();
    const newAccessToken = user.generateAccessToken();

    await user.setRefreshTokenWithHash(newRefreshToken);

    return {
        newRefreshToken,
        newAccessToken
    };
};

export const forgotPasswordService = async (email) => {

    const user = await authRepository.findUserByEmail(email);

    if (!user) {
        return;
    };

    const token = resetPasswordTokenGenerator();

    await authRepository.setResetPasswordTokenAndExpireWithId(user._id, hashToken(token));

    const resetLink = `${env.CLIENT_URL}/auth/reset-password?token=${token}`;

    await mailService.sendResetPasswordLink(email, user.displayName, resetLink);
};

export const resetPasswordService = async ({ password, token }) => {

    if (!token) {
        throw new ApiError(StatusCodes.BAD_REQUEST, AUTH_MESSAGES.INVALID_OR_EXPIRED_LINK);
    };

    const matchedUser = await authRepository.matchResetPasswordToken(hashToken(token));
    if (!matchedUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, AUTH_MESSAGES.INVALID_OR_EXPIRED_LINK);
    };

    await authRepository.resetPassword(matchedUser._id, password);
};

export const currentUserService = async (userId) => {

    const user = await authRepository.findUserById(userId);
    if (!user) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, AUTH_MESSAGES.UNAUTHORIZED);
    };

    const profile = await profileRepository.getProfileByUserId(user._id);

    return {
        user,
        profile
    };
};