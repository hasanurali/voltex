import { api } from '@/lib';
import * as notificationType from '../type';
import { NOTIFICATION_ENDPOINTS } from './notificationEndpoints';

export const fetchNotifications = async (payload: notificationType.FetchNotificationsPayload): Promise<notificationType.FetchNotificationsResponse['data']> => {

    const res = await api.get<notificationType.FetchNotificationsResponse>(NOTIFICATION_ENDPOINTS.fetchNotifications(payload));

    return res.data.data;
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {

    await api.patch<notificationType.MarkNotificationAsReadResponse>(NOTIFICATION_ENDPOINTS.markNotificationAsRead(notificationId));
};

export const markAllNotificationsAsRead = async (): Promise<void> => {

    await api.patch<notificationType.MarkAllNotificationsAsReadResponse>(NOTIFICATION_ENDPOINTS.markAllNotificationsAsRead);
};

export const deleteNotification = async (notificationId: string): Promise<void> => {

    await api.delete<notificationType.DeleteNotificationResponse>(NOTIFICATION_ENDPOINTS.deleteNotification(notificationId));
};