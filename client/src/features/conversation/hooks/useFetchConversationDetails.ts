import { useQuery } from "@tanstack/react-query";
import { conversationKeys } from "../api/conversationKeys";
import { fetchConversationDetails } from "../api/conversationApi";

export const useFetchConversationDetails = (id: string) => {
    return useQuery({
        queryKey: conversationKeys.conversationDetails(id),
        queryFn: () => fetchConversationDetails(id),
        enabled: !!id
    });
};