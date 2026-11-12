import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unfollowUser } from "../api/followApi";
import { profileKeys } from "@/features/profile/api/profileKeys";
import { userKeys } from "@/features/user/api/userKeys";
import { followKeys } from "../api/followKeys";
import { patchFollow, rollbackFollow } from "../utils/patchFollow";

export const useUnfollowUser = (currentUsername: string) => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: unfollowUser,
        onMutate: (username) => {
            return patchFollow(queryClient, currentUsername, username, false);
        },
        onError: (_error, _username, context) => {
            rollbackFollow(queryClient, context);
        },
        onSuccess: (_data, username) => {
            queryClient.invalidateQueries({ queryKey: profileKeys.detail(username) });
            queryClient.invalidateQueries({ queryKey: profileKeys.detail(currentUsername) });
            queryClient.invalidateQueries({ queryKey: userKeys.all });
            queryClient.invalidateQueries({ queryKey: followKeys.all });
        }
    });
};