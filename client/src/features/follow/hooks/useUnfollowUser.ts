import { useMutation } from "@tanstack/react-query";
import { unfollowUser } from "../api/followApi";

export const useUnfollowUser = () => {
    return useMutation({
        mutationFn: unfollowUser
    });
};