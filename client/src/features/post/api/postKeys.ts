export const postKeys = {
    all: ['post'] as const,
    homeFeed: () => [...postKeys.all, 'home-feed'],
    userPost: (username: string, limit: number = 10) => [...postKeys.all, 'user', username, limit],
    details: (postId: string) => [...postKeys.all, 'details', postId],
};