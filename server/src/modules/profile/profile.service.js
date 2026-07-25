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