import { useMutation, useQueryClient } from "@tanstack/react-query"
import { unblockUser } from "../api/blockApi"
import { blockKeys } from "../api/blockKeys";
import type { Author } from "@/features/post";
import { profileKeys, type ProfileResponse } from "@/features/profile";

export const useUnblockUser = () => {

    const queryClient = useQueryClient();
    const fetchBlockedUsersKey = blockKeys.fetchBlockedUsers();

    return useMutation({
        mutationFn: unblockUser,
        onMutate: async (username: string) => {

            const profileDetailsKey = profileKeys.detail(username);

            await queryClient.cancelQueries({ queryKey: fetchBlockedUsersKey });
            await queryClient.cancelQueries({ queryKey: profileDetailsKey });

            const previousBlockedUsers = queryClient.getQueriesData({ queryKey: fetchBlockedUsersKey });
            const previousUserProfile = queryClient.getQueriesData({ queryKey: profileDetailsKey });

            queryClient.setQueryData(fetchBlockedUsersKey, (oldData: Author[] | undefined) => {

                if (!oldData) {
                    return oldData;
                };

                return oldData.filter(blockedUser => blockedUser.username !== username);
            });

            queryClient.setQueryData(profileDetailsKey, (oldData: ProfileResponse['data'] | undefined) => {

                if (!oldData) {
                    return oldData;
                };

                return {
                    ...oldData,
                    isBlocked: false
                };
            });

            return {
                previousBlockedUsers,
                previousUserProfile,
            };
        },
        onError: (_err, username, context) => {
            queryClient.setQueryData(fetchBlockedUsersKey, context?.previousBlockedUsers);
            queryClient.setQueryData(profileKeys.detail(username), context?.previousUserProfile);
        }
    });
};