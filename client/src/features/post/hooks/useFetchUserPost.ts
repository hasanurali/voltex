import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchUserPost } from "../api/postApi";
import { postKeys } from "../api/postKeys";

export const useFetchUserPost = (username: string, limit: number = 10) => {
    return useInfiniteQuery({
        queryKey: postKeys.userPost(username, limit),
        queryFn: ({ pageParam }) => fetchUserPost({ username, page: pageParam, limit }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {

            if (!lastPage.pagination?.hasNextPage) {
                return undefined;
            };

            return lastPage.pagination?.page + 1;
        },
        enabled: !!username,
        select: (data) => data.pages.flatMap((page) => page.posts)
    });
};