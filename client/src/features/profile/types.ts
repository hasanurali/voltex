import type { ApiResponse } from '@/lib';
import type { User, Profile, AuthUser } from '@/features/auth';

export type UsernameCheckResponse = ApiResponse<{ available: boolean }>;
export type ProfileResponse = ApiResponse<AuthUser>;
export type UpdateUsernameResponse = ApiResponse<User>;
export type UpdateProfileResponse = ApiResponse<{
    updatedUser: User | null;
    updatedProfile: Profile | null;
}>;
export type UpdateAvatarResponse = ApiResponse<Profile>;
export type UpdateCoverImageResponse = ApiResponse<Profile>;

export type RemoveAvatarResponse = ApiResponse<null>;
export type RemoveCoverImageResponse = ApiResponse<null>;

export interface UpdateAvatarPayload {
    url: string;
    publicId: string;
};

export interface UpdateCoverImagePayload {
    url: string;
    publicId: string;
};