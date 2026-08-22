import reactionModel from "./reaction.model.js";


export const checkReactionExists = async (reactionData) => {

    const isReactionExists = await reactionModel.exists(
        reactionData
    );

    return isReactionExists;
};

export const createReaction = async (reactionData, session) => {

    await reactionModel.create(
        [
            reactionData
        ],
        {
            session
        }
    );
};

export const deleteReaction = async (reactionData, session) => {

    return await reactionModel.deleteOne(
        reactionData,
        {
            session
        }
    );
};