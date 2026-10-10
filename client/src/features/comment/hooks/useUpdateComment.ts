import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateComment } from "../api/commentApi";
import { commentKeys } from "../api/commentKeys";

export const useUpdateComment = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateComment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: commentKeys.all });
        }
    });
};