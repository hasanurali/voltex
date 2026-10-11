import { useMutation } from "@tanstack/react-query"
import { removeReaction } from "../api/reactionApi"

export const useRemoveReaction = () => {
    return useMutation({
        mutationFn: removeReaction
    });
};