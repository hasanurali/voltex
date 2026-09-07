import { useMutation } from "@tanstack/react-query"
import { deleteAvatar } from "../api/profileApi"

export const useDeleteAvatar = () => {
    return useMutation({
        mutationFn: deleteAvatar
    });
};