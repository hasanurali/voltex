import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logoutUser } from '../api/authApi';
import { authKeys } from "../api/authKeys";

export const useLogoutUser = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: authKeys.all })
        }
    });
};