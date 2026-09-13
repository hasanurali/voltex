import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteAvatar } from "../api/profileApi"
import { authKeys } from "@/features/auth";
import { profileKeys } from "../api/profileKeys";

export const useDeleteAvatar = (username: string) => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteAvatar,
        meta: { skip401ErrorToast: true },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: profileKeys.detail(username) });
            queryClient.invalidateQueries({ queryKey: authKeys.me() });
        }
    });
};