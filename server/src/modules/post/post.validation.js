import { body } from "express-validator";

import { MEDIA_TYPE, VISIBILITY_TYPE } from "../../shared/constants/enums/index.js";

export const createPostValidation = [

    // Content
    body("content")
        .optional()
        .trim()
        .isString().withMessage("Content must be a string")
        .isLength({ max: 2000 }).withMessage("Content cannot exceed 2000 characters"),

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

    // Hashtag
    body("hashtags")
        .optional()
        .isArray().withMessage("Hashtags must be an array"),

    // Hashtag values
    body("hashtags.*")
        .optional()
        .trim()
        .isString().withMessage("Hashtag must be a string")
        .notEmpty().withMessage("Hashtag is required"),

    // Visibility 
    body("visibility")
        .optional()
        .isIn([VISIBILITY_TYPE.PUBLIC, VISIBILITY_TYPE.FOLLOWERS]).withMessage("Invalid visibility")
];