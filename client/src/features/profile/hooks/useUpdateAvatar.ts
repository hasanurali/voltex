import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateAvatar } from "../api/profileApi"
import { profileKeys } from "../api/profileKeys";
import { authKeys, type AuthUser } from "@/features/auth";

export const useUpdateAvatar = (username: string) => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateAvatar,
        meta: { skip401ErrorToast: true },
        onSuccess: (updatedProfile) => {
            queryClient.setQueryData(profileKeys.detail(username), (oldData: AuthUser | undefined) => {

                if (!oldData) {
                    return oldData;
                };

                return { ...oldData, profile: updatedProfile };
            });
            queryClient.setQueryData(authKeys.me(), (oldData: AuthUser | undefined) => {

                if (!oldData) {
                    return oldData;
                };

                return { ...oldData, profile: updatedProfile };
            });
        },
    });
};