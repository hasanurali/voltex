import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "../api/commentApi";
import { commentKeys } from "../api/commentKeys";
import { postKeys } from "@/features/post/api/postKeys";

export const useCreateComment = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createComment,
        onSuccess: (_comment, payload) => {

            queryClient.invalidateQueries({ queryKey: commentKeys.all });

            if (payload.post) {
                queryClient.invalidateQueries({ queryKey: postKeys.details(payload.post) });
            };
        }
    });
};