import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

import * as authRepository from "./auth.repository.js";
import * as AUTH_OPTIONS from "./auth.options.js"
import { ApiError, otpGenerator, tokenGenerator, hashToken, whitelistInput, withTransaction, reshapeProfile } from "../../shared/utils/index.js";
import { settingRepository } from "../setting/index.js";
import { profileRepository } from "../profile/index.js";
import { AUTH_MESSAGES } from "../../shared/constants/messages/index.js";
import { emailQueue } from "../../shared/mail/mail.queue.js";
import { EMAIL_JOB } from "../../shared/constants/enums/email.job.enum.js";
import { EMAIL_JOB_OPTIONS } from "../../shared/mail/mail.options.js";
import JWT_CONFIG from "../../config/jwt.js";
import env from "../../config/env.js";


export const registerService = async (userData) => {

    const allowedFields = ['displayName', 'username', 'email', 'password'];
    const whitelistedData = whitelistInput(userData, allowedFields);

    const { user, profile } = await withTransaction(async (session) => {

        const user = await authRepository.createUser(whitelistedData, session);

        const profile = await profileRepository.createProfile({ user: user._id }, session);

        await settingRepository.createSetting(user._id, session);

        return {
            user,
            profile
        };
    });

    const otp = otpGenerator();

    await authRepository.createOtp({ email: user.email, otp });

    await emailQueue.add(EMAIL_JOB.SEND_OTP, {
        email: user.email,
        name: user.displayName,
        otp
    }, EMAIL_JOB_OPTIONS);

    return {
        user,
        profile: reshapeProfile(profile)
    };
};

export const verifyEmailService = async ({ email, otp }) => {

    if (!email) {
        throw new ApiError(StatusCodes.BAD_REQUEST, AUTH_MESSAGES.VERIFICATION_SESSION_EXPIRED);
    };

    const user = await authRepository.findUserByEmail(email, { select: "isEmailVerified" });
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

    const verifiedUser = await authRepository.markEmailVerified(user._id, AUTH_OPTIONS.VERIFIED_EMAIL_RESPONSE_PROJECTION);

    const [profile] = await Promise.all([

        profileRepository.getProfileByUserId(verifiedUser._id, AUTH_OPTIONS.PROFILE_RESPONSE_PROJECTION),

        verifiedUser.setRefreshTokenWithHash(refreshToken),

        authRepository.deleteOtpByEmail(email),
    ]);

    return {
        user: verifiedUser,
        profile: reshapeProfile(profile),
        refreshToken,
        accessToken
    };
};

export const resendOtpService = async (email) => {

    if (!email) {
        throw new ApiError(StatusCodes.BAD_REQUEST, AUTH_MESSAGES.VERIFICATION_SESSION_EXPIRED);
    };

    const user = await authRepository.findUserByEmail(email, { select: "isEmailVerified displayName", lean: true });
    if (!user) {
        throw new ApiError(StatusCodes.BAD_REQUEST, AUTH_MESSAGES.VERIFICATION_SESSION_EXPIRED);
    };

    if (user.isEmailVerified) {
        throw new ApiError(StatusCodes.CONFLICT, AUTH_MESSAGES.EMAIL_ALREADY_VERIFIED)
    };

    const otp = otpGenerator();

    await authRepository.setNewOtp({ email, otp });

    await emailQueue.add(EMAIL_JOB.SEND_OTP, {
        email,
        name: user.displayName,
        otp
    }, EMAIL_JOB_OPTIONS);
};

export const loginService = async ({ email, password }) => {

    const user = await authRepository.findUserByEmail(email, AUTH_OPTIONS.LOGIN_RESPONSE_PROJECTION);
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

        await emailQueue.add(EMAIL_JOB.SEND_OTP, {
            email,
            name: user.displayName,
            otp
        }, EMAIL_JOB_OPTIONS);

        throw new ApiError(StatusCodes.FORBIDDEN, AUTH_MESSAGES.VERIFY_YOUR_EMAIL);
    };

    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();

    const [profile] = await Promise.all([

        profileRepository.getProfileByUserId(user._id, AUTH_OPTIONS.PROFILE_RESPONSE_PROJECTION),

        user.setRefreshTokenWithHash(refreshToken)
    ]);

    return {
        user,
        profile: reshapeProfile(profile),
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

    const user = await authRepository.findUserById(decoded.userId, { select: "refreshToken" });
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

    const user = await authRepository.findUserByEmail(email, { select: "displayName", lean: true });

    if (!user) {
        return;
    };

    const token = tokenGenerator();

    await authRepository.setResetPasswordToken(user._id, hashToken(token));

    const resetLink = `${env.CLIENT_URL}/auth/reset-password?token=${token}`;

    await emailQueue.add(EMAIL_JOB.SEND_RESET_PASSWORD_LINK, {
        email,
        name: user.displayName,
        resetLink
    }, EMAIL_JOB_OPTIONS);
};

export const resetPasswordService = async ({ password, token }) => {

    if (!token) {
        throw new ApiError(StatusCodes.BAD_REQUEST, AUTH_MESSAGES.INVALID_OR_EXPIRED_LINK);
    };

    const matchedUser = await authRepository.matchResetPasswordToken(hashToken(token), { select: "_id", lean: true });
    if (!matchedUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, AUTH_MESSAGES.INVALID_OR_EXPIRED_LINK);
    };

    await authRepository.resetPassword(matchedUser._id, password);
};

export const currentUserService = async (userId) => {

    const user = await authRepository.findUserById(userId, AUTH_OPTIONS.USER_RESPONSE_PROJECTION);
    if (!user) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, AUTH_MESSAGES.UNAUTHORIZED);
    };

    const profile = await profileRepository.getProfileByUserId(user._id, AUTH_OPTIONS.PROFILE_RESPONSE_PROJECTION);

    return {
        user,
        profile: reshapeProfile(profile)
    };
};