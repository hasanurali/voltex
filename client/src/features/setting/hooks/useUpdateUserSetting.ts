import { useMutation } from "@tanstack/react-query"
import { updateUserSetting } from "../api/settingApi"

export const useUpdateUserSetting = () => {
    return useMutation({
        mutationFn: updateUserSetting
    });
};