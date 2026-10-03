import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePost } from "../api/postApi";
import { postKeys } from "../api/postKeys";

export const useUpdatePost = () => {
    
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updatePost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: postKeys.all });
        }
    });
};