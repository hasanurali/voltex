import type { ApiResponse } from "@/lib";
import type { ApiPaginationResponse } from "@/lib/types/api";

export type FollowUserResponse = ApiResponse<null>;
export type UnfollowUserResponse = ApiResponse<null>;

export interface FollowUserItem {
    _id: string;
    displayName: string;
    username: string;
    avatar: string;
};

export type UserFollowersResponse = ApiResponse<{
    followers: FollowUserItem[];
    pagination: ApiPaginationResponse;
}>;

export type UserFollowingsResponse = ApiResponse<{
    followings: FollowUserItem[];
    pagination: ApiPaginationResponse;
}>;

export interface FetchFollowersPayload {
    username: string;
    page?: number;
    limit?: number;
};

export interface FetchFollowingsPayload {
    username: string;
    page?: number;
    limit?: number;
};