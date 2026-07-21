import { Resend } from "resend";
import { StatusCodes } from "http-status-codes";

import resend from "./resend.js";
import MAIL_CONFIG from "../../config/mail.js";
import otpTemplate from "./templates/otp.template.js";
import { ApiError } from "../utils/index.js";
import { AUTH_MESSAGES } from "../constants/messages/index.js";


export const sendOtp = async (email, name, otp) => {

    const { data, error } = await resend.emails.send({
        from: MAIL_CONFIG.FROM,
        to: email,
        subject: 'Verify Your Email - Social Media',
        html: otpTemplate({
            name,
            otp,
            expiry: "10 minutes"
        })
    });

    if (error) {

        console.error(`Resend Error: ${error}`);

        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, AUTH_MESSAGES.UNABLE_TO_SEND_OTP);

    };

    return data;
};