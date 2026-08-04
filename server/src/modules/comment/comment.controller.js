import { StatusCodes } from "http-status-codes";

import * as services from "./comment.service.js";
import { asyncHandler, ApiResponse } from "../../shared/utils/index.js";
import { COMMENT_MESSAGES } from "../../shared/constants/messages/index.js";


export const createCommentController = asyncHandler(async (req, res) => {

    const commentData = req.body;

    const userId = req.user.id;

    const comment = await services.createCommentService(userId, commentData);

    return res.status(StatusCodes.CREATED)
        .json(new ApiResponse(COMMENT_MESSAGES.COMMENT_CREATE_SUCCESS, comment));
});

export const fetchCommentController = asyncHandler(async (req, res) => {

    const postId = req.params.postId;

    const { page, limit } = req.query;

    const comments = await services.fetchCommentService(postId, page, limit);

    return res.status(StatusCodes.OK)
        .json(new ApiResponse(COMMENT_MESSAGES.COMMENT_FETCH_SUCCESS, comments));
});

export const fetchCommentRepliesController = asyncHandler(async (req, res) => {

    const commentId = req.params.commentId;

    const commentReplies = await services.fetchCommentRepliesService(commentId);

    return res.status(StatusCodes.OK)
        .json(new ApiResponse(COMMENT_MESSAGES.COMMENT_REPLIES_FETCH_SUCCESS, commentReplies));
});

export const updateCommentController = asyncHandler(async (req, res) => {

    const commentId = req.params.commentId;

    const commentData = req.body;

    const userId = req.user.id;

    const updatedComment = await services.updateCommentService(userId, commentId, commentData);

    return res.status(StatusCodes.OK)
        .json(new ApiResponse(COMMENT_MESSAGES.COMMENT_UPDATE_SUCCESS, updatedComment));
});