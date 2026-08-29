interface User {
    _id: string,
    displayName: string,
    username: string,
    email: string,
    isEmailVerified: boolean,
    role: 'user' | 'admin',
    followersCount: number,
    followingCount: number,
    postsCount: number,
    createdAt: string
};

interface Profile {
    _id: string,
    user: string,
    avatar: string,
    coverImage: string,
    bio: string | null,
    website: string | null,
    location: string | null
};

export interface AuthUser {
    user: User,
    profile: Profile
};