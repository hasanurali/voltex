import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logoutUser } from '../api/authApi';
import { authKeys } from "../api/authKeys";
import { useAuthStore } from '@/store';

export const useLogoutUser = () => {

    const queryClient = useQueryClient();
    const clearAuth = useAuthStore((state) => state.clearAuth);

    return useMutation({
        mutationFn: logoutUser,
        meta: { skipGlobalErrorToast: true },
        onSuccess: () => {
            clearAuth();
            queryClient.invalidateQueries({ queryKey: authKeys.all });
        }
    });
};