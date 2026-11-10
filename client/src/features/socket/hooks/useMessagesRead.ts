import { useEffect, useRef } from 'react';
import { socket } from '@/lib/socket';
import { useAuthStore } from '@/store';
import { SOCKET_EVENTS } from '../constants';
import type { MessagesReadPayload } from '../types';

export const useMessagesRead = (conversationId: string | undefined, onRead: () => void) => {

    const currentUserId = useAuthStore((state) => state.auth?.user._id);

    const onReadRef = useRef(onRead);
    useEffect(() => {
        onReadRef.current = onRead;
    });

    useEffect(() => {

        if (!conversationId) {
            return;
        };

        const handleRead = ({ conversationId: id, readerId }: MessagesReadPayload) => {

            if (id !== conversationId || readerId === currentUserId) {
                return;
            };

            onReadRef.current();
        };

        socket.on(SOCKET_EVENTS.messagesRead, handleRead);

        return () => {
            socket.off(SOCKET_EVENTS.messagesRead, handleRead);
        };
    }, [conversationId, currentUserId]);
};