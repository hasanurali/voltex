import type { FetchCommentPayload, FetchCommentReplyPayload } from "../type";

export const COMMENT_ENDPOINTS = {
    createComment: '/comments',
    fetchComment: ({ postId, page = 1, limit = 10 }: FetchCommentPayload) => `/comments/post/${postId}?page=${page}&limit=${limit}`,
    fetchCommentReplies: ({ commentId, page = 1, limit = 10 }: FetchCommentReplyPayload) => `/comments/${commentId}/replies?page=${page}&limit=${limit}`,
    updateComment: (commentId: string) => `/comments/${commentId}`,
    deleteComment: (commentId: string) => `/comments/${commentId}`
} as const;