import { Server } from "socket.io";
import { parseCookie } from "cookie";
import jwt from "jsonwebtoken";

import env from "../../config/env.js";
import JWT_CONFIG from "../../config/jwt.js";
import { log, convertToObjectId } from "../utils/index.js";
import { SOCKET_EVENTS } from "../constants/enums/index.js";
import * as conversationRepository from "../../modules/conversation/conversation.repository.js";


const validateConversationMember = async (conversationId, userId) => {

    const conversationObjectId = convertToObjectId(conversationId);

    if (!conversationObjectId) {
        return null;
    }

    const isValidMember = await conversationRepository.checkConversationExistsByIdAndUser(conversationObjectId, userId);

    return isValidMember;
};


export const onlineUsers = new Map();

let io;

export const initializeSocket = (server) => {

    io = new Server(server, {
        transports: ["websocket"],
        cors: {
            origin: env.CLIENT_URL,
            credentials: true
        }
    });

    // Authenticate socket connection
    io.use((socket, next) => {

        try {

            const cookies = parseCookie(socket.handshake.headers.cookie || "");
            const accessToken = cookies.accessToken;

            if (!accessToken) {
                return next(new Error("Authentication required"));
            };

            const decoded = jwt.verify(accessToken, JWT_CONFIG.ACCESS.KEY);
            if (!decoded.userId) {
                return next(new Error("Authentication required"));
            };

            socket.user = {
                id: decoded.userId
            };

            next();

        } catch (err) {

            log(`Authentication error: ${err.message}`, "Socket");

            return next(new Error("Authentication failed"));
        };
    });

    // Handle connections
    io.on(SOCKET_EVENTS.CONNECTION, (socket) => {

        const userId = socket.user.id.toString();

        log(`User ${userId} connected`, "Socket");

        // Join self room for notification
        socket.join(userId);

        // Set user to online user map
        const connectionCount = onlineUsers.get(userId) ?? 0;
        onlineUsers.set(userId, connectionCount + 1);

        // Send online status to current user friends
        socket.to(`status:${userId}`).emit(SOCKET_EVENTS.USER_ONLINE, { userId });

        // Listen for user friends list to subscribe to their real-time online/offline statuses
        socket.on(SOCKET_EVENTS.SUBSCRIBE_USER, (userIds) => {

            if (!Array.isArray(userIds)) return;

            userIds.forEach(userId => {

                if (convertToObjectId(userId)) {

                    socket.join(`status:${userId}`);
                };
            });
        });

        // Join conversation
        socket.on(SOCKET_EVENTS.JOIN_CONVERSATION, async (conversationId) => {

            try {

                const isValidMember = await validateConversationMember(conversationId, userId);
                if (!isValidMember) {
                    return;
                };

                socket.join(conversationId.toString());

            } catch (err) {

                log(`Conversation join validation error: ${err.message}`, "Socket");

            };
        });

        // Start typing 
        socket.on(SOCKET_EVENTS.TYPING_START, (conversationId) => {

            if (!convertToObjectId(conversationId)) {
                return;
            };

            if (!socket.rooms.has(conversationId.toString())) {
                return;
            };

            socket.to(conversationId.toString()).emit(SOCKET_EVENTS.TYPING_START, { userId });
        });

        // Stop typing 
        socket.on(SOCKET_EVENTS.TYPING_STOP, (conversationId) => {

            if (!convertToObjectId(conversationId)) {
                return;
            };

            if (!socket.rooms.has(conversationId.toString())) {
                return;
            };

            socket.to(conversationId.toString()).emit(SOCKET_EVENTS.TYPING_STOP, { userId });
        });

        // Disconnect
        socket.on(SOCKET_EVENTS.DISCONNECT, () => {

            log(`User ${userId} disconnected`, "Socket");

            const connectionCount = onlineUsers.get(userId);
            if (connectionCount === 1) {

                socket.to(`status:${userId}`).emit(SOCKET_EVENTS.USER_OFFLINE, { userId });
                onlineUsers.delete(userId);
            }
            else {

                onlineUsers.set(userId, connectionCount - 1);
            };
        });
    });

    return io;
};

export const getIO = () => {

    if (!io) {
        throw new Error("Socket is not initialized");
    };

    return io;
}; 