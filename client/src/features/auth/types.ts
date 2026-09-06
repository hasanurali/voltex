import type { ApiResponse } from "@/lib";
import type { VerifyEmailFormValues, ResetPasswordFormValues } from './schemas/authSchema';

export interface User {
    _id: string;
    displayName: string;
    username: string;
    email: string;
    isEmailVerified: boolean;
    role: 'user' | 'admin';
    followersCount: number;
    followingCount: number;
    postsCount: number;
    createdAt: string;
    updatedAt?: string;
};

export interface Profile {
    _id: string;
    user: string;
    avatar: string;
    coverImage: string;
    bio: string | null;
    website: string | null;
    location: string | null;
};

export interface AuthUser {
    user: User;
    profile: Profile;
};

export interface RegisterUser extends User {
    status: 'active' | 'suspended' | 'banned';
    isDeleted: boolean;
};

export type RegisterResponse = ApiResponse<{
    user: RegisterUser;
    profile: Profile;
}>;

export type VerifyEmailResponse = ApiResponse<AuthUser>;
export type LoginResponse = ApiResponse<AuthUser>;
export type AuthUserResponse = ApiResponse<AuthUser>;

export type ResendOtpResponse = ApiResponse<null>;
export type LogoutResponse = ApiResponse<null>;
export type RefreshTokenResponse = ApiResponse<null>;
export type ForgotPasswordResponse = ApiResponse<null>;
export type ResetPasswordResponse = ApiResponse<null>;

export interface VerifyEmailPayload extends VerifyEmailFormValues {
    email: string;
};

export interface ResetPasswordPayload extends ResetPasswordFormValues {
    token: string;
};

export interface ResendOtpPayload {
    email: string;
};