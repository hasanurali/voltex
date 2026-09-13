import { useQuery } from '@tanstack/react-query';
import { authKeys } from "../api/authKeys"
import { currentUser } from '../api/authApi';

export const useCurrentUser = () => {
    return useQuery({
        queryKey: authKeys.me(),
        queryFn: currentUser,
        retry: false
    });
};