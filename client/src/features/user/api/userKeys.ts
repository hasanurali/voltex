export const userKeys = {
    all: ['user'] as const,
    searchUser: (search: string, limit: number = 10) => [...userKeys.all, 'search', search, limit] as const
};