import { useMutation } from "@tanstack/react-query";
import { deletePost } from "../api/postApi";

export const useDeletePost = () => {
    return useMutation({
        mutationFn: deletePost
    });
};