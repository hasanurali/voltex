import type { ApiResponse, ApiPaginationResponse } from "@/lib";
import type { Author } from "../post";
import type { Pagination } from "../comment/type";

export interface Media {
    mediaType: 'image' | 'video',
    url: string
};

export interface Message {
    _id: string,
    conversation: string,
    sender: Author,
    content: string,
    media: Media[],
    isSeen: boolean,
    seenAt: string,
    isDeleted: boolean,
    createdAt: string
};

export type CreateMessageResponse = ApiResponse<Message>;
export type FetchMessagesResponse = ApiResponse<{
    messages: Message[],
    pagination: ApiPaginationResponse
}>;
export type DeleteMessageResponse = ApiResponse<null>;

export interface PayloadMedia extends Media {
    publicId: string;
};

export type CreateMessagePayload = (
    | { conversation?: string; participant: string }
    | { conversation: string; participant?: string }
) & (
        | { content?: string; media: PayloadMedia[]; }
        | { content: string; media?: PayloadMedia[]; }
    );

export interface FetchMessagesPayload extends Pagination {
    conversationId: string;
};

export interface TemporaryMessage {
    _id: string;
    conversation?: string;
    sender?: Author;
    content: string;
    media: Media[];
    isSeen?: boolean;
    seenAt?: string;
    isDeleted?: boolean;
    createdAt: string;
    progress?: number[];
    isTemporary?: boolean;
};