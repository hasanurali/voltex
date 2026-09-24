export const followKeys = {
    all: ['follow'] as const,
    userFollowers: (username: string, limit: number = 10) => [...followKeys.all, 'user', 'followers', username, limit] as const,
    userFollowings: (username: string, limit: number = 10) => [...followKeys.all, 'user', 'followings', username, limit] as const
};