import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';
import { SOCKET_EVENTS } from '../constants';
import type { UserIdPayload } from '../types';

export const useTypingIndicator = (otherUserId?: string) => {

    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {

        if (!otherUserId) {
            return;
        };

        let timer: number | undefined;

        const stop = () => {
            clearTimeout(timer);
            setIsTyping(false);
        };

        const handleStart = ({ userId }: UserIdPayload) => {

            if (userId !== otherUserId) {
                return;
            };

            setIsTyping(true);
            clearTimeout(timer);

            timer = setTimeout(() => {
                setIsTyping(false)
            }, 5000);
        };

        const handleStop = ({ userId }: UserIdPayload) => {

            if (userId !== otherUserId) {
                return;
            };

            stop();
        };

        socket.on(SOCKET_EVENTS.typingStart, handleStart);
        socket.on(SOCKET_EVENTS.typingStop, handleStop);
        socket.on('disconnect', stop);

        return () => {
            socket.off(SOCKET_EVENTS.typingStart, handleStart);
            socket.off(SOCKET_EVENTS.typingStop, handleStop);
            socket.off('disconnect', stop);
            stop();
        };
    }, [otherUserId]);

    return isTyping;
};