import { api } from '@/lib';
import * as messageTypes from '../type';
import { MESSAGE_ENDPOINTS } from './messageEndpoints';

export const createMessage = async (payload: messageTypes.CreateMessagePayload): Promise<messageTypes.CreateMessageResponse['data']> => {

    const res = await api.post<messageTypes.CreateMessageResponse>(MESSAGE_ENDPOINTS.create, payload);

    return res.data.data;
};

export const fetchConversationMessages = async (payload: messageTypes.FetchMessagesPayload): Promise<messageTypes.FetchMessagesResponse['data']> => {

    const res = await api.get<messageTypes.FetchMessagesResponse>(MESSAGE_ENDPOINTS.fetch(payload));

    return res.data.data;
};

export const deleteMessage = async (messageId: string): Promise<void> => {

    await api.delete<messageTypes.DeleteMessageResponse>(MESSAGE_ENDPOINTS.delete(messageId));
};