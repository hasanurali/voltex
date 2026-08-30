import { useMutation, useQueryClient } from '@tanstack/react-query';
import { verifyEmail } from '../api/authApi';
import { authKeys } from '../api/authKeys';

export const useVerifyEmail = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: verifyEmail,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: authKeys.all })
        }
    });
};