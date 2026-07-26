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

export const checkUsernameController = asyncHandler(async (req, res) => {

    const username = req.query.username;

    const available = await services.checkUsernameService(username);

    const message = available ?
        PROFILE_MESSAGES.USERNAME_AVAILABLE
        :
        PROFILE_MESSAGES.USERNAME_TAKEN;

    return res.status(StatusCodes.OK)
        .json(new ApiResponse(message, { available }));
});

export const updateUsernameController = asyncHandler(async (req, res) => {

    const username = req.body.username;

    const userId = req.user.id;

    const updatedUser = await services.updateUsernameService(userId, username);

    return res.status(StatusCodes.OK)
        .json(new ApiResponse(PROFILE_MESSAGES.USERNAME_UPDATE_SUCCESS, updatedUser));
});

export const updateProfileController = asyncHandler(async (req, res) => {

    const profileData = req.body;

    const userId = req.user.id;

    const { updatedUser, updatedProfile } = await services.updateProfileService(userId, profileData);

    return res.status(StatusCodes.OK)
        .json(new ApiResponse(PROFILE_MESSAGES.PROFILE_UPDATE_SUCCESS, { updatedUser, updatedProfile }));
});

export const updateAvatarController = asyncHandler(async (req, res) => {

    const avatarData = req.body;

    const userId = req.user.id;

    const updatedProfile = await services.updateAvatarService(userId, avatarData);

    return res.status(StatusCodes.OK)
        .json(new ApiResponse(PROFILE_MESSAGES.AVATAR_UPDATE_SUCCESS, updatedProfile));
});

export const updateCoverImageController = asyncHandler(async (req, res) => {

    const coverImageData = req.body;

    const userId = req.user.id;

    const updatedProfile = await services.updateCoverImageService(userId, coverImageData);

    return res.status(StatusCodes.OK)
        .json(new ApiResponse(PROFILE_MESSAGES.COVER_IMAGE_UPDATE_SUCCESS, updatedProfile));
});

export const deleteAvatarController = asyncHandler(async (req, res) => {

    const userId = req.user.id;

    await services.deleteAvatarService(userId);

    return res.status(StatusCodes.OK)
        .json(new ApiResponse(PROFILE_MESSAGES.AVATAR_DELETE_SUCCESS));
});