import * as mailService from "./mail.service.js";

export const sendOtpJob = async (job) => {

    const { email, name, otp } = job.data;

    await mailService.sendOtp(email, name, otp);
};

export const sendResetPasswordLinkJob = async (job) => {

    const { email, name, resetLink } = job.data;

    await mailService.sendResetPasswordLink(email, name, resetLink);
};