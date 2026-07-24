import env from "./env.js";

const COOKIE_CONFIG = Object.freeze({
    REFRESH: Object.freeze({
        maxAge: env.REFRESH_COOKIE_MAX_AGE,
        secure: env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax"

    }),
    ACCESS: Object.freeze({
        maxAge: env.ACCESS_COOKIE_MAX_AGE,
        secure: env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax"
    })
});

export default COOKIE_CONFIG;