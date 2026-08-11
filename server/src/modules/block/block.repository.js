import blockModel from "./block.model.js";

export const findBlock = async (blocker, blocked) => {

    const block = await blockModel.findOne({
        blocker,
        blocked
    });

    return block;
};

export const blockUser = async (blocker, blocked) => {

    await blockModel.create({
        blocker,
        blocked
    });
};

export const unblockUser = async (blocker, blocked) => {

    await blockModel.deleteOne({
        blocker,
        blocked
    });
};

export const fetchBlockedUsers = async (userId) => {

    const blockedUsers = await blockModel.aggregate([

        {
            $match: {
                blocker: userId
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
                localField: "blocked",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            displayName: 1,
                            username: 1
                        }
                    }
                ],
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
                pipeline: [
                    {
                        $project: {
                            _id: 0,
                            avatar: 1
                        }
                    }
                ],
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

    return blockedUsers;
};