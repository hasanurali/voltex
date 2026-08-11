import { StatusCodes } from "http-status-codes";

import * as services from "./block.service.js";
import { asyncHandler, ApiResponse } from "../../shared/utils/index.js";
import { BLOCK_MESSAGES } from "../../shared/constants/messages/index.js";


export const blockUserController = asyncHandler(async (req, res) => {

    const username = req.params.username;

    const userId = req.user.id;

    await services.blockUserService(userId, username);

    return res.status(StatusCodes.CREATED)
        .json(new ApiResponse(BLOCK_MESSAGES.BLOCK_USER_SUCCESS));
});