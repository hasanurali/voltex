import { useMutation } from '@tanstack/react-query';
import { refreshToken } from '../api/authApi';

export const useRefreshToken = () => {
    return useMutation({
        meta: { skipGlobalErrorToast: true },
        mutationFn: refreshToken
    });
};