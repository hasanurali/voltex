import type { QueryClient } from "@tanstack/react-query";
import { postKeys, type Post, type PostCacheValue } from "@/features/post";
import { commentKeys, type CommentsCacheData } from "@/features/comment";
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

        queryClient.setQueriesData<PostCacheValue>({ queryKey: postKeys.all }, (oldData) => {

            if (!oldData) {
                return oldData;
            };

            if ('pages' in oldData) {
                return {
                    ...oldData,
                    pages: oldData.pages.map((page) => page.posts ?
                        { ...page, posts: page.posts.map(patch) }
                        :
                        page
                    )
                };
            };

            return '_id' in oldData ? patch<Post>(oldData) : oldData;
        });

        return;
    };

    queryClient.setQueriesData<CommentsCacheData>({ queryKey: commentKeys.all }, (oldData) => {

        if (!oldData?.pages) {
            return oldData;
        };

        return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
                ...page,
                ...(page.comments && { comments: page.comments.map(patch) }),
                ...(page.commentReplies && { commentReplies: page.commentReplies.map(patch) })
            }))
        };
    });
};