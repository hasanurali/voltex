import { StatusCodes } from "http-status-codes";

import * as postRepository from "../post/post.repository.js";
import * as commentRepository from "./comment.repository.js";
import { ApiError, whitelistInput, withTransaction, convertToObjectId } from "../../shared/utils/index.js";
import { POST_MESSAGES, COMMENT_MESSAGES } from "../../shared/constants/messages/index.js";

export const createCommentService = async (userId, commentData) => {

    const { post, parentComment } = commentData;

    const postObjectId = convertToObjectId(post);
    if (!postObjectId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, POST_MESSAGES.INVALID_POST_ID);
    };

    const isPostExists = await postRepository.findPost(postObjectId);
    if (!isPostExists) {
        throw new ApiError(StatusCodes.NOT_FOUND, POST_MESSAGES.NOT_FOUND);
    };

    const parentCommentObjectId = parentComment && convertToObjectId(parentComment);
    if (parentComment && !parentCommentObjectId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, COMMENT_MESSAGES.INVALID_COMMENT_ID);
    };

    const fetchedParentComment = parentCommentObjectId && await commentRepository.findComment(parentCommentObjectId);
    if (parentCommentObjectId && !fetchedParentComment) {
        throw new ApiError(StatusCodes.NOT_FOUND, COMMENT_MESSAGES.NOT_FOUND);
    };

    if (fetchedParentComment && fetchedParentComment.post.toString() !== postObjectId.toString()) {
        throw new ApiError(StatusCodes.BAD_REQUEST, COMMENT_MESSAGES.PARENT_COMMENT_POST_MISMATCH);
    };

    const allowedFields = ['content'];
    const whitelistedData = whitelistInput(commentData, allowedFields);

    const parentCommentId = fetchedParentComment ?
        parentCommentObjectId
        :
        null;

    let comment;

    await withTransaction(async (session) => {

        comment = await commentRepository.createComment({
            author: userId,
            post: postObjectId,
            parentComment: parentCommentId,
            ...whitelistedData
        }, session);

        await postRepository.incrementPostComment(postObjectId, session);

        (
            parentCommentId &&
            await commentRepository.incrementRepliesCount(parentCommentId, session)
        );
    });

    return comment;
};