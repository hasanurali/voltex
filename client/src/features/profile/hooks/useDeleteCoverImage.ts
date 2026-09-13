import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteCoverImage } from "../api/profileApi"
import { profileKeys } from "../api/profileKeys";

export const useDeleteCoverImage = (username: string) => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteCoverImage,
         meta: { skip401ErrorToast: true },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: profileKeys.detail(username) });
        }
    });
};