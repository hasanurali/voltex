import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocketConnection } from './useSocketConnection';
import { registerSocketHandlers } from '../handlers/registerSocketHandlers';

export const useSocket = () => {

    const queryClient = useQueryClient();

    useSocketConnection();
    useEffect(() => registerSocketHandlers(queryClient), [queryClient]);
};