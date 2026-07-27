import "dotenv/config";


const requiredEnv = [
    "MONGO_URI",
    "JWT_REFRESH_KEY",
    "JWT_ACCESS_KEY",
    "RESEND_API_KEY",
    "EMAIL_FROM",
    "DEFAULT_COVER_IMAGE",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_APY_KEY",
    "CLOUDINARY_APY_SECRET"
];

// Check Required Environment Variable Is Present
requiredEnv.forEach(key => {
    if (!process.env[key] || process.env[key].trim() === "") {
        throw new Error(`Missing required environment variable: ${key}`)
    };
});

const env = Object.freeze({

    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: Number(process.env.PORT) || 5000,
    MONGO_URI: process.env.MONGO_URI,

    JWT_REFRESH_KEY: process.env.JWT_REFRESH_KEY,
    JWT_REFRESH_EXPIRED: process.env.JWT_REFRESH_EXPIRED || "7d",
    JWT_ACCESS_KEY: process.env.JWT_ACCESS_KEY,
    JWT_ACCESS_EXPIRED: process.env.JWT_ACCESS_EXPIRED || "10m",

    BCRYPT_SALT_ROUND: Number(process.env.BCRYPT_SALT_ROUND) || 10,

    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,

    REFRESH_COOKIE_MAX_AGE: Number(process.env.REFRESH_COOKIE_MAX_AGE) || 7 * 24 * 60 * 60 * 1000,
    ACCESS_COOKIE_MAX_AGE: Number(process.env.ACCESS_COOKIE_MAX_AGE) || 10 * 60 * 1000,

    CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",

    DEFAULT_COVER_IMAGE: process.env.DEFAULT_COVER_IMAGE,

    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_APY_KEY: process.env.CLOUDINARY_APY_KEY,
    CLOUDINARY_APY_SECRET: process.env.CLOUDINARY_APY_SECRET
});

export default env;