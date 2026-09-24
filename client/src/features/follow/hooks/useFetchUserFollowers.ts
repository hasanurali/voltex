import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchUserFollowers } from "../api/followApi";
import { followKeys } from "../api/followKeys";

export const useFetchUserFollowers = (username: string, limit: number = 10) => {
    return useInfiniteQuery({
        queryKey: followKeys.userFollowers(username, limit),
        queryFn: ({ pageParam }) => fetchUserFollowers({ username, page: pageParam, limit }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {

            if (!lastPage.pagination?.hasNextPage) {
                return undefined;
            };

            return lastPage.pagination?.page + 1;
        },
        enabled: !!username,
        select: (data) => data.pages.flatMap((page) => page.followers)
    });
};