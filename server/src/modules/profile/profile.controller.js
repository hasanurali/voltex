import { StatusCodes } from "http-status-codes";

import { asyncHandler, ApiResponse } from "../../shared/utils/index.js";
import * as services from "./profile.service.js";
import { PROFILE_MESSAGES } from "../../shared/constants/messages/index.js";

export const userPublicProfileController = asyncHandler(async (req, res) => {

    const username = req.params.username;

    const { user, profile } = await services.userPublicProfileService(username);

    return res.status(StatusCodes.OK)
        .json(new ApiResponse(PROFILE_MESSAGES.PROFILE_FETCH_SUCCESS, { user, profile }));
});

export const updateProfileController = asyncHandler(async (req, res) => {

    const profileData = req.body;

    const userId = req.user.id;

    const { updatedUser, updatedProfile } = await services.updateProfileService(userId, profileData);

    return res.status(StatusCodes.OK)
        .json(new ApiResponse(PROFILE_MESSAGES.PROFILE_UPDATE_SUCCESS, { updatedUser, updatedProfile }));
});