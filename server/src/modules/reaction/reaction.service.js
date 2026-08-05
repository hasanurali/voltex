import { StatusCodes } from "http-status-codes";

import * as reactionRepository from "./reaction.repository.js";
import * as postRepository from "../post/post.repository.js";
import * as commentRepository from "../comment/comment.repository.js";
import { ApiError, withTransaction, convertToObjectId } from "../../shared/utils/index.js";
import { REACTION_MESSAGES } from "../../shared/constants/messages/index.js";
import { REACTION_TARGET_TYPE } from "../../shared/constants/enums/index.js";

export const createReactionService = async (userId, reactionData) => {

    const { targetType, targetId } = reactionData;

    if (!targetType || !Object.values(REACTION_TARGET_TYPE).includes(targetType)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, REACTION_MESSAGES.INVALID_TARGET_TYPE);
    };

    const targetObjectId = convertToObjectId(targetId);
    if (!targetObjectId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, REACTION_MESSAGES.INVALID_TARGET_ID(targetType))
    };

    const isTargetExists = await (

        targetType === REACTION_TARGET_TYPE.POST ?
            postRepository.findPost(targetObjectId)
            :
            commentRepository.findComment(targetObjectId)
    );

    if (!isTargetExists) {
        throw new ApiError(StatusCodes.NOT_FOUND, REACTION_MESSAGES.TARGET_NOT_FOUND(targetType));
    };

    const reaction = await reactionRepository.findReaction({ user: userId, targetId: targetObjectId, targetType });
    if (reaction) {
        throw new ApiError(StatusCodes.CONFLICT, REACTION_MESSAGES.ALREADY_REACTED(targetType))
    };

    const incrementTarget = (

        targetType === REACTION_TARGET_TYPE.POST ?
            postRepository.incrementLikeCount
            :
            commentRepository.incrementLikeCount
    );

    await withTransaction(async (session) => {

        await reactionRepository.createReaction({ user: userId, targetId: targetObjectId, targetType }, session);

        await incrementTarget(targetObjectId, session);
    });

    return targetType;
};