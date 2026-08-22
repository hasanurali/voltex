import { StatusCodes } from "http-status-codes";

import * as userRepository from "./user.repository.js";
import { ApiError, pagination } from "../../shared/utils/index.js";
import { USER_MESSAGES } from "../../shared/constants/messages/index.js";


export const fetchUsersService = async (page, limit, search = "") => {

    const trimmedSearch = search.trim();

    if (!trimmedSearch) {
        throw new ApiError(StatusCodes.BAD_REQUEST, USER_MESSAGES.SEARCH_REQUIRED);
    };

    const { page: safePage, limit: safeLimit, skip } = pagination(page, limit);

    const result = await userRepository.searchUsers(trimmedSearch, skip, safeLimit);

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