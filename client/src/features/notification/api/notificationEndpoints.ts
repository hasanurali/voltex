import type { FetchNotificationsPayload } from "../type";

export const NOTIFICATION_ENDPOINTS = {
    fetchNotifications: ({ page = 1, limit = 10 }: FetchNotificationsPayload) => `/notifications?page=${page}&limit=${limit}`,
    markNotificationAsRead: (notificationId: string) => `/notifications/${notificationId}/read`,
    markAllNotificationsAsRead: '/notifications/read-all',
    deleteNotification: (notificationId: string) => `/notifications/${notificationId}`
} as const;