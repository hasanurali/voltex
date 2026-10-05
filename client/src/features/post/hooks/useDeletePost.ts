import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "../api/postApi";
import { postKeys } from "../api/postKeys";
import type { FetchHomeFeedResponse, FetchUserPostResponse } from "../types";

interface InfiniteFeedData {
    pages: FetchHomeFeedResponse['data'][];
    pageParams: unknown[];
};

interface UserPostData {
    pages: FetchUserPostResponse['data'][];
    pageParams: unknown[];
};

export const useDeletePost = (username: string) => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deletePost,
        onMutate: async (postId) => {

            await queryClient.cancelQueries({ queryKey: postKeys.homeFeed() });

            const previousFeed = queryClient.getQueryData(postKeys.homeFeed());
            const previousUserPosts = queryClient.getQueryData(postKeys.userPost(username));

            queryClient.setQueryData(postKeys.homeFeed(), (oldData: InfiniteFeedData | undefined) => {

                if (!oldData) {
                    return oldData;
                };

                return {
                    ...oldData,
                    pages: oldData.pages.map(page => ({
                        ...page,
                        posts: page.posts.filter((post) => post._id !== postId)
                    }))
                };
            });

            queryClient.setQueryData(postKeys.userPost(username), (oldData: UserPostData | undefined) => {

                if (!oldData) {
                    return oldData;
                };

                return {
                    ...oldData,
                    pages: oldData.pages.map(page => ({
                        ...page,
                        posts: page.posts.filter((post) => post._id !== postId)
                    }))
                };
            });

            return {
                previousFeed,
                previousUserPosts
            };
        },
        onError: (_err, _postId, context) => {

            if (context?.previousFeed) {
                queryClient.setQueryData(postKeys.homeFeed(), context.previousFeed);
            };

            if (context?.previousUserPosts) {
                queryClient.setQueryData(postKeys.homeFeed(), context.previousFeed);
            };
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: postKeys.homeFeed() });
            queryClient.invalidateQueries({ queryKey: postKeys.userPost(username) });
        },
    });
};