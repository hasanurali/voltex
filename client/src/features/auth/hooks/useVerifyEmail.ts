import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { verifyEmail } from '../api/authApi';
import { authKeys } from '../api/authKeys';
import { useAuthStore } from '@/store';
import { removeSessionItem } from '@/utils';
import { AUTH_SESSION_KEYS } from '../sessionKeys';

export const useVerifyEmail = () => {

    const queryClient = useQueryClient();
    const setAuth = useAuthStore((state) => state.setAuth);
    const navigate = useNavigate();

    return useMutation({
        mutationFn: verifyEmail,
        onSuccess: (data) => {
            setAuth(data);
            navigate('/', { replace: true });
            removeSessionItem(AUTH_SESSION_KEYS.pendingVerificationEmail);
            queryClient.invalidateQueries({ queryKey: authKeys.all });
        }
    });
};