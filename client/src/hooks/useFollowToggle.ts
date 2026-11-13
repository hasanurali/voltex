import { useFollowUser, useUnfollowUser } from "@/features/follow";
import { useCallback } from "react";

const useFollowToggle = (currentUsername: string, username: string) => {

    const { mutate: followUserMutate } = useFollowUser(currentUsername);
    const { mutate: unfollowUserMutate } = useUnfollowUser(currentUsername);

    const handleFollowUser = useCallback(() => followUserMutate(username), [username, followUserMutate]);
    const handleUnFollowUser = useCallback(() => unfollowUserMutate(username), [username, unfollowUserMutate]);

    return {
        handleFollowUser,
        handleUnFollowUser
    };
};

export default useFollowToggle;