import { useMutation } from "@tanstack/react-query";
import { deleteNotification } from "../api/notificationApi";

export const useDeleteNotification = () => {
    return useMutation({
        mutationFn: deleteNotification
    });
};