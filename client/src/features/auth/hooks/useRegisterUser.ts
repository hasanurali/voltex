import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/authApi';
import { authKeys } from '../api/authKeys';
import { ROUTES } from '@/app/routes';
import { removeSessionItem, setSessionItem } from '@/utils';
import { AUTH_SESSION_KEYS } from '../sessionKeys';

export const useRegisterUser = () => {

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => {
            setSessionItem(AUTH_SESSION_KEYS.pendingVerificationEmail, data.user.email);
            removeSessionItem(AUTH_SESSION_KEYS.registerDraftValues);
            navigate(ROUTES.verifyEmail, { replace: true });
            queryClient.invalidateQueries({ queryKey: authKeys.all });
        }
    });
};