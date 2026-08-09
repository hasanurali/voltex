import { body } from "express-validator";

import { MEDIA_TYPE, VISIBILITY_TYPE } from "../../shared/constants/enums/index.js";

export const createMessageValidation = [

    // Content
    body("content")
        .optional()
        .trim()
        .isString().withMessage("Content must be a string")
        .isLength({ max: 500 }).withMessage("Content cannot exceed 500 characters"),

    // Media
    body("media")
        .optional()
        .isArray().withMessage("Media must be an array"),

    // Media Type
    body("media.*.mediaType")
        .optional()
        .isIn([MEDIA_TYPE.IMAGE, MEDIA_TYPE.VIDEO]).withMessage("Invalid media type"),

    // Media Url
    body("media.*.url")
        .optional()
        .isURL().withMessage("Invalid media URL"),
];