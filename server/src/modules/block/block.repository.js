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