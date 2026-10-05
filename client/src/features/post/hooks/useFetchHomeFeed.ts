import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchHomeFeed } from "../api/postApi";
import { postKeys } from "../api/postKeys";

export const useFetchHomeFeed = () => {
    return useInfiniteQuery({
        queryKey: postKeys.homeFeed(),
        queryFn: ({ pageParam }) => fetchHomeFeed(pageParam),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) => {
            return lastPage.nextCursor ?? undefined;
        },
        select: (data) => data.pages.flatMap((page) => page.posts),
    });
};