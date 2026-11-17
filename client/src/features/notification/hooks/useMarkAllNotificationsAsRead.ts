import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAllNotificationsAsRead } from "../api/notificationApi";
import { notificationKeys } from "../api/queryKeys";
import type { Notification, NotificationsInfiniteData } from "../type";

export const useMarkAllNotificationsAsRead = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: markAllNotificationsAsRead,
        onMutate: async () => {

            await queryClient.cancelQueries({ queryKey: notificationKeys.all });
            const previous = queryClient.getQueriesData({ queryKey: notificationKeys.all });

            queryClient.setQueriesData<NotificationsInfiniteData>({ queryKey: notificationKeys.fetchNotifications() }, (oldData) => {

                if (!oldData?.pages) {
                    return oldData;
                };

                return {
                    ...oldData,
                    pages: oldData.pages.map((page) => ({
                        ...page,
                        notifications: page.notifications.map((n: Notification) => ({ ...n, ...(!n.isRead && { isRead: true }) })),
                        unreadCount: 0
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