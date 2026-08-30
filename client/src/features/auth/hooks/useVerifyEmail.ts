import { useMutation, useQueryClient } from '@tanstack/react-query';
import { verifyEmail } from '../api/authApi';
import { authKeys } from '../api/authKeys';
import { useAuthStore } from '@/store';

export const useVerifyEmail = () => {

    const queryClient = useQueryClient();
    const setAuth = useAuthStore((state) => state.setAuth);


    return useMutation({
        mutationFn: verifyEmail,
        onSuccess: (data) => {
            setAuth(data);
            queryClient.invalidateQueries({ queryKey: authKeys.all });
        }
    });
};