import { StatusCodes } from "http-status-codes";

import resend from "./resend.js";
import MAIL_CONFIG from "../../config/mail.js";
import otpTemplate from "./templates/otp.template.js";
import resetPasswordTemplate from "./templates/reset.password.template.js";
import { ApiError, log } from "../utils/index.js";
import { AUTH_MESSAGES } from "../constants/messages/index.js";


export const sendOtp = async (email, name, otp) => {

    const { data, error } = await resend.emails.send({
        from: MAIL_CONFIG.FROM,
        to: email,
        subject: 'Verify Your Email - Voltex',
        html: otpTemplate({
            name,
            otp,
            expiry: "10 minutes"
        })
    });

    if (error) {

        log(`Resend Error: ${error}`);

        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, AUTH_MESSAGES.UNABLE_TO_SEND_OTP);

    };

    return data;
};

export const sendResetPasswordLink = async (email, name, resetLink) => {

    const { data, error } = await resend.emails.send({
        from: MAIL_CONFIG.FROM,
        to: email,
        subject: 'Reset Your Password - Voltex',
        html: resetPasswordTemplate({
            name,
            resetLink,
            expiry: "10 minutes"
        })
    });

    if (error) {

        log(`Resend Error: ${error}`);

        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, AUTH_MESSAGES.UNABLE_TO_SEND_OTP);

    };

    return data;
};