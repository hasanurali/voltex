import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchUserFollowings } from "../api/followApi";
import { followKeys } from "../api/followKeys";

export const useFetchUserFollowings = (username: string, limit: number = 10) => {
    return useInfiniteQuery({
        queryKey: followKeys.userFollowings(username, limit),
        queryFn: ({ pageParam }) => fetchUserFollowings({ username, page: pageParam, limit }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {

            if (!lastPage.pagination?.hasNextPage) {
                return undefined;
            };

            return lastPage.pagination?.page + 1;
        },
        enabled: !!username,
        select: (data) => data.pages.flatMap((page) => page.followings)
    });
};