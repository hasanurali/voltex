import { body } from "express-validator";

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