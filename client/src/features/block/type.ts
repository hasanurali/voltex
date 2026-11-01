import type { ApiResponse } from "@/lib";
import type { Author } from "../post";

export type BlockUserResponse = ApiResponse<null>;
export type UnblockUserResponse = ApiResponse<null>;
export type FetchBlockedUsersResponse = ApiResponse<Author[]>;