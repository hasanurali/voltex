import { body } from 'express-validator';

export const registerValidation = [

    // displayName
    body('displayName')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isString().withMessage('Name must be a string')
        .isLength({ min: 2, max: 30 }).withMessage('Name must be between 2 and 30 characters')
        .matches(/^[\p{L}]+(?: [\p{L}]+)*$/u).withMessage("Name can only contain letters and spaces"),

    // Username
    body("username")
        .trim()
        .notEmpty().withMessage("Username is required")
        .toLowerCase()
        .isLength({ min: 3, max: 30 }).withMessage("Username must be between 3 and 30 characters")
        .matches(/^[a-z][a-z0-9_]*$/).withMessage(
            "Username must start with a letter and can only contain lowercase letters, numbers, and underscores"
        ),

    // Email
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .toLowerCase()
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),

    // Password
    body('password')
        .trim()
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
        .isLength({ max: 100 }).withMessage('Password is too long')
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
        .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
        .matches(/[0-9]/).withMessage("Password must contain at least one number")
        .matches(/[@$!%*?&]/).withMessage("Password must contain at least one special character"),
];

export const otpValidation = [

    // Otp
    body('otp')
        .trim()
        .notEmpty().withMessage('OTP is required')
        .isNumeric().withMessage('OTP must contain numbers only')
        .isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
];

export const loginValidation = [

    // Email
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .toLowerCase()
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),

    // Password
    body('password')
        .trim()
        .notEmpty().withMessage("Password is required")
];

export const forgotPasswordValidation = [

    // Email
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .toLowerCase()
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
];

export const resetPasswordValidation = [

    // Password
    body('password')
        .trim()
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
        .isLength({ max: 100 }).withMessage('Password is too long')
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
        .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
        .matches(/[0-9]/).withMessage("Password must contain at least one number")
        .matches(/[@$!%*?&]/).withMessage("Password must contain at least one special character"),
];