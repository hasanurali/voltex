import { z } from 'zod';

const mediaItemSchema = z.object({
    mediaType: z.enum(['image', 'video']),
    url: z.string().url('Invalid media URL'),
});

export const createMessageSchema = z.object({
    content: z
        .string()
        .trim()
        .max(500, 'Content cannot exceed 500 characters')
        .optional()
        .or(z.literal('')),

    media: z.array(mediaItemSchema).optional()
});

export type CreateMessageFormValues = z.infer<typeof createMessageSchema>;