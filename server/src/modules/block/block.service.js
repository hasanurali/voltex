import { StatusCodes } from "http-status-codes";

import * as blockRepository from "./block.repository.js";
import { authRepository } from "../auth/index.js";
import { ApiError, convertToObjectId } from "../../shared/utils/index.js";
import { AUTH_MESSAGES, USER_MESSAGES, BLOCK_MESSAGES } from "../../shared/constants/messages/index.js";


export const blockUserService = async (userId, username) => {

    if (!username) {
        throw new ApiError(StatusCodes.BAD_REQUEST, AUTH_MESSAGES.INVALID_USERNAME);
    };

    const user = await authRepository.findUserByUsername(username, { select: "_id", lean: true });
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, USER_MESSAGES.NOT_FOUND);
    };

    if (userId.toString() === user._id.toString()) {
        throw new ApiError(StatusCodes.BAD_REQUEST, BLOCK_MESSAGES.CANNOT_BLOCK_SELF);
    };

    const isAlreadyBlocked = await blockRepository.checkBlockExistsByBlockerAndBlocked(userId, user._id);
    if (isAlreadyBlocked) {
        throw new ApiError(StatusCodes.CONFLICT, BLOCK_MESSAGES.USER_ALREADY_BLOCKED);
    };

    await blockRepository.blockUser(userId, user._id);
};

export const fetchBlockedUsersService = async (userId) => {

    const blockedUsers = await blockRepository.fetchBlockedUsers(userId);

    return blockedUsers;
};

export const unblockUserService = async (userId, username) => {

    if (!username) {
        throw new ApiError(StatusCodes.BAD_REQUEST, AUTH_MESSAGES.INVALID_USERNAME);
    };

    const user = await authRepository.findUserByUsername(username, { select: "_id", lean: true });
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, USER_MESSAGES.NOT_FOUND);
    };

    const isBlocked = await blockRepository.checkBlockExistsByBlockerAndBlocked(userId, user._id);
    if (!isBlocked) {
        throw new ApiError(StatusCodes.NOT_FOUND, BLOCK_MESSAGES.USER_NOT_BLOCKED);
    };

    await blockRepository.unblockUser(userId, user._id);
};