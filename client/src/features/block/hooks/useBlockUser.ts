import { useMutation } from "@tanstack/react-query"
import { blockUser } from "../api/blockApi"

export const useBlockUser = () => {
    return useMutation({
        mutationFn: blockUser
    });
};