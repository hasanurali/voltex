import { StatusCodes } from "http-status-codes";

import * as conversationRepository from "./conversation.repository.js";
import { messageRepository } from "../message/index.js";
import { ApiError, convertToObjectId, pagination } from "../../shared/utils/index.js";
import { CONVERSATION_MESSAGES } from "../../shared/constants/messages/index.js";


export const fetchConversationsService = async (userId, page, limit) => {

    const userObjectId = convertToObjectId(userId);

    const { page: safePage, limit: safeLimit, skip } = pagination(page, limit);

    const result = await conversationRepository.fetchConversation(userObjectId, skip, safeLimit);

    const conversations = result?.data ?? [];
    const total = result?.metadata?.[0]?.total ?? 0;

    const totalPages = Math.ceil(total / safeLimit);

    return {
        data: conversations,
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

export const fetchConversationDetailsService = async (userId, conversationId) => {

    const userObjectId = convertToObjectId(userId);

    const conversationObjectId = convertToObjectId(conversationId);
    if (!conversationObjectId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, CONVERSATION_MESSAGES.INVALID_CONVERSATION_ID);
    };

    const conversationDetails = await conversationRepository.fetchConversationDetails(userObjectId, conversationObjectId);
    if (!conversationDetails) {
        throw new ApiError(StatusCodes.NOT_FOUND, CONVERSATION_MESSAGES.NOT_FOUND);
    };

    return conversationDetails;
};

export const markConversationMessagesAsReadService = async (userId, conversationId) => {

    const userObjectId = convertToObjectId(userId);

    const conversationObjectId = convertToObjectId(conversationId);
    if (!conversationObjectId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, CONVERSATION_MESSAGES.INVALID_CONVERSATION_ID);
    };

    const conversation = await conversationRepository.findConversation(conversationId, userId);
    if (!conversation) {
        throw new ApiError(StatusCodes.NOT_FOUND, CONVERSATION_MESSAGES.NOT_FOUND);
    };

    await messageRepository.markMessagesAsRead(conversationObjectId, userObjectId);
};