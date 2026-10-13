import type { ApiResponse } from '@/lib';

export type CreateReactionResponse = ApiResponse<null>;
export type RemoveReactionResponse = ApiResponse<null>;

export interface ReactionPayload {
    targetType: 'post' | 'comment';
    targetId: string;
};

export interface CreateReactionPayload extends ReactionPayload { };
export interface RemoveReactionPayload extends ReactionPayload { };