import { useMutation, useQueryClient } from "@tanstack/react-query"
import { settingKeys } from "../api/settingKeys"
import { updateUserSetting } from "../api/settingApi"

export const useUpdateUserSetting = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateUserSetting,
        onSuccess: (setting) => {
            queryClient.setQueryData(settingKeys.userSetting(), setting);
        }
    });
};