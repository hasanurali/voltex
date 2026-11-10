import type { QueryClient } from '@tanstack/react-query';
import { socket } from '@/lib/socket';
import { SOCKET_EVENTS } from '../constants';
import type { Message } from '@/features/message/type';
import { handleNotificationReceive } from './notificationHandler';
import { handleMessageReceive } from './messageHandler';
import { handleUserOnline, handleUserOffline, handleDisconnect } from './presenceHandler';
import { handleBlockChanged } from './blockHandler';

export const registerSocketHandlers = (queryClient: QueryClient) => {

    const onNotification = () => handleNotificationReceive(queryClient);
    const onMessage = (message: Message) => handleMessageReceive(queryClient, message);
    const onBlockChanged = () => handleBlockChanged(queryClient);

    socket.on(SOCKET_EVENTS.notificationReceive, onNotification);
    socket.on(SOCKET_EVENTS.messageReceive, onMessage);
    socket.on(SOCKET_EVENTS.userOnline, handleUserOnline);
    socket.on(SOCKET_EVENTS.userOffline, handleUserOffline);
    socket.on(SOCKET_EVENTS.blockChanged, onBlockChanged);
    socket.on('disconnect', handleDisconnect);

    return () => {
        socket.off(SOCKET_EVENTS.notificationReceive, onNotification);
        socket.off(SOCKET_EVENTS.messageReceive, onMessage);
        socket.off(SOCKET_EVENTS.userOnline, handleUserOnline);
        socket.off(SOCKET_EVENTS.userOffline, handleUserOffline);
        socket.off(SOCKET_EVENTS.blockChanged, onBlockChanged);
        socket.off('disconnect', handleDisconnect);
    };
};