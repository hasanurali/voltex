import type { ReactionPayload } from "@/features/reaction";
import { useCreateReaction } from "@/features/reaction";
import { useRemoveReaction } from "@/features/reaction";

const useReactionToggle = ({ targetType, targetId }: ReactionPayload) => {

    const { mutate: createReactionMutate } = useCreateReaction({ targetType, targetId });
    const { mutate: removeReactionMutate } = useRemoveReaction({ targetType, targetId });

    return {
        createReactionMutate,
        removeReactionMutate
    };
};

export default useReactionToggle;