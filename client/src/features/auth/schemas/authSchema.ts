import { z } from 'zod';

export const registerSchema = z.object({
    displayName: z
        .string()
        .trim()
        .min(1, 'Name is required')
        .min(2, 'Name must be between 2 and 30 characters')
        .max(30, 'Name must be between 2 and 30 characters')
        .regex(/^[\p{L}]+(?: [\p{L}]+)*$/u, 'Name can only contain letters and spaces'),

    username: z
        .string()
        .trim()
        .min(1, 'Username is required')
        .toLowerCase()
        .min(3, 'Username must be between 3 and 30 characters')
        .max(30, 'Username must be between 3 and 30 characters')
        .regex(/^[a-z][a-z0-9_]*$/, 'Username must start with a letter and can only contain lowercase letters, numbers and underscores'),

    email: z
        .string()
        .trim()
        .min(1, 'Email is required')
        .email('Invalid email format')
        .toLowerCase(),

    password: z
        .string()
        .trim()
        .min(1, 'Password is required')
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password is too long')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[@$!%*?&]/, 'Password must contain at least one special character'),

    confirmPassword: z
        .string()
        .trim()
        .min(1, 'Please confirm your password')

}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
});

export const verifyEmailSchema = z.object({
    otp: z
        .string()
        .trim()
        .min(1, 'OTP is required')
        .length(6, 'OTP must be 6 digits')
        .regex(/^\d+$/, 'OTP must contain only numbers')
});

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, 'Email is required')
        .email('Invalid email format')
        .toLowerCase(),

    password: z
        .string()
        .trim()
        .min(1, 'Password is required')
});

export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, 'Email is required')
        .email('Invalid email format')
        .toLowerCase()
});

export const resetPasswordSchema = z.object({
    password: z
        .string()
        .trim()
        .min(1, 'Password is required')
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password is too long')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[@$!%*?&]/, 'Password must contain at least one special character'),

    confirmPassword: z
        .string()
        .trim()
        .min(1, 'Please confirm your password')

}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
});


export type RegisterFormValues = z.infer<typeof registerSchema>;
export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;