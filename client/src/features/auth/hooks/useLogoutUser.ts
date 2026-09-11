import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../api/authApi';
import { authKeys } from "../api/authKeys";
import { useAuthStore } from '@/store';
import { ROUTES } from '@/app/routes';

export const useLogoutUser = () => {

    const queryClient = useQueryClient();
    const clearAuth = useAuthStore((state) => state.clearAuth);
    const navigate = useNavigate();

    return useMutation({
        mutationFn: logoutUser,
        meta: { skipGlobalErrorToast: true },
        onSuccess: () => {
            clearAuth();
            navigate(ROUTES.login, { replace: true });
            queryClient.invalidateQueries({ queryKey: authKeys.all });
        }
    });
};