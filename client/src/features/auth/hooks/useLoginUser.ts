import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginUser } from '../api/authApi';
import { authKeys } from '../api/authKeys';

export const useLoginUser = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: loginUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: authKeys.all })
        }
    });
};