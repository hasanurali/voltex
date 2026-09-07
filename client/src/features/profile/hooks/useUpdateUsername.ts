import { useMutation } from "@tanstack/react-query"
import { updateUsername } from "../api/profileApi"

export const useUpdateUsername = () => {
    return useMutation({
        mutationFn: updateUsername
    });
};