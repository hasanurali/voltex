import type { ApiResponse } from "@/lib";


export interface Setting {
    _id: string;
    user: string;
    privacy: {
        profileVisibility: 'public' | 'private';
        messagePermission: 'everyone' | 'follower';
    };
    notifications: {
        likes: boolean;
        comments: boolean;
        follows: boolean;
        messages: boolean;
    };
};

export type FetchSettingResponse = ApiResponse<Setting>;
export type UpdateSettingResponse = ApiResponse<Setting>;

export interface UpdateSettingPayload {
    privacy?: {
        profileVisibility?: 'public' | 'private';
        messagePermission?: 'everyone' | 'follower';
    };
    notifications?: {
        likes?: boolean;
        comments?: boolean;
        follows?: boolean;
        messages?: boolean;
    };
};
