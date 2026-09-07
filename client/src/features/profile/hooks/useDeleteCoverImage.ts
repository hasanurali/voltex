import { useMutation } from "@tanstack/react-query"
import { deleteCoverImage } from "../api/profileApi"

export const useDeleteCoverImage = () => {
    return useMutation({
        mutationFn: deleteCoverImage
    });
};