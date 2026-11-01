import { useMutation } from "@tanstack/react-query"
import { unblockUser } from "../api/blockApi"

export const useUnblockUser = () => {
    return useMutation({
        mutationFn: unblockUser
    });
};