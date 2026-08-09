import { StatusCodes } from "http-status-codes";

import * as messageRepository from "./message.repository.js";
import { conversationRepository } from "../conversation/index.js";
import { authRepository } from "../auth/index.js";
import { ApiError, whitelistInput, convertToObjectId } from "../../shared/utils/index.js";
import { MESSAGE_MESSAGES, USER_MESSAGES, CONVERSATION_MESSAGES } from "../../shared/constants/messages/index.js";

export const createMessageService = async (userId, messageData) => {

    const { content, media = [], conversation: conversationId, participant: participantId } = messageData;

    if (!content && !media?.length) {
        throw new ApiError(StatusCodes.BAD_REQUEST, MESSAGE_MESSAGES.CONTENT_OR_MEDIA_REQUIRED);
    };

    const isValidPublicIds = media?.every(({ publicId }) => publicId?.trim());
    if (!isValidPublicIds) {
        throw new ApiError(StatusCodes.BAD_REQUEST, MESSAGE_MESSAGES.MESSAGE_CREATE_FAIL);
    };

    const conversationObjectId = convertToObjectId(conversationId);
    const participantObjectId = convertToObjectId(participantId);

    if (!conversationObjectId && !participantObjectId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, CONVERSATION_MESSAGES.CONVERSATION_OR_PARTICIPANT_REQUIRED)
    };

    const isValidParticipant = await (
        participantObjectId && authRepository.findUserById(participantObjectId)
    );
    if (!conversationObjectId && !isValidParticipant) {
        throw new ApiError(StatusCodes.NOT_FOUND, USER_MESSAGES.NOT_FOUND);
    };

    const conversation = await conversationRepository.createConversation(conversationObjectId, [userId, participantObjectId]);
    if (conversationObjectId && !conversation) {
        throw new ApiError(StatusCodes.NOT_FOUND, CONVERSATION_MESSAGES.NOT_FOUND)
    };

    const allowedFields = ['content', 'media'];
    const whitelistedData = whitelistInput(messageData, allowedFields);

    const message = await messageRepository.createMessage({
        conversation: conversation._id,
        sender: userId,
        ...whitelistedData
    });

    return message;
};