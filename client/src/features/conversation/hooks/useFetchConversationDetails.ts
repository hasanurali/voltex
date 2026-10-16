import { useQuery } from "@tanstack/react-query";
import { conversationKeys } from "../api/conversationKeys";
import { fetchConversationDetails } from "../api/conversationApi";

export const useFetchConversationDetails = (conversationId: string) => {
    return useQuery({
        queryKey: conversationKeys.conversationDetails(conversationId),
        queryFn: () => fetchConversationDetails(conversationId),
        enabled: !!conversationId
    });
};