import { useMutation } from "@tanstack/react-query"
import { updateProfile } from "../api/profileApi"

export const useUpdateProfile = () => {
    return useMutation({
        mutationFn: updateProfile
    });
};