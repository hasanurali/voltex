import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loginUser } from '../api/authApi';
import { authKeys } from '../api/authKeys';
import { useAuthStore } from '@/store';
import { ROUTES } from '@/app/routes';
import { removeSessionItem } from '@/utils';
import { AUTH_SESSION_KEYS } from '../sessionKeys';

export const useLoginUser = () => {

    const queryClient = useQueryClient();
    const setAuth = useAuthStore((state) => state.setAuth);
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const redirectPath = searchParams.get('redirect');

    return useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            setAuth(data);
            removeSessionItem(AUTH_SESSION_KEYS.loginDraftEmail);
            navigate(redirectPath || ROUTES.home, { replace: true });
            queryClient.invalidateQueries({ queryKey: authKeys.all });
        }
    });
};