import type { InfiniteData, QueryClient, QueryKey } from "@tanstack/react-query";
import { profileKeys } from "@/features/profile/api/profileKeys";
import type { ProfileResponse } from "@/features/profile/types";
import { userKeys } from "@/features/user/api/userKeys";
import type { SearchUserResponse } from "@/features/user/types";
import { followKeys } from "../api/followKeys";

type ProfileData = ProfileResponse["data"];
type SearchUserData = InfiniteData<SearchUserResponse["data"], number>;

interface FollowCacheContext {
    previousCurrentUserProfile: [QueryKey, ProfileData | undefined][];
    previousUserProfile: [QueryKey, ProfileData | undefined][];
    previousSearches: [QueryKey, SearchUserData | undefined][];
};

export const patchFollow = async (queryClient: QueryClient, currentUsername: string, username: string, isFollowing: boolean): Promise<FollowCacheContext> => {

    await Promise.all([
        queryClient.cancelQueries({ queryKey: profileKeys.detail(username) }),
        queryClient.cancelQueries({ queryKey: profileKeys.detail(currentUsername) }),
        queryClient.cancelQueries({ queryKey: userKeys.all }),
        queryClient.cancelQueries({ queryKey: followKeys.all })
    ]);

    const previousCurrentUserProfile = queryClient.getQueriesData<ProfileData>({ queryKey: profileKeys.detail(currentUsername) });
    const previousUserProfile = queryClient.getQueriesData<ProfileData>({ queryKey: profileKeys.detail(username) });
    const previousSearches = queryClient.getQueriesData<SearchUserData>({ queryKey: userKeys.all });

    const previousFollowing = previousUserProfile?.[1]?.[1]?.isFollowing ?? previousSearches
        .flatMap(([_, data]) => data?.pages.flatMap((page) => page.users) ?? [])
        .find((user) => user.username === username)?.isFollowing;

    const followerCountChange = previousFollowing !== isFollowing ?
        (isFollowing ? 1 : -1)
        :
        0;

    if (username !== currentUsername) {
        queryClient.setQueryData(profileKeys.detail(username), (oldData: ProfileData | undefined) => {

            if (!oldData) {
                return oldData;
            };

            return {
                ...oldData,
                isFollowing,
                user: {
                    ...oldData.user,
                    followersCount: Math.max(0, oldData.user.followersCount + followerCountChange),
                }
            };
        });

        queryClient.setQueryData(profileKeys.detail(currentUsername), (oldData: ProfileData | undefined) => {

            if (!oldData) {
                return oldData;
            };

            return {
                ...oldData,
                user: {
                    ...oldData.user,
                    followingCount: Math.max(0, oldData.user.followingCount + followerCountChange),
                }
            };
        });

        queryClient.setQueriesData({ queryKey: userKeys.all }, (oldData: SearchUserData | undefined) => {

            if (!oldData) {
                return oldData;
            };

            return {
                ...oldData,
                pages: oldData.pages.map((page) => ({
                    ...page,
                    users: page.users.map((user) => user.username === username ? { ...user, isFollowing } : user)
                }))
            };
        });
    };

    return {
        previousCurrentUserProfile,
        previousUserProfile,
        previousSearches
    };
};

export const rollbackFollow = (queryClient: QueryClient, context?: FollowCacheContext) => {
    context?.previousCurrentUserProfile.forEach(([key, data]) => queryClient.setQueryData(key, data));
    context?.previousUserProfile.forEach(([key, data]) => queryClient.setQueryData(key, data));
    context?.previousSearches.forEach(([key, data]) => queryClient.setQueryData(key, data));
};