import { api } from '@/lib';
import * as conversationTypes from '../type';
import { CONVERSATION_ENDPOINTS } from './conversationEndpoints';

export const fetchConversations = async (payload: conversationTypes.FetchConversationsPayload): Promise<conversationTypes.FetchConversationsResponse['data']> => {

    const res = await api.get<conversationTypes.FetchConversationsResponse>(CONVERSATION_ENDPOINTS.fetch(payload));

    return res.data.data;
};

export const fetchConversationDetails = async (conversationId: string): Promise<conversationTypes.FetchConversationDetailsResponse['data']> => {

    const res = await api.get<conversationTypes.FetchConversationDetailsResponse>(CONVERSATION_ENDPOINTS.fetchDetails(conversationId));

    return res.data.data;
};

export const markAllConversationMessagesAsRead = async (conversationId: string): Promise<void> => {

    await api.patch<conversationTypes.MarkAllConversationMessagesAsReadResponse>(CONVERSATION_ENDPOINTS.markAllMessagesAsRead(conversationId));
};