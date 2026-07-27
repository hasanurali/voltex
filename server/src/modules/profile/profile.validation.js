import { body, query } from "express-validator";

export const checkUsernameValidation = [

    // Username
    query("username")
        .trim()
        .notEmpty().withMessage("Username is required")
        .toLowerCase()
        .isLength({ min: 3, max: 30 }).withMessage("Username must be between 3 and 30 characters")
        .matches(/^[a-z][a-z0-9_]*$/).withMessage(
            "Username must start with a letter and can only contain lowercase letters, numbers, and underscores"
        ),
];

export const updateUsernameValidation = [

    // Username
    body("username")
        .trim()
        .notEmpty().withMessage("Username is required")
        .toLowerCase()
        .isLength({ min: 3, max: 30 }).withMessage("Username must be between 3 and 30 characters")
        .matches(/^[a-z][a-z0-9_]*$/).withMessage(
            "Username must start with a letter and can only contain lowercase letters, numbers, and underscores"
        ),
];

export const updateProfileValidation = [

    // Name
    body("displayName")
        .optional()
        .trim()
        .isLength({ min: 2, max: 30 }).withMessage("Name must be between 2 and 30 characters")
        .matches(/^[\p{L}]+(?: [\p{L}]+)*$/u).withMessage("Name can only contain letters and spaces"),

    // Bio
    body("bio")
        .optional()
        .trim()
        .isLength({ max: 160 }).withMessage("Bio cannot exceed 160 characters"),

    // Website
    body("website")
        .optional({ values: "falsy" })
        .trim()
        .isURL().withMessage("Website must be a valid URL"),

    // Location
    body("location")
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage("Location cannot exceed 100 characters"),
];

export const updateAvatarValidation = [

    //Url
    body("url")
        .trim()
        .notEmpty().withMessage("Avatar is required")
        .isURL().withMessage("Invalid avatar"),
];

export const updateCoverImageValidation = [

    //Url
    body("url")
        .trim()
        .notEmpty().withMessage("Cover image is required")
        .isURL().withMessage("Invalid cover image"),
];