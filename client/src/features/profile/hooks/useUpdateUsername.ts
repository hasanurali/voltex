import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom";
import { updateUsername } from "../api/profileApi"
import { authKeys, type AuthUser } from "@/features/auth";

export const useUpdateUsername = () => {

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: updateUsername,
        meta: { skip401ErrorToast: true },
        onSuccess: (updatedUser) => {
            queryClient.setQueryData(authKeys.me(), (oldData: AuthUser | undefined) => {

                if (!oldData) {
                    return oldData;
                };

                return { ...oldData, user: updatedUser };
            });
            navigate(`/profile/${updatedUser.username}`, { replace: true });
        }
    });
};