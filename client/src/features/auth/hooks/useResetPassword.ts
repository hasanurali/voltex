import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { resetPassword } from '../api/authApi';
import { ROUTES } from '@/app/routes';

export const useResetPassword = () => {

    const navigate = useNavigate();

    return useMutation({
        mutationFn: resetPassword,
        onSuccess: (message) => {
            navigate(ROUTES.login, { replace: true });
            toast.success(message);
        }
    });
};