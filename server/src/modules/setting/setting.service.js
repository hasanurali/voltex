import * as settingRepository from "./setting.repository.js";


export const fetchSettingService = async (userId) => {

    const setting = await settingRepository.fetchSetting(userId);

    return setting;
};