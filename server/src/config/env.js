import "dotenv/config";


const requiredEnv = [
    "MONGO_URI"
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

});

export default env;