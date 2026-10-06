import { useMutation } from "@tanstack/react-query";
import { createComment } from "../api/commentApi";

export const useCreateComment = () => {
    return useMutation({
        mutationFn: createComment
    });
};