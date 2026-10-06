export const commentKeys = {
    all: ['comment'] as const,
    comments: (postId: string, limit: number = 10) => [...commentKeys.all, postId, limit],
    commentReplies: (commentId: string, limit: number = 10) => [...commentKeys.all, commentId, limit]
};