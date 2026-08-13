import * as userRepository from "./user.repository.js";
import { pagination } from "../../shared/utils/index.js";


export const fetchUsersService = async (page, limit, search = "") => {

    const { page: safePage, limit: safeLimit, skip } = pagination(page, limit);

    const [result] = await userRepository.searchUsers(search, skip, safeLimit);

    const users = result?.data ?? [];
    const total = result?.metadata?.[0]?.total ?? 0;

    const totalPages = Math.ceil(total / safeLimit);

    return {
        data: users,
        pagination: {
            total,
            page: safePage,
            limit: safeLimit,
            totalPages,
            hasNextPage: safePage < totalPages,
            hasPrevPage: safePage > 1
        }
    }
};