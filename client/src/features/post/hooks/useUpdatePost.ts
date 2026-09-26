import { useMutation } from "@tanstack/react-query";
import { updatePost } from "../api/postApi";

export const useUpdatePost = () => {
    return useMutation({
        mutationFn: updatePost
    });
};