import { useMutation, useQueryClient } from '@tanstack/react-query';
import { registerUser } from '../api/authApi';
import { authKeys } from '../api/authKeys';
import { useAuthStore } from '@/store';

export const useRegisterUser = () => {

    const queryClient = useQueryClient();
    const setAuth = useAuthStore((state) => state.setAuth);

    return useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => {
            setAuth(data);
            queryClient.invalidateQueries({ queryKey: authKeys.all });
        }
    });
};