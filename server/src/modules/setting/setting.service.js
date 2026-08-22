import { StatusCodes } from "http-status-codes";

import * as settingRepository from "./setting.repository.js";
import { ApiError, whitelistInput, buildNestedUpdateFields } from "../../shared/utils/index.js";
import { SETTING_MESSAGES } from "../../shared/constants/messages/index.js";
import * as SETTING_OPTIONS from "./setting.options.js";


export const fetchSettingService = async (userId) => {

    const setting = await settingRepository.fetchSetting(userId, SETTING_OPTIONS.SETTING_RESPONSE_PROJECTION);

    return setting;
};

export const updateSettingService = async (userId, settingData) => {

    if (!settingData || !Object.keys(settingData).length) {
        throw new ApiError(StatusCodes.BAD_REQUEST, SETTING_MESSAGES.SETTING_UPDATE_FAIL);
    };

    const { privacy = {}, notifications = {} } = settingData;

    const allowedPrivacyFields = ['profileVisibility', 'messagePermission'];
    const whitelistedPrivacyData = whitelistInput(privacy, allowedPrivacyFields);

    const allowedNotificationFields = ["likes", "comments", "follows", "messages"];
    const whitelistedNotificationData = whitelistInput(notifications, allowedNotificationFields);

    const privacyPair = buildNestedUpdateFields(whitelistedPrivacyData, "privacy");
    const notificationPair = buildNestedUpdateFields(whitelistedNotificationData, "notifications");

    const updateData = { ...privacyPair, ...notificationPair };

    if (!Object.keys(updateData).length) {
        throw new ApiError(StatusCodes.BAD_REQUEST, SETTING_MESSAGES.SETTING_UPDATE_FAIL);
    };

    const updatedSetting = await settingRepository.updateSetting(userId, updateData, SETTING_OPTIONS.SETTING_RESPONSE_PROJECTION);

    return updatedSetting;
};