import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { deleteComment } from "../api/commentApi";
import { commentKeys } from "../api/commentKeys";
import { postKeys, type Post, type PostCacheValue } from "@/features/post";
import type { Comment, CommentsCacheData, FetchCommentRepliesResponse, FetchCommentResponse } from "../type";


interface CommentPages {
    pages: FetchCommentResponse['data'][];
    pageParams: unknown[];
};

interface ReplyPages {
    pages: FetchCommentRepliesResponse['data'][];
    pageParams: unknown[];
};


export const useDeleteComment = (postId: string, commentReplyCount: number, parentCommentId?: string) => {

    const queryClient = useQueryClient();

    const dataKey = parentCommentId ?
        commentKeys.commentReplies(parentCommentId)
        :
        commentKeys.comments(postId);

    return useMutation({
        mutationFn: deleteComment,
        onMutate: async (commentId: string) => {

            await queryClient.cancelQueries({ queryKey: commentKeys.all });
            await queryClient.cancelQueries({ queryKey: postKeys.all });

            const previousComments = queryClient.getQueriesData({ queryKey: commentKeys.all });
            const previousPosts = queryClient.getQueriesData({ queryKey: postKeys.all });

            if (parentCommentId) {

                queryClient.setQueryData<ReplyPages>(dataKey, (oldData) => {

                    if (!oldData) {
                        return oldData;
                    };

                    return {
                        ...oldData,
                        pages: oldData.pages.map((page) => ({
                            ...page,
                            commentReplies: page.commentReplies.filter((comment) => comment._id !== commentId)
                        })),
                    };
                });

                queryClient.setQueriesData<CommentsCacheData>({ queryKey: commentKeys.all }, (oldData) => {

                    if (!oldData) {
                        return oldData;
                    };

                    const decrementCommentCount = (comment: Comment) =>
                        comment._id === parentCommentId ? { ...comment, repliesCount: Math.max(0, comment.repliesCount - commentReplyCount) } : comment;

                    return {
                        ...oldData,
                        pages: oldData.pages.map((page) => ({
                            ...page,
                            ...(page.comments && { comments: page.comments.map(decrementCommentCount) }),
                            ...(page.commentReplies && { commentReplies: page.commentReplies.map(decrementCommentCount) })
                        })),
                    };
                });
            } else {

                queryClient.setQueryData<CommentPages>(dataKey, (oldData) => {

                    if (!oldData) {
                        return oldData;
                    };

                    return {
                        ...oldData,
                        pages: oldData.pages.map((page) => ({
                            ...page,
                            comments: page.comments.filter((comment) => comment._id !== commentId)
                        })),
                    };
                });
            };

            queryClient.setQueriesData<PostCacheValue>({ queryKey: postKeys.all }, (oldData) => {

                if (!oldData) {
                    return oldData;
                };

                const decrementPostCount = (post: Post) =>
                    post._id === postId ? { ...post, commentsCount: Math.max(0, post.commentsCount - (commentReplyCount + 1)) } : post;

                if ('pages' in oldData) {
                    return {
                        ...oldData,
                        pages: oldData.pages.map((page) =>
                            page.posts ? { ...page, posts: page.posts.map(decrementPostCount) } : page
                        ),
                    };
                };

                return '_id' in oldData ? decrementPostCount(oldData) : oldData;
            });

            return {
                previousComments,
                previousPosts
            };
        },
        onError: (_err, _commentId, context) => {

            const restore = (previousdata?: [QueryKey, unknown][]) => {
                previousdata?.forEach(([key, data]) => queryClient.setQueryData(key, data));
            };

            restore(context?.previousComments);
            restore(context?.previousPosts);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: commentKeys.all });
            queryClient.invalidateQueries({ queryKey: postKeys.all });
        },
    });
};