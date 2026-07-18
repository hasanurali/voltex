import "dotenv/config";

const env = Object.freeze({

    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: Number(process.env.PORT) || 5000,

});

export default env;