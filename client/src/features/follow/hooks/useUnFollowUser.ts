import { useMutation } from "@tanstack/react-query";
import { unFollowUser } from "../api/followApi";

export const useUnFollowUser = () => {
    return useMutation({
        mutationFn: unFollowUser
    });
};