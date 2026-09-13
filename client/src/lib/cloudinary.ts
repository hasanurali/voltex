import axios from 'axios';
import { config } from './config';
import { FILE_TYPE } from './constants';


interface CloudinaryUploadResult {
    url: string;
    publicId: string;
};

interface SingleUploadCloudinaryOptions {
    folder?: string;
    resourceType?: 'image' | 'video';
    onProgress?: (percent: number) => void;
};


const { cloudName, uploadPreset } = config.cloudinary;

export const uploadToCloudinary = async (file: File, options: SingleUploadCloudinaryOptions = {}): Promise<CloudinaryUploadResult> => {

    const { folder, resourceType = FILE_TYPE.image, onProgress } = options;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    if (folder) {
        formData.append('folder', folder);
    };

    const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
        formData, {
        onUploadProgress: (event) => {
            if (event.total && onProgress) {
                onProgress(Math.round((event.loaded / event.total) * 100));
            };
        },
    });

    return {
        url: res.data.secure_url,
        publicId: res.data.public_id
    };
};