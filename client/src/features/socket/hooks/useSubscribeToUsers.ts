import { useEffect } from 'react';
import { socket } from '@/lib/socket';
import { SOCKET_EVENTS } from '../constants';
import { usePresenceStore } from '@/store';
import { useCheckUserStatuses } from '@/features/user';

export const useSubscribeToUsers = (userIds: string[]) => {

    const key = [...new Set(userIds)].sort().join(',');

    const { mutateAsync: checkUserStatusesMutateAsync } = useCheckUserStatuses();

    useEffect(() => {

        if (!key) {
            return;
        };

        const ids = key.split(',');
        const syncStatuses = async () => {

            socket.emit(SOCKET_EVENTS.subscribeUsers, ids);

            try {
                const statuses = await checkUserStatusesMutateAsync({ userIds: ids });
                usePresenceStore.getState().setMany(statuses);
            } catch {
                // Failed to sync user statuses
            };
        };

        if (socket.connected) {
            syncStatuses();
        };

        socket.on('connect', syncStatuses);

        return () => {
            socket.off('connect', syncStatuses);
        };
    }, [key, checkUserStatusesMutateAsync]);
};