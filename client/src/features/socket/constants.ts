export const SOCKET_EVENTS = {
    // server to client
    notificationReceive: 'notification:receive',
    messageReceive: 'chat:message-receive',
    userOnline: 'status:user-online',
    userOffline: 'status:user-offline',
    typingStart: 'status:typing-start',
    typingStop: 'status:typing-stop',

    // client to server
    subscribeUsers: 'status:subscribe-users',
    joinConversation: 'join:conversation',
} as const;