import type { ApiResponse } from '@/lib';
import type { ApiPaginationResponse } from '@/lib/types/api';

export interface SearchedUser {
    _id: string;
    displayName: string;
    username: string;
    avatar: string;
    isFollowing: boolean;
};

export type SearchUserResponse = ApiResponse<{
    users: SearchedUser[] | [];
    pagination: ApiPaginationResponse;
}>;

export type UserStatusResponse = ApiResponse<{
    [userId: string]: boolean;
}>;

export interface SearchUserPayload {
    search: string;
    page?: number;
    limit?: number;
};

export interface UserStatusPayload {
    userIds: string[] | [];
};