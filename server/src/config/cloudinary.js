import env from "./env.js";

const CLOUDINARY_CONFIG = Object.freeze({
    NAME: env.CLOUDINARY_CLOUD_NAME,
    KEY: env.CLOUDINARY_APY_KEY,
    SECRET: env.CLOUDINARY_APY_SECRET
});

export default CLOUDINARY_CONFIG;