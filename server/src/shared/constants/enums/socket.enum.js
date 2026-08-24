const SOCKET_EVENTS = Object.freeze({
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',

    JOIN_CONVERSATION: "join:conversation",

    SUBSCRIBE_USER: "status:subscribe-users",

    USER_ONLINE: 'status:user-online',
    USER_OFFLINE: 'status:user-offline',
    TYPING_START: 'status:typing-start',
    TYPING_STOP: 'status:typing-stop',

    RECEIVE_CHAT_MESSAGE: 'chat:message-receive',
    RECEIVE_NOTIFICATION: 'notification:receive',
});

export default SOCKET_EVENTS;

