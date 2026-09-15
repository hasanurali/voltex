import { useInfiniteQuery } from '@tanstack/react-query';
import { userKeys } from "../api/userKeys";
import { searchUser } from "../api/userApi";

export const useSearchUser = (search: string, limit: number = 10) => {
    return useInfiniteQuery({
        queryKey: userKeys.searchUser(search, limit),
        queryFn: ({ pageParam }) => searchUser({ search, page: pageParam, limit }),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {

            if (!lastPage.data?.pagination?.hasNextPage) {
                return undefined;
            };

            return allPages.length + 1;
        },
        enabled: search.trim().length > 0
    });
};