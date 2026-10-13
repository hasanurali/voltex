import { api } from '@/lib';
import * as reactionTypes from '../type';
import { REACTION_ENDPOINTS } from "./reactionEndpoints";

export const createReaction = async (payload: reactionTypes.CreateReactionPayload): Promise<void> => {

    await api.post<reactionTypes.CreateReactionResponse>(REACTION_ENDPOINTS.create, payload);
};

export const removeReaction = async (payload: reactionTypes.RemoveReactionPayload): Promise<void> => {

    await api.delete<reactionTypes.RemoveReactionResponse>(REACTION_ENDPOINTS.remove, {
        data: payload
    });
};