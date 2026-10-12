import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createReaction } from "../api/reactionApi"
import type { CreateReactionPayload } from "../type";
import { postKeys } from "@/features/post";
import { commentKeys } from "@/features/comment/api/commentKeys";
import { patchReaction } from "../utils/patchReaction";

export const useCreateReaction = ({ targetType, targetId }: CreateReactionPayload) => {

    const queryClient = useQueryClient();

    const cacheKey = targetType === 'post' ?
        postKeys.all
        :
        commentKeys.all;

    return useMutation({
        mutationFn: () => createReaction({ targetType, targetId }),
        onMutate: async () => {

            await queryClient.cancelQueries({ queryKey: cacheKey });

            const previousData = queryClient.getQueriesData({ queryKey: cacheKey });

            patchReaction(queryClient, targetType, targetId, true);

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