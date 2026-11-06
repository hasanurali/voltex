import { io, type Socket } from 'socket.io-client';
import { config } from './config';
import type { ServerToClientEvents, ClientToServerEvents } from '@/features/socket';

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(config.socketUrl, {
    withCredentials: true,
    autoConnect: false,
    transports: ["websocket"]
});

export const connectSocket = () => {
    socket.connect();
};

export const disconnectSocket = () => {
    socket.disconnect();
};