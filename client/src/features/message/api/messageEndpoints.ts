import type { FetchMessagesPayload } from "../type";

export const MESSAGE_ENDPOINTS = {
    create: '/messages',
    fetch: ({ conversationId, page, limit }: FetchMessagesPayload) => `/messages/${conversationId}?page=${page}&limit=${limit}`,
    delete: (messageId: string) => `/messages/${messageId}`
} as const;