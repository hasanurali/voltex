import type { ApiResponse } from "@/lib";
import type { Author } from "../post";
import type { ApiPaginationResponse } from "@/lib/types/api";
import type { Pagination } from "../comment/type";

export interface Conversation {
    _id: string,
    name: string,
    participant: Author,
    lastMessage: {
        content: string,
        createdAt: string
    },
    unreadMessages: number
};

export type FetchConversationsResponse = ApiResponse<{
    conversations: Conversation;
    pagination: ApiPaginationResponse;
}>;
export type FetchConversationDetailsResponse = ApiResponse<{
    _id: string;
    name: string;
    participants: Author[];
}>;
export type MarkAllConversationMessagesAsReadResponse = ApiResponse<null>;

export interface FetchConversationsPayload extends Pagination { };