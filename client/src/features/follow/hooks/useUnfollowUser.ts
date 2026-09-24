import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unfollowUser } from "../api/followApi";
import { profileKeys } from "@/features/profile/api/profileKeys";
import { userKeys } from "@/features/user/api/userKeys";
import { followKeys } from "../api/followKeys";

export const useUnfollowUser = (currentUsername: string) => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: unfollowUser,
        onSuccess: (_data, username) => {

            queryClient.invalidateQueries({ queryKey: profileKeys.detail(username) });
            queryClient.invalidateQueries({ queryKey: profileKeys.detail(currentUsername) });
            queryClient.invalidateQueries({ queryKey: userKeys.all });
            queryClient.invalidateQueries({ queryKey: followKeys.all });
        }
    });
};