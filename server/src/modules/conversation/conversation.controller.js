import { StatusCodes } from "http-status-codes";

import * as services from "./conversation.service.js";
import { asyncHandler, ApiResponse } from "../../shared/utils/index.js";
import { CONVERSATION_MESSAGES } from "../../shared/constants/messages/index.js";


export const fetchConversationsController = asyncHandler(async (req, res) => {

    const { page, limit } = req.query;

    const userId = req.user.id;

    const conversations = await services.fetchConversationsService(userId, page, limit);

    return res.status(StatusCodes.OK)
        .json(new ApiResponse(CONVERSATION_MESSAGES.CONVERSATION_FETCH_SUCCESS, conversations));
});
