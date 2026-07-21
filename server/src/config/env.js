import "dotenv/config";


const requiredEnv = [
    "MONGO_URI",
    "JWT_REFRESH_KEY",
    "JWT_ACCESS_KEY",
    "RESEND_API_KEY",
    "EMAIL_FROM"
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
    EMAIL_FROM: process.env.EMAIL_FROM
});

export default env;