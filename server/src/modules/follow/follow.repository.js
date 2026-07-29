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

export const fetchFollowers = async (userId) => {

    const followers = await followModel.aggregate([
        {
            $match: {
                following: userId
            }
        },

        {
            $sort: {
                createdAt: -1
            }
        },

        {
            $lookup: {
                from: "users",
                localField: "follower",
                foreignField: "_id",
                as: "user"
            }
        },

        {
            $unwind: "$user"
        },

        {
            $lookup: {
                from: "profiles",
                localField: "user._id",
                foreignField: "user",
                as: "profile"
            }
        },

        {
            $unwind: "$profile"
        },

        {
            $project: {
                _id: "$user._id",
                displayName: "$user.displayName",
                username: "$user.username",
                avatar: {
                    url: "$profile.avatar.url"
                }
            }
        }
    ]);

    return followers;
};