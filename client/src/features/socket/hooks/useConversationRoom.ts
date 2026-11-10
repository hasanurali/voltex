import { useEffect } from 'react';
import { socket } from '@/lib/socket';
import { useChatStore } from '@/store';
import { SOCKET_EVENTS } from '../constants';

export const useConversationRoom = (conversationId?: string) => {

    const setActive = useChatStore((state) => state.setActiveConversationId);

    useEffect(() => {

        if (!conversationId) {
            return;
        };

        setActive(conversationId);

        const join = () => socket.emit(SOCKET_EVENTS.joinConversation, conversationId);

        if (socket.connected) {
            join();
        };

        socket.on('connect', join);

        return () => {
            socket.off('connect', join);
            setActive(null);
        };
    }, [conversationId, setActive]);
};