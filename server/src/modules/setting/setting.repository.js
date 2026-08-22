import settingModel from "./setting.model.js";
import { executeWithConfig } from "../../shared/utils/index.js";


export const createSetting = async (userId, session) => {

    await settingModel.create(
        [
            {
                user: userId
            }
        ],
        {
            session
        }
    );
};

export const fetchSetting = async (userId, queryConfig = {}) => {

    const baseQuery = settingModel.findOne(
        {
            user: userId
        }
    );

    return await executeWithConfig(baseQuery, queryConfig);
};

export const updateSetting = async (userId, updateData, queryConfig = {}) => {

    const baseQuery = settingModel.findOneAndUpdate(
        {
            user: userId
        },

        updateData,

        {
            returnDocument: "after"
        }
    );

    return await executeWithConfig(baseQuery, queryConfig);
};