import { useQuery } from '@tanstack/react-query';
import { checkUsername } from '../api/profileApi';
import { profileKeys } from '../api/profileKeys';

export const useCheckUsername = (username: string) => {
    return useQuery({
        queryKey: profileKeys.checkUsername(username),
        queryFn: () => checkUsername(username),
        enabled: username.length >= 3,
        retry: false
    });
};