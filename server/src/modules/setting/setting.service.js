import * as settingRepository from "./setting.repository.js";
import { whitelistInput, buildNestedUpdateFields } from "../../shared/utils/index.js";


export const fetchSettingService = async (userId) => {

    const setting = await settingRepository.fetchSetting(userId);

    return setting;
};

export const updateSettingService = async (userId, settingData) => {

    const { privacy = {}, notifications = {} } = settingData;

    const allowedPrivacyFields = ['profileVisibility', 'messagePermission'];
    const whitelistedPrivacyData = whitelistInput(privacy, allowedPrivacyFields);

    const allowedNotificationFields = ["likes", "comments", "follows", "messages"];
    const whitelistedNotificationData = whitelistInput(notifications, allowedNotificationFields);

    const privacyPair = buildNestedUpdateFields(whitelistedPrivacyData, "privacy");
    const notificationPair = buildNestedUpdateFields(whitelistedNotificationData, "notifications");

    const updateData = { ...privacyPair, ...notificationPair };

    const updatedSetting = await settingRepository.updateSetting(userId, updateData);

    return updatedSetting;
};