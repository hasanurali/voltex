import { useMutation } from '@tanstack/react-query';
import { forgotPassword } from '../api/authApi';

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: forgotPassword
    });
};