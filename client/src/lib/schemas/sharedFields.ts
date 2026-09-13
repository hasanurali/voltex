import { z } from 'zod';

export const usernameField = z
    .string()
    .trim()
    .min(1, 'Username is required')
    .toLowerCase()
    .min(3, 'Username must be between 3 and 30 characters')
    .max(30, 'Username must be between 3 and 30 characters')
    .regex(/^[a-z][a-z0-9_]*$/, 'Username must start with a letter and can only contain lowercase letters, numbers, and underscores');