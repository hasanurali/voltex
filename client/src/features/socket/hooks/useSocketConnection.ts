import { useEffect } from 'react';
import { useQueryClient, type QueryClient } from '@tanstack/react-query';
import { socket, connectSocket, disconnectSocket } from '@/lib/socket';
import { refreshAccessToken } from '@/lib/api';
import { useAuthStore } from '@/store';
import { notificationKeys } from '@/features/notification/api/queryKeys';
import { conversationKeys } from '@/features/conversation';
import { messageKeys } from '@/features/message/api/messageKeys';
import { userKeys } from '@/features/user/api/userKeys';
import { isAxiosError } from 'axios';

const resyncAfterReconnect = (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    queryClient.invalidateQueries({ queryKey: conversationKeys.conversations() });
    queryClient.invalidateQueries({ queryKey: messageKeys.all });
    queryClient.invalidateQueries({ queryKey: userKeys.all });
};

export const useSocketConnection = () => {

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const queryClient = useQueryClient();

    useEffect(() => {

        if (!isAuthenticated) {
            return;
        };

        let hasRetriedAuth = false;

        const handleConnect = () => {
            hasRetriedAuth = false;
        };

        const handleConnectError = async () => {

            if (socket.active || hasRetriedAuth) {
                return;
            };

            hasRetriedAuth = true;

            try {
                await refreshAccessToken();
                socket.connect();
            } catch (error) {
                if (isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
                    useAuthStore.getState().clearAuth();
                };
            };
        };

        const handleReconnect = () => resyncAfterReconnect(queryClient);

        socket.on('connect', handleConnect);
        socket.on('connect_error', handleConnectError);
        socket.io.on('reconnect', handleReconnect);

        connectSocket();

        return () => {
            socket.off('connect', handleConnect);
            socket.off('connect_error', handleConnectError);
            socket.io.off('reconnect', handleReconnect);
            disconnectSocket();
        };
    }, [isAuthenticated, queryClient]);
};