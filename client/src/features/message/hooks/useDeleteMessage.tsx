import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMessage } from "../api/messageApi";
import { messageKeys } from "../api/messageKeys";
import type { FetchMessagesResponse } from "../type";


interface MessagePages {
    pages: FetchMessagesResponse['data'][];
    pageParams: unknown[];
};

export const useDeleteMessage = (conversationId: string, isTemporary: boolean) => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteMessage,
        onMutate: async (messageId: string) => {

            if (isTemporary) {
                return;
            };

            await queryClient.cancelQueries({ queryKey: messageKeys.conversationMessages(conversationId) });

            const previousConversationMessages = queryClient.getQueriesData({ queryKey: messageKeys.conversationMessages(conversationId) });

            queryClient.setQueryData(messageKeys.conversationMessages(conversationId), (oldData: MessagePages | undefined) => {

                if (!oldData) {
                    return oldData;
                };

                return {
                    ...oldData,
                    pages: oldData.pages.map((page) => ({
                        ...page,
                        messages: page.messages.filter((message) => message._id !== messageId)
                    }))
                };
            });

            return {
                previousConversationMessages
            };
        },
        onError: (_err, _messageId, context) => {
            if (!isTemporary) {
                context?.previousConversationMessages?.forEach(([key, data]) => queryClient.setQueryData(key, data));
            };
        }
    });
};