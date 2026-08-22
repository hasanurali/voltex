import { StatusCodes } from "http-status-codes";

import * as postRepository from "../post/post.repository.js";
import * as commentRepository from "./comment.repository.js";
import { ApiError, whitelistInput, withTransaction, convertToObjectId, pagination } from "../../shared/utils/index.js";
import { POST_MESSAGES, COMMENT_MESSAGES } from "../../shared/constants/messages/index.js";
import { createNotification } from "../notification/index.js";
import { NOTIFICATION_TARGET_TYPE, NOTIFICATION_TYPE } from "../../shared/constants/enums/index.js";


export const createCommentService = async (userId, commentData) => {

    const { post: postId, parentComment } = commentData;

    const postObjectId = convertToObjectId(postId);
    if (!postObjectId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, POST_MESSAGES.INVALID_POST_ID);
    };

    const post = await postRepository.findPost(postObjectId, { select: "author", lean: true });
    if (!post) {
        throw new ApiError(StatusCodes.NOT_FOUND, POST_MESSAGES.NOT_FOUND);
    };

    const parentCommentObjectId = parentComment && convertToObjectId(parentComment);
    if (parentComment && !parentCommentObjectId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, COMMENT_MESSAGES.INVALID_COMMENT_ID);
    };

    const fetchedParentComment = parentCommentObjectId && await commentRepository.findCommentById(parentCommentObjectId, { select: "author post parentComment depth", lean: true });
    if (parentCommentObjectId && !fetchedParentComment) {
        throw new ApiError(StatusCodes.NOT_FOUND, COMMENT_MESSAGES.NOT_FOUND);
    };

    if (fetchedParentComment && fetchedParentComment.post.toString() !== postObjectId.toString()) {
        throw new ApiError(StatusCodes.BAD_REQUEST, COMMENT_MESSAGES.PARENT_COMMENT_POST_MISMATCH);
    };

    const allowedFields = ['content'];
    const whitelistedData = whitelistInput(commentData, allowedFields);

    let commentAuthor = fetchedParentComment && fetchedParentComment.author;

    const depth = fetchedParentComment ?
        fetchedParentComment.depth + 1
        :
        0;

    let parentCommentId = fetchedParentComment ?
        parentCommentObjectId
        :
        null;

    if (depth > 2) {

        parentCommentId = fetchedParentComment.parentComment;

        commentAuthor = (
            await commentRepository.findCommentById(parentCommentId, { select: "author", lean: true })
        ).author;
    };

    const comment = await withTransaction(async (session) => {

        const comment = await commentRepository.createComment({
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

        return comment;
    });

    void createNotification({
        user: (
            parentCommentId ?
                commentAuthor
                :
                post.author
        ),
        triggeredBy: userId,
        entityId: (
            parentCommentId || post._id
        ),
        entityType: (
            parentCommentId ?
                NOTIFICATION_TARGET_TYPE.COMMENT
                :
                NOTIFICATION_TARGET_TYPE.POST
        ),
        type: (
            parentCommentId ?
                NOTIFICATION_TYPE.COMMENT_REPLY
                :
                NOTIFICATION_TYPE.POST_COMMENT
        ),
        metadata: {
            ...(
                parentCommentId ?
                    { commentId: comment._id }
                    :
                    { postId: post._id }
            )
        }
    });

    return comment;
};

export const fetchCommentService = async (postId, page, limit) => {

    const postObjectId = convertToObjectId(postId);
    if (!postObjectId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, POST_MESSAGES.INVALID_POST_ID);
    };

    const isPostExists = await postRepository.checkPostExistsById(postObjectId);
    if (!isPostExists) {
        throw new ApiError(StatusCodes.NOT_FOUND, POST_MESSAGES.NOT_FOUND);
    };

    const { page: safePage, limit: safeLimit, skip } = pagination(page, limit);

    const result = await commentRepository.fetchCommentsByPostId(postObjectId, skip, safeLimit);

    const comments = result?.data ?? [];
    const total = result?.metadata?.[0]?.total ?? 0;

    const totalPages = Math.ceil(total / safeLimit);

    return {
        comments,
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

export const fetchCommentRepliesService = async (commentId, page, limit) => {

    const commentObjectId = convertToObjectId(commentId);
    if (!commentObjectId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, COMMENT_MESSAGES.INVALID_COMMENT_ID);
    };

    const isCommentExists = await commentRepository.checkCommentExistsById(commentObjectId);
    if (!isCommentExists) {
        throw new ApiError(StatusCodes.NOT_FOUND, COMMENT_MESSAGES.NOT_FOUND);
    };

    const { page: safePage, limit: safeLimit, skip } = pagination(page, limit);

    const result = await commentRepository.fetchRepliesByCommentId(commentObjectId, skip, safeLimit);

    const commentReplies = result?.data ?? [];
    const total = result?.metadata?.[0]?.total ?? 0;

    const totalPages = Math.ceil(total / safeLimit);

    return {
        commentReplies,
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

export const updateCommentService = async (userId, commentId, commentData) => {

    if (!commentData || !Object.keys(commentData).length) {
        throw new ApiError(StatusCodes.BAD_REQUEST, COMMENT_MESSAGES.COMMENT_UPDATE_FAIL);
    };

    const commentObjectId = convertToObjectId(commentId);
    if (!commentObjectId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, COMMENT_MESSAGES.INVALID_COMMENT_ID);
    };

    const comment = await commentRepository.findCommentById(commentObjectId, { select: "author", lean: true });
    if (!comment) {
        throw new ApiError(StatusCodes.NOT_FOUND, COMMENT_MESSAGES.NOT_FOUND);
    };

    if (comment.author.toString() !== userId.toString()) {
        throw new ApiError(StatusCodes.FORBIDDEN, COMMENT_MESSAGES.NOT_OWNER);
    };

    const allowedFields = ['content'];
    const whitelistedData = whitelistInput(commentData, allowedFields);

    if (!Object.keys(whitelistedData).length) {
        throw new ApiError(StatusCodes.BAD_REQUEST, COMMENT_MESSAGES.COMMENT_UPDATE_FAIL);
    };

    const updatedComment = await commentRepository.updateComment(commentObjectId, whitelistedData);

    return updatedComment;
};

export const deleteCommentService = async (userId, commentId) => {

    const commentObjectId = convertToObjectId(commentId);
    if (!commentObjectId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, COMMENT_MESSAGES.INVALID_COMMENT_ID);
    };

    const comment = await commentRepository.findCommentById(commentObjectId, { select: "author parentComment post", lean: true });

    if (!comment) {
        throw new ApiError(StatusCodes.NOT_FOUND, COMMENT_MESSAGES.NOT_FOUND);
    };

    if (comment.author.toString() !== userId.toString()) {
        throw new ApiError(StatusCodes.FORBIDDEN, COMMENT_MESSAGES.NOT_OWNER);
    };

    const parentComment = comment.parentComment;

    await withTransaction(async (session) => {

        const commentCount = await commentRepository.softDeleteCommentAndReplies(userId, commentObjectId, session);

        await postRepository.decrementPostComment(comment.post, commentCount, session);

        (
            parentComment &&
            await commentRepository.decrementRepliesCount(parentComment, session)
        );
    });
};