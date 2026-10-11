import { useMutation } from "@tanstack/react-query"
import { createReaction } from "../api/reactionApi"

export const useCreateReaction = ()=>{
    return useMutation({
        mutationFn: createReaction
    });
};