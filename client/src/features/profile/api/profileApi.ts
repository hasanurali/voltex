import { api } from '@/lib';
import type * as profileTypes from '../types';
import { PROFILE_ENDPOINTS } from "./profileEndpoints";
import type { AuthUser, User, Profile } from '@/features/auth';
import type { UpdateUsernameFormValues, UpdateProfileFormValues } from '../schemas/profileSchema';


export const checkUsername = async (username: string): Promise<profileTypes.UsernameCheckResponse['data']> => {

    const res = await api.get<profileTypes.UsernameCheckResponse>(PROFILE_ENDPOINTS.checkUsername(username));

    return res.data.data;
};

export const fetchUserProfile = async (username: string): Promise<AuthUser> => {

    const res = await api.get<profileTypes.ProfileResponse>(PROFILE_ENDPOINTS.userProfile(username));

    return res.data.data;
};

export const updateUsername = async (payload: UpdateUsernameFormValues): Promise<User> => {

    const res = await api.patch<profileTypes.UpdateUsernameResponse>(PROFILE_ENDPOINTS.updateUsername, payload);

    return res.data.data;
};

export const updateProfile = async (payload: UpdateProfileFormValues): Promise<profileTypes.UpdateProfileResponse['data']> => {

    const res = await api.patch<profileTypes.UpdateProfileResponse>(PROFILE_ENDPOINTS.updateProfile, payload);

    return res.data.data;
};

export const updateAvatar = async (payload: profileTypes.UpdateAvatarPayload): Promise<Profile> => {

    const res = await api.patch<profileTypes.UpdateAvatarResponse>(PROFILE_ENDPOINTS.updateAvatar, payload);

    return res.data.data;
};

export const updateCoverImage = async (payload: profileTypes.UpdateCoverImagePayload): Promise<Profile> => {

    const res = await api.patch<profileTypes.UpdateCoverImageResponse>(PROFILE_ENDPOINTS.updateCoverImage, payload);

    return res.data.data;
};

export const deleteAvatar = async (): Promise<void> => {

    await api.delete<profileTypes.RemoveAvatarResponse>(PROFILE_ENDPOINTS.deleteAvatar);
};

export const deleteCoverImage = async (): Promise<void> => {

    await api.delete<profileTypes.RemoveCoverImageResponse>(PROFILE_ENDPOINTS.deleteCoverImage);
};