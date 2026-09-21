import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followUser } from "../api/followApi";
import { userKeys } from "@/features/user/api/userKeys";
import { profileKeys } from "@/features/profile/api/profileKeys";
import { followKeys } from "../api/followKeys";

export const useFollowUser = (currentUsername: string) => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: followUser,
        onSuccess: (_data, username) => {

            queryClient.invalidateQueries({ queryKey: profileKeys.detail(username) });
            queryClient.invalidateQueries({ queryKey: profileKeys.detail(currentUsername) });
            queryClient.invalidateQueries({ queryKey: userKeys.all });
            queryClient.invalidateQueries({ queryKey: followKeys.all });
        }
    });
};