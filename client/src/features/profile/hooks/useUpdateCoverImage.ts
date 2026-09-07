import { useMutation } from "@tanstack/react-query"
import { updateCoverImage } from "../api/profileApi"

export const useUpdateCoverImage = () => {
    return useMutation({
        mutationFn: updateCoverImage
    });
};