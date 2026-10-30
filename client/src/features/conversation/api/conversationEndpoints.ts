export const CONVERSATION_ENDPOINTS = {
    fetch: ({ page = 1, limit = 10 }) => `/conversations?page=${page}&limit=${limit}`,
    fetchDetails: (id: string) => `/conversations/${id}`,
    markAllMessagesAsRead: (conversationId: string) => `/conversations/${conversationId}/read`
} as const;