const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const validateImageFile = (file: File, maxSizeMB: number): string | null => {

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return 'Unsupported file format. Please use JPG, PNG or WEBP';
    };

    if (file.size > maxSizeMB * 1024 * 1024) {
        return `This image is too big. Please select an image under ${maxSizeMB}MB`;
    };

    return null;
};

export default validateImageFile;