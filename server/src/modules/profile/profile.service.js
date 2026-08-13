import { StatusCodes } from "http-status-codes";

import * as profileRepository from "./profile.repository.js";
import { ApiError, whitelistInput } from "../../shared/utils/index.js";
import { PROFILE_MESSAGES } from "../../shared/constants/messages/index.js";
import { authRepository } from "../auth/index.js";
import { settingRepository } from "../setting/index.js";
import { followRepository } from "../follow/index.js";
import * as cloudinary from "../../shared/cloudinary/cloudinary.service.js";
import { DEFAULT_AVATAR, DEFAULT_COVER_IMAGE } from "../../shared/constants/assets/default.assets.js";
import { PROFILE_VISIBILITY } from "../../shared/constants/enums/index.js";


export const checkUsernameService = async (username) => {

    const isUserExists = await authRepository.checkUserExists(username);

    return !isUserExists;
};

export const fetchUserProfileService = async (userId, username) => {

    const user = await authRepository.findUserByUsername(username, "_id displayName username isVerified createdAt postsCount followersCount followingCount");
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, PROFILE_MESSAGES.NOT_FOUND)
    };

    const setting = await settingRepository.fetchSetting(user._id);
    if (setting.privacy.profileVisibility === PROFILE_VISIBILITY.PRIVATE && userId?.toString() !== user._id.toString()) {

        const isFollower = await followRepository.checkFollowing(userId, user._id);
        if (!isFollower) {
            throw new ApiError(StatusCodes.FORBIDDEN, PROFILE_MESSAGES.PRIVATE_PROFILE);
        };
    };

    const profile = await profileRepository.getProfileByUserId(user._id, "_id avatar coverImage bio website location");

    return {
        user,
        profile
    };
};

export const updateUsernameService = async (userId, username) => {

    const user = await authRepository.findUserById(userId);
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, PROFILE_MESSAGES.NOT_FOUND)
    };

    if (user.username === username) {
        return user;
    };

    const updatedUser = await authRepository.updateUserByUserId(userId, { username });

    return updatedUser;
};

export const updateProfileService = async (userId, profileData) => {

    if (!profileData || !Object.keys(profileData).length) {
        throw new ApiError(StatusCodes.BAD_REQUEST, PROFILE_MESSAGES.PROFILE_UPDATE_FAIL);
    };

    const { displayName, ...profileFields } = profileData;

    let updatedUser = null;

    if (displayName !== undefined) {

        updatedUser = await authRepository.updateUserByUserId(userId, { displayName });
    };

    const allowedFields = ['bio', 'website', 'location'];
    const whitelistedData = whitelistInput(profileFields, allowedFields);

    const updatedProfile = Object.keys(whitelistedData).length ?
        await profileRepository.updateProfileByUserId(userId, whitelistedData)
        :
        null;

    return {
        updatedUser,
        updatedProfile
    };
};

export const updateAvatarService = async (userId, avatarData) => {

    const { url, publicId } = avatarData;

    if (!publicId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, PROFILE_MESSAGES.AVATAR_UPLOAD_FAIL);
    };

    const profile = await profileRepository.getProfileByUserId(userId);
    if (!profile) {
        throw new ApiError(StatusCodes.NOT_FOUND, PROFILE_MESSAGES.NOT_FOUND);
    };

    const oldPublicId = profile.avatar?.publicId;

    const updatedProfile = await profileRepository.updateProfileByUserId(userId, {
        "avatar.url": url,
        "avatar.publicId": publicId
    });

    if (oldPublicId && oldPublicId !== publicId) {

        await cloudinary.deleteImage(oldPublicId);
    };

    return updatedProfile;
};

export const updateCoverImageService = async (userId, coverImageData) => {

    const { url, publicId } = coverImageData;

    if (!publicId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, PROFILE_MESSAGES.COVER_IMAGE_UPLOAD_FAIL);
    };

    const profile = await profileRepository.getProfileByUserId(userId);
    if (!profile) {
        throw new ApiError(StatusCodes.NOT_FOUND, PROFILE_MESSAGES.NOT_FOUND);
    };

    const oldPublicId = profile.coverImage?.publicId;

    const updatedProfile = await profileRepository.updateProfileByUserId(userId, {
        "coverImage.url": url,
        "coverImage.publicId": publicId
    });

    if (oldPublicId && oldPublicId !== publicId) {

        await cloudinary.deleteImage(oldPublicId);
    };

    return updatedProfile;
};

export const deleteAvatarService = async (userId) => {

    const profile = await profileRepository.getProfileByUserId(userId);
    if (!profile) {
        throw new ApiError(StatusCodes.NOT_FOUND, PROFILE_MESSAGES.NOT_FOUND);
    };

    const publicId = profile.avatar?.publicId;
    if (!publicId) {
        return;
    };

    await profileRepository.updateProfileByUserId(userId, {
        "avatar.url": DEFAULT_AVATAR(userId),
        "avatar.publicId": null
    });

    await cloudinary.deleteImage(publicId);
};

export const deleteCoverImageService = async (userId) => {

    const profile = await profileRepository.getProfileByUserId(userId);
    if (!profile) {
        throw new ApiError(StatusCodes.NOT_FOUND, PROFILE_MESSAGES.NOT_FOUND);
    };

    const publicId = profile.coverImage?.publicId;
    if (!publicId) {
        return;
    };

    await profileRepository.updateProfileByUserId(userId, {
        "coverImage.url": DEFAULT_COVER_IMAGE,
        "coverImage.publicId": null
    });

    await cloudinary.deleteImage(publicId);
};