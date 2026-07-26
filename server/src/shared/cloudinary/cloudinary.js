import { v2 as cloudinary } from "cloudinary";

import CLOUDINARY_CONFIG from "../../config/cloudinary.js";

cloudinary.config({
    cloud_name: CLOUDINARY_CONFIG.NAME,
    api_key: CLOUDINARY_CONFIG.KEY,
    api_secret: CLOUDINARY_CONFIG.SECRET
});

export default cloudinary;