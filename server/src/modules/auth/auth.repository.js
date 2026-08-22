import userModel from "./user.model.js";
import otpModel from "./otp.model.js";
import { executeWithConfig } from "../../shared/utils/index.js";
import { USER_STATUS } from "../../shared/constants/enums/index.js";


const verifiedUserQuery = {
    isEmailVerified: true,
    status: USER_STATUS.ACTIVE,
    isDeleted: false
};


export const createUser = async (userData, session) => {

    const hashedPassword = await userModel.hashPassword(userData.password);

    const [user] = await userModel.create(
        [
            {
                ...userData,
                password: hashedPassword
            }
        ],
        {
            session
        }
    );

    return user;
};

export const createOtp = async (otpData) => {

    const hashedOtp = otpModel.hashOtp(otpData.otp);

    await otpModel.create(
        {
            ...otpData,
            otp: hashedOtp
        }
    );
};

export const findUserByEmail = async (email, queryConfig = {}) => {

    const baseQuery = userModel.findOne(
        {
            email,
            status: USER_STATUS.ACTIVE,
            isDeleted: false
        }
    );

    return await executeWithConfig(baseQuery, queryConfig);
};

export const matchOtp = async (email, otp) => {

    const hashedOtp = otpModel.hashOtp(otp);

    const isOtpExists = await otpModel.exists(
        {
            email,
            otp: hashedOtp
        }
    );

    return isOtpExists;
};

export const markEmailVerified = async (userId, queryConfig = {}) => {

    const baseQuery = userModel.findByIdAndUpdate(userId,
        {
            isEmailVerified: true
        },
        {
            returnDocument: "after"
        }
    );

    return await executeWithConfig(baseQuery, queryConfig);
};

export const deleteOtpByEmail = async (email) => {

    await otpModel.deleteOne(
        {
            email
        }
    );
};

export const setNewOtp = async ({ email, otp }) => {

    const hashedOtp = otpModel.hashOtp(otp);

    await otpModel.updateOne(
        {
            email
        },
        {
            $set: {
                otp: hashedOtp,
                createdAt: new Date()
            }
        },
        {
            upsert: true
        }
    );
};

export const removeRefreshToken = async (userId) => {

    await userModel.updateOne(
        {
            _id: userId
        },
        {
            $set: {
                refreshToken: null
            }
        }
    );
};

export const findUserById = async (userId, queryConfig = {}) => {

    const baseQuery = userModel.findOne(
        {
            _id: userId,
            ...verifiedUserQuery
        }
    );

    return await executeWithConfig(baseQuery, queryConfig);
};

export const setResetPasswordToken = async (userId, resetToken) => {

    // 10 minutes
    const addedTime = 10 * 60 * 1000;

    await userModel.updateOne(
        {
            _id: userId
        },
        {
            $set: {
                passwordResetToken: resetToken,
                passwordResetExpires: new Date(Date.now() + addedTime)
            }
        }
    );
};

export const matchResetPasswordToken = async (token, queryConfig = {}) => {

    const baseQuery = userModel.findOne(
        {
            passwordResetToken: token,
            passwordResetExpires: {
                $gt: new Date()
            }
        }
    );

    return await executeWithConfig(baseQuery, queryConfig);
};

export const resetPassword = async (userId, password) => {

    const hashedPassword = await userModel.hashPassword(password);

    await userModel.updateOne(
        {
            _id: userId
        },
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

export const findUserByUsername = async (username, queryConfig = {}) => {

    const baseQuery = userModel.findOne(
        {
            username,
            ...verifiedUserQuery
        }
    );

    return await executeWithConfig(baseQuery, queryConfig);
};

export const updateUserByUserId = async (userId, userData, queryConfig = {}) => {

    const baseQuery = userModel.findByIdAndUpdate(userId,
        {
            ...userData
        },
        {
            returnDocument: "after"
        }
    );

    return await executeWithConfig(baseQuery, queryConfig);
};

export const checkUserExists = async (username) => {

    const isUserExists = await userModel.exists(
        {
            username,
            ...verifiedUserQuery
        }
    );

    return isUserExists;
};

export const incrementFollower = async (userId, session) => {

    await userModel.updateOne(
        {
            _id: userId
        },
        {
            $inc: {
                followersCount: 1
            }
        },
        {
            session
        }
    );
};

export const incrementFollowing = async (userId, session) => {

    await userModel.updateOne(
        {
            _id: userId
        },
        {
            $inc: {
                followingCount: 1
            }
        },
        {
            session
        }
    );
};

export const decrementFollower = async (userId, session) => {

    await userModel.updateOne(
        {
            _id: userId
        },
        {
            $inc: {
                followersCount: -1
            }
        },
        {
            session
        }
    );
};

export const decrementFollowing = async (userId, session) => {

    await userModel.updateOne(
        {
            _id: userId
        },
        {
            $inc: {
                followingCount: -1
            }
        },
        {
            session
        }
    );
};

export const incrementPost = async (userId, session) => {

    await userModel.updateOne(
        {
            _id: userId
        },
        {
            $inc: {
                postsCount: 1
            }
        },
        {
            session
        }
    );
};

export const decrementPost = async (userId, session) => {

    await userModel.updateOne(
        {
            _id: userId
        },
        {
            $inc: {
                postsCount: -1
            }
        },
        {
            session
        }
    );
};