import type { QueryClient } from '@tanstack/react-query';
import { handleNotificationReceive } from './notificationHandler';
import { socket } from '@/lib/socket';
import { SOCKET_EVENTS } from '../constants';

export const registerSocketHandlers = (queryClient: QueryClient) => {

    const onNotification = () => handleNotificationReceive(queryClient);

    socket.on(SOCKET_EVENTS.notificationReceive, onNotification);

    return () => {
        socket.off(SOCKET_EVENTS.notificationReceive, onNotification);
    };
};