import { z } from 'zod';

const mediaItemSchema = z.object({
    mediaType: z
        .enum(['image', 'video']),

    url: z
        .string()
        .url('Invalid media URL')
});

const hashtagSchema = z.string().trim().min(1, 'Hashtag is required');

export const createPostSchema = z.object({
    content: z
        .string()
        .trim()
        .max(2000, 'Content cannot exceed 2000 characters')
        .optional()
        .or(z.literal('')),

    media: z
        .array(mediaItemSchema)
        .optional(),

    hashtags: z
        .array(hashtagSchema)
        .optional(),

    visibility: z
        .enum(['public', 'followers'])
        .optional()
});

export const updatePostSchema = createPostSchema;

export type CreatePostFormValues = z.infer<typeof createPostSchema>;
export type UpdatePostFormValues = z.infer<typeof updatePostSchema>;