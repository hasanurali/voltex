import { useMutation } from "@tanstack/react-query";
import { updateComment } from "../api/commentApi";

export const useUpdateComment = () => {
    return useMutation({
        mutationFn: updateComment
    });
};