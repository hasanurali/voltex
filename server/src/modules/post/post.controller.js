import { StatusCodes } from "http-status-codes";

import * as services from "./post.service.js";
import { asyncHandler, ApiResponse } from "../../shared/utils/index.js";
import { POST_MESSAGES } from "../../shared/constants/messages/index.js";


export const createPostController = asyncHandler(async (req, res) => {

    const postData = req.body;

    const userId = req.user.id;

    const post = await services.createPostService(userId, postData);

    return res.status(StatusCodes.CREATED)
        .json(new ApiResponse(POST_MESSAGES.POST_CREATE_SUCCESS, post));
});

export const fetchPostsController = asyncHandler(async (req, res) => {

    const cursor = req.params.cursor;

    const userId = req.user?.id;

    const { posts, nextCursor } = await services.fetchPostsService(userId, cursor);

    return res.status(StatusCodes.OK)
        .json(new ApiResponse(POST_MESSAGES.POST_FETCH_SUCCESS, { posts, nextCursor }));
});

export const fetchPostDetailsController = asyncHandler(async (req, res) => {

    const postId = req.params.postId;

    const detailedPost = await services.fetchPostDetailsService(postId);

    return res.status(StatusCodes.OK)
        .json(new ApiResponse(POST_MESSAGES.POST_DETAILS_FETCH_SUCCESS, detailedPost));
});

export const fetchUserPostsController = asyncHandler(async (req, res) => {

    const username = req.params.username;

    const { page, limit } = req.query;

    const userPosts = await services.fetchUserPostsService(username, page, limit);

    return res.status(StatusCodes.OK)
        .json(new ApiResponse(POST_MESSAGES.USER_POST_FETCH_SUCCESS, userPosts));
});

export const updatePostController = asyncHandler(async (req, res) => {

    const postId = req.params.postId;

    const postData = req.body;

    const userId = req.user.id;

    const updatedPost = await services.updatePostService(userId, postId, postData);

    return res.status(StatusCodes.OK)
        .json(new ApiResponse(POST_MESSAGES.POST_UPDATE_SUCCESS, updatedPost));
});

export const deletePostController = asyncHandler(async (req, res) => {

    const postId = req.params.postId;

    const userId = req.user.id;

    await services.deletePostService(userId, postId);

    return res.status(StatusCodes.OK)
        .json(new ApiResponse(POST_MESSAGES.POST_DELETE_SUCCESS));
});