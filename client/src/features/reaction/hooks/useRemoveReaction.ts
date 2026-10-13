import { useMutation, useQueryClient } from "@tanstack/react-query"
import { removeReaction } from "../api/reactionApi"
import type { RemoveReactionPayload } from "../type";
import { patchReaction } from "../utils/patchReaction";
import { postKeys } from "@/features/post";
import { commentKeys } from "@/features/comment/api/commentKeys";

export const useRemoveReaction = ({ targetType, targetId }: RemoveReactionPayload) => {

    const queryClient = useQueryClient();

    const cacheKey = targetType === 'post' ?
        postKeys.all
        :
        commentKeys.all;

    return useMutation({
        mutationFn: () => removeReaction({ targetType, targetId }),
        onMutate: async () => {

            await queryClient.cancelQueries({ queryKey: cacheKey });

            const previousData = queryClient.getQueriesData({ queryKey: cacheKey });

            patchReaction(queryClient, targetType, targetId, false);

            return {
                previousData
            };
        },
        onError: (_err, _vars, context) => {

            context?.previousData.forEach(([key, data]) => {
                queryClient.setQueryData(key, data);
            });
        },
    });
};