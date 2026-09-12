import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateUsername } from "../api/profileApi"
import { profileKeys } from "../api/profileKeys";

export const useUpdateUsername = (username: string) => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateUsername,
        meta: { skip401ErrorToast: true },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: profileKeys.detail(username) });
        }
    });
};