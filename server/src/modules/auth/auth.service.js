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