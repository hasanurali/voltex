import { useMutation } from '@tanstack/react-query';
import { resetPassword } from '../api/authApi';

export const useResetPassword = () => {
    return useMutation({
        mutationFn: resetPassword
    });
};