import { useMutation } from "@tanstack/react-query";
import { createPost } from "../api/postApi";

export const useCreatePost = () => {
    return useMutation({
        mutationFn: createPost
    });
};