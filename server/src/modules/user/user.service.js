import { StatusCodes } from "http-status-codes";

import * as userRepository from "./user.repository.js";
import { ApiError, pagination } from "../../shared/utils/index.js";
import { USER_MESSAGES } from "../../shared/constants/messages/index.js";
import { onlineUsers } from "../../shared/socket/socket.js";


export const fetchUsersService = async ({ page, limit, search = "", userId = null }) => {

    const trimmedSearch = search.trim();

    if (!trimmedSearch) {
        throw new ApiError(StatusCodes.BAD_REQUEST, USER_MESSAGES.SEARCH_REQUIRED);
    };

    const { page: safePage, limit: safeLimit, skip } = pagination(page, limit);

    const result = await userRepository.searchUsers({ trimmedSearch, skip, safeLimit, userId });

    const users = result?.data ?? [];
    const total = result?.metadata?.[0]?.total ?? 0;

    const totalPages = Math.ceil(total / safeLimit);

    return {
        users,
        pagination: {
            total,
            page: safePage,
            limit: safeLimit,
            totalPages,
            hasNextPage: safePage < totalPages,
            hasPrevPage: safePage > 1
        }
    };
};

export const checkUserStatusesService = async (userIds) => {

    if (!userIds || !Array.isArray(userIds)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, USER_MESSAGES.INVALID_ARRAY_FORMAT);
    };

    const userStatuses = {};

    userIds.forEach(userId => {

        userStatuses[userId] = onlineUsers.has(userId);
    });

    return userStatuses;
};