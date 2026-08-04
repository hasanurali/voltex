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

export const fetchCommentService = async (postId, page = 1, limit = 10) => {

    const postObjectId = convertToObjectId(postId);
    if (!postObjectId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, POST_MESSAGES.INVALID_POST_ID);
    };

    const post = await postRepository.findPost(postObjectId);
    if (!post) {
        throw new ApiError(StatusCodes.NOT_FOUND, POST_MESSAGES.NOT_FOUND);
    };

    const parsedPage = Number(page);
    const parsedLimit = Number(limit);

    const safePage = Number.isFinite(parsedPage) ?
        Math.max(Math.floor(parsedPage), 1)
        :
        1;

    const safeLimit = Number.isFinite(parsedLimit) ?
        Math.min(Math.max(Math.floor(parsedLimit), 1), 50)
        :
        10;

    const skip = (safePage - 1) * safeLimit;

    const result = await commentRepository.fetchComment(postObjectId, skip, safeLimit);

    const comments = result?.data ?? [];
    const total = result?.metadata?.[0]?.total ?? 0;

    const totalPages = Math.ceil(total / safeLimit);

    return {
        data: comments,
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

export const fetchCommentRepliesService = async (commentId) => {

    const commentObjectId = convertToObjectId(commentId);
    if (!commentObjectId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, COMMENT_MESSAGES.INVALID_COMMENT_ID);
    };

    const comment = await commentRepository.findComment(commentObjectId);
    if (!comment) {
        throw new ApiError(StatusCodes.NOT_FOUND, COMMENT_MESSAGES.NOT_FOUND);
    };

    const commentReplies = await commentRepository.fetchCommentReplies(commentObjectId);

    return commentReplies;
};

export const updateCommentService = async (userId, commentId, commentData) => {

    const commentObjectId = convertToObjectId(commentId);
    if (!commentObjectId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, COMMENT_MESSAGES.INVALID_COMMENT_ID);
    };

    const comment = await commentRepository.findComment(commentObjectId);
    if (!comment) {
        throw new ApiError(StatusCodes.NOT_FOUND, COMMENT_MESSAGES.NOT_FOUND);
    };

    if (comment.author.toString() !== userId.toString()) {
        throw new ApiError(StatusCodes.FORBIDDEN, COMMENT_MESSAGES.NOT_OWNER);
    };

    const allowedFields = ['content'];
    const whitelistedData = whitelistInput(commentData, allowedFields);

    const updatedComment = await commentRepository.updateComment(commentObjectId, whitelistedData);

    return updatedComment;
};