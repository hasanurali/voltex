import { useMutation } from "@tanstack/react-query";
import { followUser } from "../api/followApi";

export const useFollowUser = () => {
    return useMutation({
        mutationFn: followUser
    });
};