import { SOCKET_EVENTS } from './constants';
import type { Notification } from '@/features/notification/type';
import type { Message } from '@/features/message/type';

export interface UserIdPayload {
    userId: string;
};

export interface ServerToClientEvents {
    [SOCKET_EVENTS.notificationReceive]: (notification: Notification) => void;
    [SOCKET_EVENTS.messageReceive]: (message: Message) => void;
    [SOCKET_EVENTS.userOnline]: (payload: UserIdPayload) => void;
    [SOCKET_EVENTS.userOffline]: (payload: UserIdPayload) => void;
    [SOCKET_EVENTS.typingStart]: (payload: UserIdPayload) => void;
    [SOCKET_EVENTS.typingStop]: (payload: UserIdPayload) => void;
};

export interface ClientToServerEvents {
    [SOCKET_EVENTS.subscribeUsers]: (userIds: string[]) => void;
    [SOCKET_EVENTS.joinConversation]: (conversationId: string) => void;
    [SOCKET_EVENTS.typingStart]: (conversationId: string) => void;
    [SOCKET_EVENTS.typingStop]: (conversationId: string) => void;
};