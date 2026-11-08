import { usePresenceStore } from '@/store';
import type { UserIdPayload } from '../types';

export const handleUserOnline = ({ userId }: UserIdPayload) => {
    usePresenceStore.getState().setOnline(userId, true);
};

export const handleUserOffline = ({ userId }: UserIdPayload) => {
    usePresenceStore.getState().setOnline(userId, false);
};

export const handleDisconnect = () => {
    usePresenceStore.getState().reset();
};