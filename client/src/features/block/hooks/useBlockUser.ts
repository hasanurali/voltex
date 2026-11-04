import { useMutation, useQueryClient } from "@tanstack/react-query"
import { blockUser } from "../api/blockApi"
import { blockKeys } from "../api/blockKeys";
import type { Author } from "@/features/post";
import { profileKeys } from "@/features/profile";
import type { ProfileResponse } from "@/features/profile/types";

export const useBlockUser = (viewedUserInfo: Author | undefined) => {

    const queryClient = useQueryClient();
    const fetchBlockedUsersKey = blockKeys.fetchBlockedUsers();

    return useMutation({
        mutationFn: blockUser,
        onMutate: async (username: string) => {

            if (!viewedUserInfo) {
                return;
            };

            const profileDetailsKey = profileKeys.detail(username);

            await queryClient.cancelQueries({ queryKey: fetchBlockedUsersKey });
            await queryClient.cancelQueries({ queryKey: profileDetailsKey });

            const previousBlockedUsers = queryClient.getQueriesData({ queryKey: fetchBlockedUsersKey });
            const previousUserProfile = queryClient.getQueriesData({ queryKey: profileDetailsKey });

            queryClient.setQueryData(fetchBlockedUsersKey, (oldData: Author[] | undefined) => {

                if (!oldData) {
                    return oldData;
                };

                return [...oldData, viewedUserInfo];
            });

            queryClient.setQueryData(profileDetailsKey, (oldData: ProfileResponse['data'] | undefined) => {

                if (!oldData) {
                    return oldData;
                };

                return {
                    ...oldData,
                    isBlocked: true
                };
            });

            return {
                previousBlockedUsers,
                previousUserProfile
            };
        },
        onError: (_err, username, context) => {
            if (viewedUserInfo) {
                queryClient.setQueryData(fetchBlockedUsersKey, context?.previousBlockedUsers);
                queryClient.setQueryData(profileKeys.detail(username), context?.previousUserProfile);
            };
        }
    });
};