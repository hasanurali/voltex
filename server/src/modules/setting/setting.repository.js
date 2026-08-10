import settingModel from "./setting.model.js";

export const createSetting = async (userId) => {

    await settingModel.create({
        user: userId
    });
};

export const fetchSetting = async (userId) => {

    const setting = await settingModel.findOne({
        user: userId
    });

    return setting;
};