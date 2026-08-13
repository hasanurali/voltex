import { StatusCodes } from "http-status-codes";

import * as authRepository from "../auth/auth.repository.js";
import * as followRepository from "./follow.repository.js";
import { blockRepository } from "../block/index.js";
import { ApiError, withTransaction, pagination } from "../../shared/utils/index.js";
import { USER_MESSAGES, FOLLOW_MESSAGES } from "../../shared/constants/messages/index.js";
import { createNotification } from "../notification/index.js";
import { NOTIFICATION_TARGET_TYPE, NOTIFICATION_TYPE } from "../../shared/constants/enums/index.js";

export const followUserService = async (userId, username) => {

    const user = await authRepository.checkUserExists(username);
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, USER_MESSAGES.NOT_FOUND);
    };

    if (userId.toString() === user._id.toString()) {
        throw new ApiError(StatusCodes.BAD_REQUEST, FOLLOW_MESSAGES.INVALID_SELF_FOLLOW);
    };

    const [isBlocked, isBlockedByTarget] = await Promise.all([
        blockRepository.findBlock(userId, user._id),
        blockRepository.findBlock(user._id, userId)
    ]);

    if (isBlocked || isBlockedByTarget) {
        throw new ApiError(StatusCodes.FORBIDDEN, FOLLOW_MESSAGES.CANNOT_FOLLOW_BLOCKED_USER);
    };

    const isFollowing = await followRepository.checkFollowing(userId, user._id);
    if (isFollowing) {
        throw new ApiError(StatusCodes.CONFLICT, FOLLOW_MESSAGES.ALREADY_FOLLOWED);
    };

    await withTransaction(async (session) => {

        await followRepository.followUser(userId, user._id, session);

        await authRepository.incrementFollower(user._id, session);

        await authRepository.incrementFollowing(userId, session);
    });

    void createNotification({
        user: user._id,
        triggeredBy: userId,
        entityId: user._id,
        entityType: NOTIFICATION_TARGET_TYPE.USER,
        type: NOTIFICATION_TYPE.FOLLOW
    });
};

export const fetchFollowersService = async (username, page, limit) => {

    const user = await authRepository.checkUserExists(username);
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, USER_MESSAGES.NOT_FOUND);
    };

    const { page: safePage, limit: safeLimit, skip } = pagination(page, limit);

    const result = await followRepository.fetchFollowers(user._id, skip, safeLimit);

    const followers = result?.data ?? [];
    const total = result?.metadata?.[0]?.total ?? 0;

    const totalPages = Math.ceil(total / safeLimit);

    return {
        data: followers,
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

export const fetchFollowingsService = async (username, page, limit) => {

    const user = await authRepository.checkUserExists(username);
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, USER_MESSAGES.NOT_FOUND);
    };

    const { page: safePage, limit: safeLimit, skip } = pagination(page, limit);

    const result = await followRepository.fetchFollowings(user._id, skip, safeLimit);

    const followings = result?.data ?? [];
    const total = result?.metadata?.[0]?.total ?? 0;

    const totalPages = Math.ceil(total / safeLimit);

    return {
        data: followings,
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

export const unfollowUserService = async (userId, username) => {

    const user = await authRepository.checkUserExists(username);
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, USER_MESSAGES.NOT_FOUND);
    };

    const isFollowing = await followRepository.checkFollowing(userId, user._id);
    if (!isFollowing) {
        throw new ApiError(StatusCodes.CONFLICT, FOLLOW_MESSAGES.NOT_FOLLOWED);
    };

    await withTransaction(async (session) => {

        await followRepository.unfollowUser(userId, user._id, session);

        await authRepository.decrementFollower(user._id, session);

        await authRepository.decrementFollowing(userId, session);
    });
};