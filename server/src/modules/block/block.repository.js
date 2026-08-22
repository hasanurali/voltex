import blockModel from "./block.model.js";


export const checkBlockExistsByBlockerAndBlocked = async (blocker, blocked) => {

    const isBlock = await blockModel.exists(
        {
            blocker,
            blocked
        }
    );

    return isBlock;
};

export const blockUser = async (blocker, blocked) => {

    await blockModel.create(
        {
            blocker,
            blocked
        }
    );
};

export const unblockUser = async (blocker, blocked) => {

    await blockModel.deleteOne(
        {
            blocker,
            blocked
        }
    );
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
                avatar: "$profile.avatar.url"
            }
        }
    ]);

    return blockedUsers;
};

export const fetchBlockedUserIds = async (userId) => {

    const blockedUserIds = await blockModel.find(
        {
            blocker: userId
        }
    ).select("-_id blocked").lean();

    return blockedUserIds.map(doc => doc.blocked);
};

export const fetchBlockerUserIds = async (userId) => {

    const blockerUserIds = await blockModel.find(
        {
            blocked: userId
        }
    ).select("-_id blocker").lean();

    return blockerUserIds.map(doc => doc.blocker);
};