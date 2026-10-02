import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../api/postApi";
import { postKeys } from "../api/postKeys";

export const useCreatePost = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createPost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: postKeys.homeFeed() });
        }
    });
};