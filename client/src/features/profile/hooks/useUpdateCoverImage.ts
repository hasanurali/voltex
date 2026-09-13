import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateCoverImage } from "../api/profileApi"
import { profileKeys } from "../api/profileKeys";
import type { AuthUser } from "@/features/auth";

export const useUpdateCoverImage = (username: string) => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateCoverImage,
        meta: { skip401ErrorToast: true },
        onSuccess: (updatedProfile) => {
            queryClient.setQueryData(profileKeys.detail(username), (oldData: AuthUser | undefined) => {

                if (!oldData) {
                    return oldData;
                };

                return { ...oldData, profile: updatedProfile };
            });
        }
    });
};