import { useCallback, useEffect, useRef } from 'react';
import { socket } from '@/lib/socket';
import { SOCKET_EVENTS } from '../constants';

export const useTypingEmitter = (conversationId?: string) => {

    const isTypingRef = useRef(false);
    const lastEmitRef = useRef(0);
    const stopTimerRef = useRef<number | undefined>(undefined);

    const stopTyping = useCallback(() => {

        clearTimeout(stopTimerRef.current);

        if (!conversationId || !isTypingRef.current) {
            return;
        };

        isTypingRef.current = false;
        socket.emit(SOCKET_EVENTS.typingStop, conversationId);
    }, [conversationId]);

    const startTyping = useCallback(() => {

        if (!conversationId) {
            return;
        };

        const now = Date.now();

        if (!isTypingRef.current || now - lastEmitRef.current > 2000) {
            isTypingRef.current = true;
            lastEmitRef.current = now;
            socket.emit(SOCKET_EVENTS.typingStart, conversationId);
        };

        clearTimeout(stopTimerRef.current);
        stopTimerRef.current = setTimeout(stopTyping, 3000);
    }, [conversationId, stopTyping]);

    useEffect(() => {
        stopTyping();
    }, [stopTyping]);

    return { startTyping, stopTyping };
};