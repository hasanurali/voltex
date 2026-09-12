import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../api/profileApi";
import { profileKeys } from "../api/profileKeys";

export const useUpdateProfile = (username: string) => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProfile,
        meta: { skipGlobalErrorToast: true },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: profileKeys.detail(username) });
        }
    });
};