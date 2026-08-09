import { StatusCodes } from "http-status-codes";

import * as services from "./message.service.js";
import { asyncHandler, ApiResponse } from "../../shared/utils/index.js";
import { MESSAGE_MESSAGES } from "../../shared/constants/messages/index.js";


export const createMessageController = asyncHandler(async (req, res) => {

    const messageData = req.body;

    const userId = req.user.id;

    const message = await services.createMessageService(userId, messageData);

    return res.status(StatusCodes.CREATED)
        .json(new ApiResponse(MESSAGE_MESSAGES.MESSAGE_CREATE_SUCCESS, message));
});