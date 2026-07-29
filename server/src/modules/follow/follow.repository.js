import followModel from "./follow.model.js";

export const followUser = async (follower, following, session) => {

    await followModel.create([{
        follower,
        following
    }], { session });
};

export const checkFollowing = async (follower, following) => {

    const isFollowing = await followModel.exists({
        follower,
        following
    });

    return isFollowing;
};