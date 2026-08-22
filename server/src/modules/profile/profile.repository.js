import profileModel from "./profile.model.js";
import { executeWithConfig } from "../../shared/utils/index.js";


export const createProfile = async (profileData, session) => {

    const [profile] = await profileModel.create(
        [
            profileData
        ],
        {
            session
        }
    );

    return profile;
};

export const getProfileByUserId = async (userId, queryConfig = {}) => {

    const baseQuery = profileModel.findOne(
        {
            user: userId
        }
    );

    return await executeWithConfig(baseQuery, queryConfig);
};

export const updateProfileByUserId = async (userId, profileData, queryConfig = {}) => {

    const baseQuery = profileModel.findOneAndUpdate(
        {
            user: userId
        },

        profileData,

        {
            returnDocument: "after"
        }
    );

    return await executeWithConfig(baseQuery, queryConfig);
};