import userModel from "./user.model.js";
import otpModel from "./otp.model.js";


const validUserQuery = {
    isEmailVerified: true,
    status: "active",
    isDeleted: false
};

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

    await otpModel.create({
        ...otpData,
        otp: hashedOtp
    });
};

export const findUserByEmail = async (email, select = "") => {

    const user = await userModel.findOne({ email }).select(select);

    return user;
};

export const matchOtp = async (email, otp) => {

    const hashedOtp = otpModel.hashOtp(otp);

    const isOtpExists = await otpModel.exists({
        email,
        otp: hashedOtp
    });

    return isOtpExists;
};

export const markEmailVerified = async (userId) => {

    const updatedUser = await userModel.findByIdAndUpdate(userId, {
        $set: {
            isEmailVerified: true
        }
    }, { returnDocument: "after" });

    return updatedUser;
};

export const deleteOtpByEmail = async (email) => {

    await otpModel.deleteOne({ email });
};

export const setNewOtp = async ({ email, otp }) => {

    const hashedOtp = otpModel.hashOtp(otp);

    await otpModel.findOneAndUpdate(
        { email },
        {
            otp: hashedOtp,
            createdAt: new Date()
        },
        {
            upsert: true,
            returnDocument: "after"
        });
};

export const removeRefreshToken = async (userId) => {

    await userModel.findByIdAndUpdate(userId,
        {
            $set: {
                refreshToken: null
            }
        }
    );
};

export const findUserById = async (userId, select = "") => {

    const user = await userModel.findOne({ _id: userId, ...validUserQuery }).select(select);

    return user;
};

export const setResetPasswordTokenAndExpireWithId = async (userId, resetToken) => {

    // 10 minutes
    const addedTime = 10 * 60 * 1000;

    await userModel.findByIdAndUpdate(userId,
        {
            $set: {
                passwordResetToken: resetToken,
                passwordResetExpires: new Date(Date.now() + addedTime),
            }
        }
    );
};

export const matchResetPasswordToken = async (token) => {

    const user = await userModel.findOne({
        passwordResetToken: token,
        passwordResetExpires: {
            $gt: new Date()
        }
    });

    return user;
};

export const resetPassword = async (userId, password) => {

    const hashedPassword = await userModel.hashPassword(password);

    await userModel.findByIdAndUpdate(userId,
        {
            $set: {
                password: hashedPassword,
                passwordResetToken: null,
                passwordResetExpires: null,
                refreshToken: null
            }
        }
    );
};

export const findUserByUsername = async (username, select = "") => {

    const user = await userModel.findOne({ username, ...validUserQuery }).select(select);

    return user;
};

export const updateUserByUserId = async (userId, userData) => {

    const updatedUser = await userModel.findByIdAndUpdate(userId,
        {
            $set: userData
        },
        {
            returnDocument: "after"
        });

    return updatedUser;
};

export const checkUserExists = async (username) => {

    const isUserExists = await userModel.exists({ username, ...validUserQuery })

    return isUserExists;
};

export const incrementFollower = async (userId, session) => {

    await userModel.findByIdAndUpdate(userId, {
        $inc: {
            followersCount: 1
        }
    }, { session });
};

export const incrementFollowing = async (userId, session) => {

    await userModel.findByIdAndUpdate(userId, {
        $inc: {
            followingCount: 1
        }
    }, { session });
};