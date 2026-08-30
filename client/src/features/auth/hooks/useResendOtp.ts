import { useMutation } from '@tanstack/react-query';
import { resendOtp } from '../api/authApi';

export const useResendOtp = () => {
    return useMutation({
        mutationFn: resendOtp
    });
};