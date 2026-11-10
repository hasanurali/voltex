import type { QueryClient } from '@tanstack/react-query';
import { notificationKeys } from '@/features/notification/api/queryKeys';

export const handleNotificationReceive = (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: notificationKeys.all });
};