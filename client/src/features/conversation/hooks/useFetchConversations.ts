import { useInfiniteQuery } from "@tanstack/react-query";
import { conversationKeys } from "../api/conversationKeys";
import { fetchConversations } from "../api/conversationApi";

export const useFetchConversations = (limit: number = 10) => {
    return useInfiniteQuery({
        queryKey: conversationKeys.conversations(limit),
        queryFn: ({ pageParam }) => fetchConversations({ page: pageParam, limit }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {

            if (!lastPage.pagination?.hasNextPage) {
                return undefined;
            };

            return lastPage.pagination?.page + 1;
        },
        select: (data) => data.pages.flatMap((page) => page.conversations)
    });
};