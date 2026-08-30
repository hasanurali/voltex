import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginUser } from '../api/authApi';
import { authKeys } from '../api/authKeys';
import { useAuthStore } from '@/store';

export const useLoginUser = () => {

    const queryClient = useQueryClient();
    const setAuth = useAuthStore((state) => state.setAuth);

    return useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            setAuth(data);
            queryClient.invalidateQueries({ queryKey: authKeys.all });
        }
    });
};