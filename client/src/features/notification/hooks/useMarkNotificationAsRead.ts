import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markNotificationAsRead } from "../api/notificationApi";
import type { Notification } from "../type";
import { notificationKeys } from "../api/queryKeys";

export const useMarkNotificationAsRead = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (notification: Notification) => markNotificationAsRead(notification._id),
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
                        notifications: page.notifications.map((n: Notification) => ({ ...n, ...((n._id === notification._id && !n.isRead) && { isRead: true }) })),
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