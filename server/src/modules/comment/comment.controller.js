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