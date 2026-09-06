import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { resendOtp } from '../api/authApi';

export const useResendOtp = () => {
    return useMutation({
        mutationFn: resendOtp,
        onSuccess: (message) => {
            toast.success(message);
        }
    });
};