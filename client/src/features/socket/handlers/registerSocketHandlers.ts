import type { QueryClient } from '@tanstack/react-query';
import { socket } from '@/lib/socket';
import { SOCKET_EVENTS } from '../constants';
import type { Message } from '@/features/message/type';
import { handleNotificationReceive } from './notificationHandler';
import { handleMessageReceive } from './messageHandler';

export const registerSocketHandlers = (queryClient: QueryClient) => {

    const onNotification = () => handleNotificationReceive(queryClient);
    const onMessage = (message: Message) => handleMessageReceive(queryClient, message);

    socket.on(SOCKET_EVENTS.notificationReceive, onNotification);
    socket.on(SOCKET_EVENTS.messageReceive, onMessage);

    return () => {
        socket.off(SOCKET_EVENTS.notificationReceive, onNotification);
        socket.off(SOCKET_EVENTS.messageReceive, onMessage);
    };
};