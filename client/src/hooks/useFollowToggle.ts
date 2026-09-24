import { useState } from "react";
import { useFollowUser, useUnfollowUser } from "@/features/follow";

const useFollowToggle = (currentUsername: string, usernameToFollow: string) => {

    const [isFollowing, setIsFollowing] = useState<boolean | null>(null);

        const { mutate: followUserMutate, isPending: isFollowUserPending } = useFollowUser(currentUsername);
        const { mutate: unfollowUserMutate, isPending: isUnfollowUserPending } = useUnfollowUser(currentUsername);

        const handleFollowUser = () => {

            if (isFollowing || isFollowUserPending || isUnfollowUserPending) {
                return;
            };

            followUserMutate(usernameToFollow, {
                onError: () => {
                    setIsFollowing(false);
                    return;
                }
            });
            setIsFollowing(true);
        };

        const handleUnFollowUser = () => {

            if (!isFollowing || isFollowUserPending || isUnfollowUserPending) {
                return;
            };

            unfollowUserMutate(usernameToFollow, {
                onError: () => {
                    setIsFollowing(true);
                    return;
                }
            });
            setIsFollowing(false);
        };

        return {
            isFollowing,
            setIsFollowing,
            handleFollowUser,
            handleUnFollowUser
        };
};

export default useFollowToggle;