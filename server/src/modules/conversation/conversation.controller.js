import { StatusCodes } from "http-status-codes";

import * as services from "./conversation.service.js";
import { asyncHandler, ApiResponse } from "../../shared/utils/index.js";
import { CONVERSATION_MESSAGES } from "../../shared/constants/messages/index.js";


export const fetchConversationsController = asyncHandler(async (req, res) => {

    const { page, limit } = req.query;

    const userId = req.user.id;

    const conversations = await services.fetchConversationsService(userId, page, limit);

    return res.status(StatusCodes.OK)
        .json(new ApiResponse(CONVERSATION_MESSAGES.CONVERSATIONS_FETCH_SUCCESS, conversations));
});

export const fetchConversationDetailsController = asyncHandler(async (req, res) => {

    const conversationId = req.params.conversationId;

    const userId = req.user.id;

    const conversationDetails = await services.fetchConversationDetailsService(userId, conversationId);

    return res.status(StatusCodes.OK)
        .json(new ApiResponse(CONVERSATION_MESSAGES.CONVERSATION_DETAILS_FETCH_SUCCESS, conversationDetails));
});

export const markConversationMessagesAsReadController = asyncHandler(async (req, res) => {

    const conversationId = req.params.conversationId;

    const userId = req.user.id;

    await services.markConversationMessagesAsReadService(userId, conversationId);

    return res.status(StatusCodes.OK)
        .json(new ApiResponse(CONVERSATION_MESSAGES.CONVERSATION_MESSAGES_MARK_READ_ALL_SUCCESS));
});