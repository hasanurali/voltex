export const conversationKeys = {
    all: ['conversations'] as const,
    conversations: (limit: number = 10) => [...conversationKeys.all, 'conversations', limit],
    conversationDetails: (conversationId: string) => [...conversationKeys.all, 'conversation', conversationId]
};