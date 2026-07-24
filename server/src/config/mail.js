import env from "./env.js";

const MAIL_CONFIG = Object.freeze({
    KEY: env.RESEND_API_KEY,
    FROM: env.EMAIL_FROM
});

export default MAIL_CONFIG;