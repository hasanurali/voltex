export const PROFILE_ENDPOINTS = {
    checkUsername: (username: string) => `/profile/username/check?username=${username}`,
    userProfile: (username: string) => `/profile/${username}`,
    updateUsername: '/profile/username',
    updateProfile: '/profile',
    updateAvatar: '/profile/avatar',
    updateCoverImage: '/profile/cover-image',
    deleteAvatar: '/profile/avatar',
    deleteCoverImage: '/profile/cover-image'
} as const;