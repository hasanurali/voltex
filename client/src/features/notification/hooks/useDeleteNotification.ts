import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNotification } from "../api/notificationApi";
import { notificationKeys } from "../api/queryKeys";
import type { Notification } from "../type";

export const useDeleteNotification = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (notification: Notification) => deleteNotification(notification._id),
        onMutate: async (notification) => {

            await queryClient.cancelQueries({ queryKey: notificationKeys.all });
            const previous = queryClient.getQueriesData({ queryKey: notificationKeys.all });

            queryClient.setQueriesData({ queryKey: notificationKeys.fetchNotifications() }, (oldData: any) => {

                if (!oldData?.pages) {
                    return oldData;
                };

                return {
                    ...oldData,
                    pages: oldData.pages.map((page: any) => ({
                        ...page,
                        notifications: page.notifications.filter((n: Notification) => n._id !== notification._id),
                        ...(!notification.isRead && {
                            unreadCount: Math.max(0, page.unreadCount - 1)
                        })
                    }))
                };
            });

            return { previous };
        },
        onError: (_err, _notification, context) => {
            context?.previous.forEach(([key, data]) => queryClient.setQueryData(key, data));
        }
    });
};