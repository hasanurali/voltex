import { useFollowUser, useUnfollowUser } from "@/features/follow";

const useFollowToggle = (currentUsername: string, username: string) => {

    const { mutate: followUserMutate } = useFollowUser(currentUsername);
    const { mutate: unfollowUserMutate } = useUnfollowUser(currentUsername);

    const handleFollowUser = () => followUserMutate(username);
    const handleUnFollowUser = () => unfollowUserMutate(username);

    return {
        handleFollowUser,
        handleUnFollowUser
    };
};

export default useFollowToggle;