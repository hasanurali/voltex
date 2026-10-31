import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchConversationMessages } from "../api/messageApi";
import { messageKeys } from "../api/messageKeys";

export const useFetchConversationMessages = (conversationId: string, limit: number = 10) => {
    return useInfiniteQuery({
        queryKey: messageKeys.conversationMessages(conversationId, limit),
        queryFn: ({ pageParam }) => fetchConversationMessages({ conversationId, page: pageParam, limit }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {

            if (!lastPage.pagination?.hasNextPage) {
                return undefined;
            };

            return lastPage.pagination?.page + 1;
        },
        enabled: !!conversationId,
        select: (data) => ({
            data: data.pages.slice().reverse().flatMap((page) => page.messages),
            cursorLength: data.pageParams.length
        })
    });
};