export const blockKeys = {
    all: ['block'] as const,
    fetchBlockedUsers: () => [...blockKeys.all, 'blocked-users'] as const
} as const;