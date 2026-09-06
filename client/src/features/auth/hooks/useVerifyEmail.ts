import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { verifyEmail } from '../api/authApi';
import { authKeys } from '../api/authKeys';
import { useAuthStore } from '@/store';
import { removeSessionItem } from '@/utils';
import { AUTH_SESSION_KEYS } from '../sessionKeys';
import { ROUTES } from '@/app/routes';

export const useVerifyEmail = () => {

    const queryClient = useQueryClient();
    const setAuth = useAuthStore((state) => state.setAuth);
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const redirectPath = searchParams.get('redirect');

    return useMutation({
        mutationFn: verifyEmail,
        onSuccess: (data) => {
            setAuth(data);
            removeSessionItem(AUTH_SESSION_KEYS.pendingVerificationEmail);
            navigate(redirectPath || ROUTES.home, { replace: true });
            queryClient.invalidateQueries({ queryKey: authKeys.all });
        }
    });
};