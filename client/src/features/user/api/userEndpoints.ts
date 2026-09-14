import type { SearchUserPayload } from "../types";

export const USER_ENDPOINTS = {
    searchUser: ({ page = 1, limit = 10, search }: SearchUserPayload) => `/users?page=${page}&limit=${limit}&search=${search}`,
    userStatus: '/users/user-statuses'
} as const;