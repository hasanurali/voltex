import env from "./env.js";

const JWT_CONFIG = Object.freeze({

    REFRESH: Object.freeze({
        KEY: env.JWT_REFRESH_KEY,
        EXPIRE: env.JWT_REFRESH_EXPIRED
    }),
    ACCESS: Object.freeze({
        KEY: env.JWT_ACCESS_KEY,
        EXPIRE: env.JWT_ACCESS_EXPIRED
    })
});

export default JWT_CONFIG;