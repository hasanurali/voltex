import { useMutation, useQueryClient } from '@tanstack/react-query';
import { registerUser } from '../api/authApi';
import { authKeys } from '../api/authKeys';

export const useRegisterUser = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: authKeys.all })
        }
    });
};