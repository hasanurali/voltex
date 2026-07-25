import { StatusCodes } from "http-status-codes";

import * as profileRepository from "./profile.repository.js";
import { ApiError } from "../../shared/utils/index.js";
import { PROFILE_MESSAGES } from "../../shared/constants/messages/index.js";
import { authRepository } from "../auth/index.js";


export const userPublicProfileService = async (username) => {

    const user = await authRepository.findUserByUsername(username, "_id displayName username isVerified createdAt postsCount followersCount followingCount");
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, PROFILE_MESSAGES.NOT_FOUND)
    };

    const profile = await profileRepository.getProfileByUserId(user._id, "_id avatar coverImage bio website location");

    return {
        user,
        profile
    };
};

export const updateProfileService = async (userId, profileData) => {

    if (!profileData || Object.keys(profileData).length === 0) {
        return;
    };

    const { displayName, ...profileFields } = profileData;

    let updatedUser = null;

    if (displayName !== undefined) {

        updatedUser = await authRepository.updateUserByUserId(userId, { displayName });

    };

    const updatedProfile = Object.keys(profileFields).length ?
        await profileRepository.updateProfileByUserId(userId, profileFields)
        :
        null;

    return {
        updatedUser,
        updatedProfile
    };
};