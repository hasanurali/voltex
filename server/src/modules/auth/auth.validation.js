import { body } from 'express-validator';

export const registerValidation = [

    // displayName
    body('displayName')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isString().withMessage('Name must be a string')
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters')
        .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters')
        .matches(/^[a-zA-Z\s]+$/).withMessage('Name must contain only letters'),

    // Username
    body('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .toLowerCase()
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters')
        .isLength({ max: 50 }).withMessage('Username cannot exceed 50 characters')
        .matches(/^[a-z0-9@$!%*?&]+$/).withMessage('Username can only contain lowercase letters, numbers and special characters'),

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

export const resetPasswordValidation = [

    // Email
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .toLowerCase()
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
];