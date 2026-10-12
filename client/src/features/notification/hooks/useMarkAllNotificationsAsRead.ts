import { useMutation } from "@tanstack/react-query";
import { markAllNotificationsAsRead } from "../api/notificationApi";

export const useMarkAllNotificationsAsRead = () => {
    return useMutation({
        mutationFn: markAllNotificationsAsRead
    });
};