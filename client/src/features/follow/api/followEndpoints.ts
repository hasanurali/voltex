import type { FetchFollowersPayload, FetchFollowingsPayload } from "../types";

export const FOLLOW_ENDPOINTS = {
    followUser: (username: string) => `/follows/${username}`,
    unfollowUser: (username: string) => `/follows/${username}`,
    fetchUserFollowers: ({ username, page = 1, limit = 10 }: FetchFollowersPayload) => `/follows/followers/${username}?page=${page}&limit=${limit}`,
    fetchUserFollowings: ({ username, page = 1, limit = 10 }: FetchFollowingsPayload) => `/follows/following/${username}?page=${page}&limit=${limit}`
} as const;