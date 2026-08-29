import { io, type Socket } from 'socket.io-client';
import { config } from './config';

export const socket: Socket = io(config.socketUrl, {
    withCredentials: true,
    autoConnect: false,
});

export const connectSocket = () => {
    if (!socket.connected) {
        socket.connect();
    };
};

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    };
};