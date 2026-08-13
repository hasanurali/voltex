import { StatusCodes } from "http-status-codes";

import * as messageRepository from "./message.repository.js";
import { conversationRepository } from "../conversation/index.js";
import { authRepository } from "../auth/index.js";
import { blockRepository } from "../block/index.js";
import { settingRepository } from "../setting/index.js";
import { followRepository } from "../follow/index.js";
import { ApiError, whitelistInput, convertToObjectId, withTransaction, pagination } from "../../shared/utils/index.js";
import { MESSAGE_MESSAGES, USER_MESSAGES, CONVERSATION_MESSAGES } from "../../shared/constants/messages/index.js";
import { MESSAGE_PERMISSION } from "../../shared/constants/enums/index.js";

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

    let conversation;

    conversation = (
        conversationObjectId &&
        await conversationRepository.findConversation(conversationObjectId, userId)
    );

    if (conversationObjectId && !conversation) {
        throw new ApiError(StatusCodes.NOT_FOUND, CONVERSATION_MESSAGES.NOT_FOUND)
    };

    if (!conversation) {

        const participant = (
            participantObjectId &&
            await authRepository.findUserById(participantObjectId)
        );

        if (!participant) {
            throw new ApiError(StatusCodes.NOT_FOUND, USER_MESSAGES.NOT_FOUND);
        };

        if (userId.toString() === participantObjectId.toString()) {
            throw new ApiError(StatusCodes.BAD_REQUEST, MESSAGE_MESSAGES.CANNOT_MESSAGE_SELF)
        };

        const [isBlocked, isBlockedByTarget] = await Promise.all([
            blockRepository.findBlock(userId, participant._id),
            blockRepository.findBlock(participant._id, userId)
        ]);

        if (isBlocked || isBlockedByTarget) {
            throw new ApiError(StatusCodes.FORBIDDEN, MESSAGE_MESSAGES.CANNOT_MESSAGE_BLOCKED_USER);
        };

        const setting = await settingRepository.fetchSetting(participantObjectId);
        if (setting.privacy.messagePermission === MESSAGE_PERMISSION.FOLLOWER) {

            const isFollower = await followRepository.checkFollowing(userId, participantObjectId);
            if (!isFollower) {
                throw new ApiError(StatusCodes.FORBIDDEN, MESSAGE_MESSAGES.MESSAGE_PERMISSION_FOLLOWER_REQUIRED);
            };
        };

        conversation = await conversationRepository.createConversation([userId, participantObjectId]);
    };

    if (!conversation) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, MESSAGE_MESSAGES.MESSAGE_CREATE_FAIL);
    };

    const allowedFields = ['content', 'media'];
    const whitelistedData = whitelistInput(messageData, allowedFields);

    let message;

    await withTransaction(async (session) => {

        message = await messageRepository.createMessage({
            conversation: conversation._id,
            sender: userId,
            ...whitelistedData
        }, session);

        await conversationRepository.setLastMessage(conversation._id, message._id, session);
    })

    return message;
};

export const fetchConversationMessagesService = async (userId, conversationId, page, limit) => {

    const conversationObjectId = convertToObjectId(conversationId);
    if (!conversationObjectId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, CONVERSATION_MESSAGES.INVALID_CONVERSATION_ID);
    };

    const conversation = await conversationRepository.findConversation(conversationObjectId, userId);
    if (!conversation) {
        throw new ApiError(StatusCodes.NOT_FOUND, CONVERSATION_MESSAGES.NOT_FOUND)
    };

    const { page: safePage, limit: safeLimit, skip } = pagination(page, limit);

    const result = await messageRepository.findAllConversationMessages(conversationObjectId, skip, safeLimit);

    const messages = (result?.data ?? []).reverse();
    const total = result?.metadata?.[0]?.total ?? 0;

    const totalPages = Math.ceil(total / safeLimit);

    return {
        data: messages,
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

export const deleteMessageService = async (userId, messageId) => {

    const messageObjectId = convertToObjectId(messageId);
    if (!messageObjectId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, MESSAGE_MESSAGES.INVALID_MESSAGE_ID)
    };

    const message = await messageRepository.findMessage(messageObjectId);
    if (!message) {
        throw new ApiError(StatusCodes.NOT_FOUND, MESSAGE_MESSAGES.NOT_FOUND);
    };

    if (message.sender.toString() !== userId.toString()) {
        throw new ApiError(StatusCodes.FORBIDDEN, MESSAGE_MESSAGES.NOT_OWNER);
    };

    await messageRepository.softDeleteMessage(messageObjectId);
};