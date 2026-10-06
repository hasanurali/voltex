import type { ApiResponse } from "@/lib";
import type { ApiPaginationResponse } from "@/lib/types/api";
import type { Author } from "../post";
import type { CreateCommentFormValues, UpdateCommentFormValues } from "./schema/commentSchema";

export interface Comment {
    _id: string;
    post: string;
    author: Author;
    parentComment: string;
    content: string;
    likesCount: number;
    repliesCount: number;
    depth: number;
    hasReacted: boolean;
    createdAt: string;
    updatedAt: string;
};

export type CreateCommentResponse = ApiResponse<Comment>;
export type FetchCommentResponse = ApiResponse<{
    comments: Comment[];
    pagination: ApiPaginationResponse;
}>;
export type FetchCommentRepliesResponse = ApiResponse<{
    commentReplies: Comment[];
    pagination: ApiPaginationResponse;
}>;
export type UpdateCommentResponse = ApiResponse<Comment>;
export type DeleteCommentResponse = ApiResponse<null>;

export interface Pagination {
    page?: number;
    limit?: number;
};

export type CreateCommentPayload = CreateCommentFormValues & (
    |
    {
        post: string;
        parentComment?: never
    }
    |
    {
        parentComment: string;
        post?: never
    }
);
export interface FetchCommentPayload extends Pagination {
    postId: string;
};
export interface FetchCommentReplyPayload extends Pagination {
    commentId: string;
};
export interface UpdateCommentPayload extends UpdateCommentFormValues {
    commentId: string;
};