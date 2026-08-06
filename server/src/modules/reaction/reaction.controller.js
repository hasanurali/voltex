import { StatusCodes } from "http-status-codes";

import { asyncHandler, ApiResponse } from "../../shared/utils/index.js";
import * as services from "./reaction.service.js";
import { REACTION_MESSAGES } from "../../shared/constants/messages/index.js";

export const createReactionController = asyncHandler(async (req, res) => {

    const reactionData = req.body;

    const userId = req.user.id;

    const targetType = await services.createReactionService(userId, reactionData);

    return res.status(StatusCodes.CREATED)
        .json(new ApiResponse(REACTION_MESSAGES.REACTION_SUCCESS(targetType)));
});

export const deleteReactionController = asyncHandler(async (req, res) => {

    const reactionData = req.body;

    const userId = req.user.id;

    const targetType = await services.deleteReactionService(userId, reactionData);

    return res.status(StatusCodes.OK)
        .json(new ApiResponse(REACTION_MESSAGES.REACTION_REMOVE_SUCCESS(targetType)));
});