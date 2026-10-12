export const notificationKeys = {
    all: ['notification'] as const,
    fetchNotifications: (limit: number = 10) => [...notificationKeys.all, limit] as const
};