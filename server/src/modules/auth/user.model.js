import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

import { USER_ROLES, USER_STATUS } from "../../shared/constants/enums/index.js";
import JWT_CONFIG from "../../config/jwt.js";
import env from "../../config/env.js";

const userSchema = new mongoose.Schema({
    displayName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        minLength: 3,
        maxLength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        select: false,
        minLength: 8
    },
    refreshToken: {
        type: String,
        default: null
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: [USER_ROLES.USER, USER_ROLES.ADMIN],
        default: USER_ROLES.USER
    },
    status: {
        type: String,
        enum: [USER_STATUS.ACTIVE, USER_STATUS.SUSPENDED, USER_STATUS.BANNED],
        default: USER_STATUS.ACTIVE
    },

    followersCount: {
        type: Number,
        default: 0
    },
    followingCount: {
        type: Number,
        default: 0
    },
    postsCount: {
        type: Number,
        default: 0
    },
    passwordResetToken: {
        type: String,
        select: false,
        default: null,
    },
    passwordResetExpires: {
        type: Date,
        select: false,
        default: null,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    }
}, { timestamps: true });


userSchema.methods.generateRefreshToken = function () {
    const refreshToken = jwt.sign({ userId: this._id, role: this.role }, JWT_CONFIG.REFRESH.KEY, { expiresIn: JWT_CONFIG.REFRESH.EXPIRE });
    return refreshToken;
};

userSchema.methods.generateAccessToken = function () {
    const accessToken = jwt.sign({ userId: this._id, role: this.role }, JWT_CONFIG.ACCESS.KEY, { expiresIn: JWT_CONFIG.ACCESS.EXPIRE });
    return accessToken;
};

userSchema.methods.setRefreshTokenWithHash = async function (refreshToken) {
    this.refreshToken = crypto.createHash("sha256").update(refreshToken).digest("hex");
    await this.save()
};

userSchema.methods.matchRefreshToken = function (refreshToken) {
    const hashedRefreshToken = crypto.createHash("sha256").update(refreshToken).digest("hex");
    return this.refreshToken === hashedRefreshToken;
};

userSchema.statics.hashPassword = async function (password) {
    const salt = await bcrypt.genSalt(env.BCRYPT_SALT_ROUND);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};

userSchema.methods.comparePassword = async function (password) {
    const comparePassword = await bcrypt.compare(password, this.password);
    return comparePassword;
};

userSchema.methods.toJSON = function () {
    const obj = this.toObject();

    delete obj.password;
    delete obj.refreshToken;

    return obj;
};

export default mongoose.model("User", userSchema);