import cloudinary from "./cloudinary.js";

export const deleteImage = async (publicId) => {
    
    return cloudinary.uploader.destroy(publicId);
};