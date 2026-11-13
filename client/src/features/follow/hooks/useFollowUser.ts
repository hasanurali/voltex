import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followUser } from "../api/followApi";
import { userKeys } from "@/features/user/api/userKeys";
import { profileKeys } from "@/features/profile/api/profileKeys";
import { followKeys } from "../api/followKeys";
import { patchFollow, rollbackFollow } from "../utils/patchFollow";

export const useFollowUser = (currentUsername: string) => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: followUser,
        onMutate: (username) => {
            return patchFollow(queryClient, currentUsername, username, true);
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