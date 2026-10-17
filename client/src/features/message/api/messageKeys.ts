export const messageKeys = {
    all: ['message'] as const,
    conversationMessages: (conversationId: string, limit: number = 10) => [...messageKeys.all, 'conversation', conversationId, limit]
} as const;