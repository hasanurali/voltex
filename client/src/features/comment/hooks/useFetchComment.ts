import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchComment } from "../api/commentApi";
import { commentKeys } from "../api/commentKeys";

export const useFetchComment = (postId: string, limit: number = 10) => {
    return useInfiniteQuery({
        queryKey: commentKeys.comments(postId, limit),
        queryFn: ({ pageParam }) => fetchComment({ postId, page: pageParam, limit }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {

            if (!lastPage.pagination?.hasNextPage) {
                return undefined;
            };

            return lastPage.pagination?.page + 1;
        },
        enabled: !!postId,
        select: (data) => data.pages.flatMap((page) => page.comments)
    });
};