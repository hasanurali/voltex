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

    media: z.array(mediaItemSchema).optional(),

}).refine((data) => !!data.content || (data.media?.length ?? 0) > 0, {
    message: 'Message cannot be empty',
    path: ['content'],
});

export type CreateMessageFormValues = z.infer<typeof createMessageSchema>;