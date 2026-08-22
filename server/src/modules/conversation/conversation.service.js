import { StatusCodes } from "http-status-codes";

import * as conversationRepository from "./conversation.repository.js";
import { messageRepository } from "../message/index.js";
import { ApiError, convertToObjectId, pagination } from "../../shared/utils/index.js";
import { CONVERSATION_MESSAGES } from "../../shared/constants/messages/index.js";


export const fetchConversationsService = async (userId, page, limit) => {

    const { page: safePage, limit: safeLimit, skip } = pagination(page, limit);

    const result = await conversationRepository.fetchConversations(userId, skip, safeLimit);

    const conversations = result?.data ?? [];
    const total = result?.metadata?.[0]?.total ?? 0;

    const totalPages = Math.ceil(total / safeLimit);

    return {
        conversations,
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

    const conversationObjectId = convertToObjectId(conversationId);
    if (!conversationObjectId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, CONVERSATION_MESSAGES.INVALID_CONVERSATION_ID);
    };

    const conversationDetails = await conversationRepository.fetchConversationDetails(userId, conversationObjectId);
    if (!conversationDetails) {
        throw new ApiError(StatusCodes.NOT_FOUND, CONVERSATION_MESSAGES.NOT_FOUND);
    };

    return conversationDetails;
};

export const markConversationMessagesAsReadService = async (userId, conversationId) => {

    const conversationObjectId = convertToObjectId(conversationId);
    if (!conversationObjectId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, CONVERSATION_MESSAGES.INVALID_CONVERSATION_ID);
    };

    const isConversationExists = await conversationRepository.checkConversationExistsByIdAndUser(conversationObjectId, userId);
    if (!isConversationExists) {
        throw new ApiError(StatusCodes.NOT_FOUND, CONVERSATION_MESSAGES.NOT_FOUND);
    };

    await messageRepository.markMessagesAsRead(conversationObjectId, userId);
};