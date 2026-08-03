import { body } from "express-validator";

export const createCommentValidation = [

    // Content
    body("content")
        .trim()
        .isString().withMessage("Content must be a string")
        .notEmpty().withMessage("Content is required")
        .isLength({ max: 1000 }).withMessage("Content cannot exceed 1000 characters")
];