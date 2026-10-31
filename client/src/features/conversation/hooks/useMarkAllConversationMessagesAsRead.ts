import { useMutation } from "@tanstack/react-query";
import { markAllConversationMessagesAsRead } from "../api/conversationApi";

export const useMarkAllConversationMessagesAsRead = () => {
    return useMutation({
        mutationFn: markAllConversationMessagesAsRead
    });
};