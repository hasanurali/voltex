export const BLOCK_ENDPOINTS = {
    blockUser: (username: string) => `/blocks/${username}`,
    unblockUser: (username: string) => `/blocks/${username}`,
    fetchBlockedUsers: '/blocks'
} as const;