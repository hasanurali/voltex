import { useQuery } from "@tanstack/react-query"
import { settingKeys } from "../api/settingKeys"
import { fetchUserSetting } from "../api/settingApi"

export const useFetchUserSetting = () => {
    return useQuery({
        queryKey: settingKeys.userSetting(),
        queryFn: fetchUserSetting
    });
};