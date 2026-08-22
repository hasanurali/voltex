import { StatusCodes } from "http-status-codes";

import * as reactionRepository from "./reaction.repository.js";
import * as postRepository from "../post/post.repository.js";
import * as commentRepository from "../comment/comment.repository.js";
import { ApiError, withTransaction, convertToObjectId } from "../../shared/utils/index.js";
import { REACTION_MESSAGES } from "../../shared/constants/messages/index.js";
import { createNotification } from "../notification/index.js";
import { REACTION_TARGET_TYPE, NOTIFICATION_TARGET_TYPE, NOTIFICATION_TYPE } from "../../shared/constants/enums/index.js";


export const createReactionService = async (userId, reactionData) => {

    const { targetType, targetId } = reactionData;

    if (!targetType || !Object.values(REACTION_TARGET_TYPE).includes(targetType)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, REACTION_MESSAGES.INVALID_TARGET_TYPE);
    };

    const targetObjectId = convertToObjectId(targetId);
    if (!targetObjectId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, REACTION_MESSAGES.INVALID_TARGET_ID(targetType))
    };

    const target = (

        targetType === REACTION_TARGET_TYPE.POST ?
            await postRepository.findPost(targetObjectId, { select: "author", lean: true })
            :
            await commentRepository.findCommentById(targetObjectId, { select: "author", lean: true })
    );

    if (!target) {
        throw new ApiError(StatusCodes.NOT_FOUND, REACTION_MESSAGES.TARGET_NOT_FOUND(targetType));
    };

    const reaction = await reactionRepository.checkReactionExists({ user: userId, targetId: targetObjectId, targetType });
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

    const isPostTarget = targetType === REACTION_TARGET_TYPE.POST;

    void createNotification({
        user: target.author,
        triggeredBy: userId,
        entityId: targetObjectId,
        entityType: (
            isPostTarget ?
                NOTIFICATION_TARGET_TYPE.POST
                :
                NOTIFICATION_TARGET_TYPE.COMMENT
        ),
        type: (
            isPostTarget ?
                NOTIFICATION_TYPE.POST_LIKE
                :
                NOTIFICATION_TYPE.COMMENT_LIKE
        ),
        metadata: {
            ...(
                isPostTarget ?
                    { postId: target._id }
                    :
                    { commentId: target._id }
            )
        }
    });

    return targetType;
};

export const deleteReactionService = async (userId, reactionData) => {

    const { targetType, targetId } = reactionData;

    if (!targetType || !Object.values(REACTION_TARGET_TYPE).includes(targetType)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, REACTION_MESSAGES.INVALID_TARGET_TYPE);
    };

    const targetObjectId = convertToObjectId(targetId);
    if (!targetObjectId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, REACTION_MESSAGES.INVALID_TARGET_ID(targetType))
    };

    const isTargetExists = (

        targetType === REACTION_TARGET_TYPE.POST ?
            await postRepository.checkPostExistsById(targetObjectId)
            :
            await commentRepository.checkCommentExistsById(targetObjectId)
    );

    if (!isTargetExists) {
        throw new ApiError(StatusCodes.NOT_FOUND, REACTION_MESSAGES.TARGET_NOT_FOUND(targetType));
    };

    const reaction = await reactionRepository.checkReactionExists({ user: userId, targetId: targetObjectId, targetType });
    if (!reaction) {
        throw new ApiError(StatusCodes.CONFLICT, REACTION_MESSAGES.NOT_REACTED(targetType))
    };

    const decrementTarget = (

        targetType === REACTION_TARGET_TYPE.POST ?
            postRepository.decrementLikeCount
            :
            commentRepository.decrementLikeCount
    );

    await withTransaction(async (session) => {

        const result = await reactionRepository.deleteReaction({ user: userId, targetId: targetObjectId, targetType }, session);

        if (result.deletedCount === 1) {
            await decrementTarget(targetObjectId, session);
        };
    });

    return targetType;
};