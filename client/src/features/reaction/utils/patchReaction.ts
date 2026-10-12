import type { QueryClient } from "@tanstack/react-query";
import { postKeys } from "@/features/post";
import { commentKeys } from "@/features/comment/api/commentKeys";
import type { CreateReactionPayload } from "../type";


interface Reactable {
    _id: string;
    hasReacted: boolean;
    likesCount: number;
};


export const patchReaction = (queryClient: QueryClient, targetType: CreateReactionPayload['targetType'], targetId: string, hasReacted: boolean) => {

    const reactionCount = hasReacted ? 1 : -1;

    const patch = <T extends Reactable>(item: T): T => item._id === targetId ?
        {
            ...item,
            hasReacted,
            likesCount: Math.max(0, item.likesCount + reactionCount)
        }
        :
        item;

    if (targetType === 'post') {

        queryClient.setQueriesData({ queryKey: postKeys.all }, (oldData: any) => {

            if (!oldData) {
                return oldData;
            };

            if (oldData.pages) {
                return {
                    ...oldData,
                    pages: oldData.pages.map((page: any) => page.posts ?
                        { ...page, posts: page.posts.map(patch) }
                        :
                        page
                    )
                };
            };

            return oldData._id ? patch(oldData) : oldData;
        });

        return;
    };

    queryClient.setQueriesData({ queryKey: commentKeys.all }, (oldData: any) => {

        if (!oldData?.pages) {
            return oldData;
        };

        return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
                ...page,
                ...(page.comments && { comments: page.comments.map(patch) }),
                ...(page.commentReplies && { commentReplies: page.commentReplies.map(patch) })
            }))
        };
    });
};