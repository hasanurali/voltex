import { useMutation } from "@tanstack/react-query";
import { checkUserStatuses } from "../api/userApi";

export const useCheckUserStatuses = () => {
    return useMutation({
        mutationFn: checkUserStatuses
    });
};