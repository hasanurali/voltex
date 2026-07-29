import { StatusCodes } from "http-status-codes";

import * as authRepository from "../auth/auth.repository.js";
import * as followRepository from "./follow.repository.js";
import { ApiError, withTransaction } from "../../shared/utils/index.js";
import { AUTH_MESSAGES, FOLLOW_MESSAGES } from "../../shared/constants/messages/index.js";

export const followUserService = async (userId, username) => {

    const user = await authRepository.checkUserExists(username);
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, AUTH_MESSAGES.NOT_FOUND);
    };

    if (userId.toString() === user._id.toString()) {
        throw new ApiError(StatusCodes.BAD_REQUEST, FOLLOW_MESSAGES.INVALID_SELF_FOLLOW);
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
};

export const fetchFollowersService = async (username) => {

    const user = await authRepository.checkUserExists(username);
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, AUTH_MESSAGES.NOT_FOUND);
    };

    const followers = await followRepository.fetchFollowers(user._id);

    return followers;
};