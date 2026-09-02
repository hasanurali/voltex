import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/authApi';
import { authKeys } from '../api/authKeys';
import { useAuthStore } from '@/store';
import { ROUTES } from '@/app/routes';

export const useLoginUser = () => {

    const queryClient = useQueryClient();
    const setAuth = useAuthStore((state) => state.setAuth);
    const navigate = useNavigate();

    return useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            setAuth(data);
            navigate(ROUTES.home, { replace: true });
            queryClient.invalidateQueries({ queryKey: authKeys.all });
        }
    });
};