import { useInfiniteQuery } from "@tanstack/react-query";
import { notificationKeys } from "../api/queryKeys";
import { fetchNotifications } from "../api/notificationApi";

export const useFetchNotifications = (limit: number = 10) => {
    return useInfiniteQuery({
        queryKey: notificationKeys.fetchNotifications(limit),
        queryFn: ({ pageParam }) => fetchNotifications({ page: pageParam, limit }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {

            if (!lastPage.pagination?.hasNextPage) {
                return undefined;
            };

            return lastPage.pagination?.page + 1;
        },
        select: (data) => data.pages.flatMap((page) => page.notifications)
    });
};