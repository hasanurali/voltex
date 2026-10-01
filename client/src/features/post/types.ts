import type { ApiResponse } from "@/lib";
import type { ApiPaginationResponse } from "@/lib/types/api";

export interface Author {
    _id: string;
    displayName: string;
    username: string;
    avatar: string;
};

export interface Media {
    mediaType: 'image' | 'video';
    url: string;
};

export interface Post {
    _id: string;
    author: Author;
    content: string;
    media: Media[];
    hashtags?: string[];
    commentsCount: number;
    likesCount: number;
    visibility: 'public' | 'followers';
    isEdited: boolean;
    hasReacted: boolean;
    createdAt: string;
};

export type CreatePostResponse = ApiResponse<Post>;

export type FetchHomeFeedResponse = ApiResponse<{
    posts: Post[];
    nextCursor: string;
}>;

export type FetchPostDetailsResponse = ApiResponse<Post>;

export type FetchUserPostResponse = ApiResponse<{
    posts: Post[];
    pagination: ApiPaginationResponse;
}>;

export type UpdatePostResponse = ApiResponse<Post>;
export type DeletePostResponse = ApiResponse<null>;

export interface MediaPayloadItem {
    mediaType: 'image' | 'video';
    url: string;
    publicId: string;
};

export interface CreatePostPayload {
    content?: string;
    media?: MediaPayloadItem[];
    hashtags?: string[];
    visibility?: 'public' | 'followers';
};

export interface UpdatePostPayload {
    postId: string;
    data: {
        content?: string;
        media?: MediaPayloadItem[];
        hashtags?: string[];
        visibility?: 'public' | 'followers';
    };
};

export interface FetchUserPostPayload {
    username: string;
    page?: number;
    limit?: number;
};