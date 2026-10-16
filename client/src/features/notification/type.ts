import type { Author } from "../post"
import type { ApiResponse } from "@/lib";
import type { ApiPaginationResponse } from "@/lib/types/api";
import type { Pagination } from "../comment/type";

export type TypeEnum =
    | "post-like"
    | "post-comment"
    | "comment-like"
    | "comment-reply"
    | "follow";


export interface NotificationMetaData {
    post?: {
        _id: string;
        author: string;
        content: string;
        media: {
            mediaType: 'image' | 'video';
            url: string;
        };
    };
    comment?: {
        _id: string;
        author: string;
        content: string;
        post: string;
    };
};

export interface Notification {
    _id: string;
    user: string;
    triggeredBy: Author;
    entityId: string;
    entityType: 'user' | 'post' | 'comment';
    type: TypeEnum;
    metadata?: NotificationMetaData;
    isRead: boolean;
    createdAt: string;
};

export type FetchNotificationsResponse = ApiResponse<{
    notifications: Notification[];
    unreadCount: number;
    pagination: ApiPaginationResponse;
}>;

export type MarkNotificationAsReadResponse = ApiResponse<null>;
export type MarkAllNotificationsAsReadResponse = ApiResponse<null>;
export type DeleteNotificationResponse = ApiResponse<null>;

export interface FetchNotificationsPayload extends Pagination { };