import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchCommentReplies } from "../api/commentApi";
import { commentKeys } from "../api/commentKeys";

export const useFetchCommentReplies = (commentId: string, limit: number = 10, enabled: boolean = true) => {
    return useInfiniteQuery({
        queryKey: commentKeys.commentReplies(commentId, limit),
        queryFn: ({ pageParam }) => fetchCommentReplies({ commentId, page: pageParam, limit }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {

            if (!lastPage.pagination?.hasNextPage) {
                return undefined;
            };

            return lastPage.pagination?.page + 1;
        },
        enabled: !!commentId && enabled,
        select: (data) => data.pages.flatMap((page) => page.commentReplies)
    });
};