import { StatusCodes } from "http-status-codes";

import * as services from "./follow.service.js";
import { asyncHandler, ApiResponse } from "../../shared/utils/index.js";
import { FOLLOW_MESSAGES } from "../../shared/constants/messages/index.js";

export const followUserController = asyncHandler(async (req, res) => {

    const username = req.params.username;

    const userId = req.user.id;

    await services.followUserService(userId, username);

    return res.status(StatusCodes.OK)
        .json(new ApiResponse(FOLLOW_MESSAGES.FOLLOW_SUCCESS));
});

export const fetchFollowersController = asyncHandler(async (req, res) => {

    const username = req.params.username;

    const followers = await services.fetchFollowersService(username);

    return res.status(StatusCodes.OK)
        .json(new ApiResponse(FOLLOW_MESSAGES.FOLLOWERS_FETCH_SUCCESS, followers));
});

export const fetchFollowingsController = asyncHandler(async (req, res) => {

    const username = req.params.username;

    const followings = await services.fetchFollowingsService(username);

    return res.status(StatusCodes.OK)
        .json(new ApiResponse(FOLLOW_MESSAGES.FOLLOWING_FETCH_SUCCESS, followings));
});