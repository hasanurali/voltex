import { useMutation } from "@tanstack/react-query"
import { updateAvatar } from "../api/profileApi"

export const useUpdateAvatar = () => {
    return useMutation({
        mutationFn: updateAvatar
    });
};