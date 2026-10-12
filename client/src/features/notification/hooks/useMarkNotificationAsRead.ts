import { useMutation } from "@tanstack/react-query";
import { markNotificationAsRead } from "../api/notificationApi";

export const useMarkNotificationAsRead = () => {
    return useMutation({
        mutationFn: markNotificationAsRead
    });
};