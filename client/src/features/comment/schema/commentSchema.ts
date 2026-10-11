import { z } from 'zod';

export const commentSchema = z.object({
    content: z
        .string()
        .trim()
        .min(1, 'Content is required')
        .max(1000, 'Content cannot exceed 1000 characters'),
});

export const createCommentSchema = commentSchema;
export const updateCommentSchema = commentSchema;

export type CreateCommentFormValues = z.infer<typeof createCommentSchema>;
export type UpdateCommentFormValues = z.infer<typeof updateCommentSchema>;