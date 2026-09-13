export const profileKeys = {
    all: ['profile'] as const,
    detail: (username: string) => [...profileKeys.all, username] as const,
    checkUsername: (username: string) => [...profileKeys.all, 'check', username] as const,
};