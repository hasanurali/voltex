import { z } from 'zod';
import { usernameField } from '@/lib';

export const updateUsernameSchema = z.object({
    username: usernameField
});

export const updateProfileSchema = z.object({
    displayName: z
        .string()
        .trim()
        .min(2, 'Name must be between 2 and 30 characters')
        .max(30, 'Name must be between 2 and 30 characters')
        .regex(/^[\p{L}]+(?: [\p{L}]+)*$/u, 'Name can only contain letters and spaces')
        .optional()
        .or(z.literal('')),

    bio: z
        .string()
        .trim()
        .max(160, 'Bio cannot exceed 160 characters')
        .optional()
        .or(z.literal('')),

    website: z
        .string()
        .trim()
        .url('Website must be a valid URL')
        .optional()
        .or(z.literal('')),

    location: z
        .string()
        .trim()
        .max(100, 'Location cannot exceed 100 characters')
        .optional()
        .or(z.literal(''))
});


export type UpdateUsernameFormValues = z.infer<typeof updateUsernameSchema>;
export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;