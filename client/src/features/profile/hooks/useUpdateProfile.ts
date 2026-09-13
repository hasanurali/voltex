import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../api/profileApi";
import { profileKeys } from "../api/profileKeys";
import { authKeys, type AuthUser } from "@/features/auth";

export const useUpdateProfile = (username: string) => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProfile,
        meta: { skip401ErrorToast: true },
        onSuccess: (data) => {
            queryClient.setQueryData(profileKeys.detail(username), (oldData: AuthUser | undefined) => {

                if (!oldData) {
                    return oldData;
                };

                return {
                    ...oldData,
                    user: data.updatedUser ?? oldData.user,
                    profile: data.updatedProfile ?? oldData.profile
                };
            });
            queryClient.setQueryData(authKeys.me(), (oldData: AuthUser | undefined) => {

                if (!oldData) {
                    return oldData;
                };

                return {
                    ...oldData,
                    user: data.updatedUser ?? oldData.user
                };
            });
        }
    });
};