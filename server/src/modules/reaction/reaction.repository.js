import reactionModel from "./reaction.model.js";

export const findReaction = async (reactionData) => {

    const reaction = await reactionModel.findOne(reactionData);

    return reaction;
};

export const createReaction = async (reactionData, session) => {

    await reactionModel.create([reactionData], { session });
};

export const deleteReaction = async (reactionData, session) => {

    await reactionModel.deleteOne(reactionData, { session });
};