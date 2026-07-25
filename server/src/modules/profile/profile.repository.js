import profileModel from "./profile.model.js";


export const createProfile = async (profileData) => {

    const profile = await profileModel.create(profileData);

    return profile;
};

export const getProfileByUserId = async (userId, select = "") => {

    const profile = await profileModel.findOne({ user: userId }).select(select);

    return profile;
};