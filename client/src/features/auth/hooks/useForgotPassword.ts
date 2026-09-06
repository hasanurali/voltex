import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { forgotPassword } from '../api/authApi';

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: forgotPassword,
        onSuccess: (message) => {
            toast.success(message);
        }
    });
};