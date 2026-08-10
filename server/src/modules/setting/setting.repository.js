import settingModel from "./setting.model.js";

export const createSetting = async (userId) => {

    await settingModel.create({
        user: userId
    });
};