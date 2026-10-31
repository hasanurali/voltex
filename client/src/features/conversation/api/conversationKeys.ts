export const conversationKeys = {
    all: ['conversations'] as const,
    conversations: (limit: number = 10) => [...conversationKeys.all, 'conversations', limit],
    conversationDetails: (id: string) => [...conversationKeys.all, 'conversation', id]
};