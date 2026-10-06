import { useMutation } from "@tanstack/react-query";
import { deleteComment } from "../api/commentApi";

export const useDeleteComment = () => {
    return useMutation({
        mutationFn: deleteComment
    });
};