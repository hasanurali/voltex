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