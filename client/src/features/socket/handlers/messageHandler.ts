import type { QueryClient } from '@tanstack/react-query';
import type { Message } from '@/features/message/type';
import { messageKeys } from '@/features/message/api/messageKeys';
import { conversationKeys } from '@/features/conversation';
import { useAuthStore, useChatStore } from '@/store';
import { markAllConversationMessagesAsRead } from '@/features/conversation/api/conversationApi';

export const handleMessageReceive = (queryClient: QueryClient, message: Message) => {

    const conversationId = message.conversation;

    const isCurrentUser = message.sender._id === useAuthStore.getState().auth?.user._id;
    const isOpen = useChatStore.getState().activeConversationId === conversationId;

    if(!isCurrentUser){
        queryClient.invalidateQueries({ queryKey: messageKeys.conversationMessages(conversationId) });
    };
    
    queryClient.invalidateQueries({ queryKey: conversationKeys.conversations() });

    if (!isCurrentUser && isOpen) {
        markAllConversationMessagesAsRead(conversationId);
    };
}; 