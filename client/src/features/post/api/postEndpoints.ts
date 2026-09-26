import type { FetchUserPostPayload } from "../types";

export const POST_ENDPOINTS = {
    create: '/posts',
    fetchHomeFeed: (cursor?: string) => cursor ? `/posts?cursor=${cursor}` : '/posts',
    details: (postId: string) => `/posts/${postId}`,
    update: (postId: string) => `/posts/${postId}`,
    delete: (postId: string) => `/posts/${postId}`,
    fetchUserPost: ({ username, page = 1, limit = 10 }: FetchUserPostPayload) => `/posts/user/${username}?page=${page}&limit=${limit}`
} as const;