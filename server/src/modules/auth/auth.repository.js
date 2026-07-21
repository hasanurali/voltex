import userModel from "./user.model.js";
import otpModel from "./otp.model.js";


export const createUser = async (userData) => {

    const hashedPassword = await userModel.hashPassword(userData.password);

    const user = await userModel.create({
        ...userData,
        password: hashedPassword
    });

    return user;
};

export const createOtp = async (otpData) => {

    const hashedOtp = otpModel.hashOtp(otpData.otp);

    const otp = await otpModel.create({
        ...otpData,
        otp: hashedOtp
    });

    return otp;
};