import { useQuery } from "@tanstack/react-query"
import { fetchUserProfile } from "../api/profileApi"
import { profileKeys } from "../api/profileKeys";

export const useUserProfile = (username: string) => {

    return useQuery({
        queryKey: profileKeys.detail(username),
        queryFn: () => fetchUserProfile(username),
        enabled: !!username,
    });
};