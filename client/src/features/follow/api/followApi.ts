import { api } from "@/lib";
import * as followTypes from "../types";
import { FOLLOW_ENDPOINTS } from "./followEndpoints";


export const followUser = async (username: string): Promise<void> => {

    await api.post<followTypes.FollowUserResponse>(FOLLOW_ENDPOINTS.followUser(username));
};

export const unFollowUser = async (username: string): Promise<void> => {

    await api.delete<followTypes.UnFollowUserResponse>(FOLLOW_ENDPOINTS.unFollowUser(username));
};

export const fetchUserFollowers = async (payload: followTypes.FetchFollowersPayload): Promise<followTypes.UserFollowersResponse['data']> => {

    const res = await api.get<followTypes.UserFollowersResponse>(FOLLOW_ENDPOINTS.fetchUserFollowers(payload));

    return res.data.data;
};

export const fetchUserFollowings = async (payload: followTypes.FetchFollowingsPayload): Promise<followTypes.UserFollowingsResponse['data']> => {

    const res = await api.get<followTypes.UserFollowingsResponse>(FOLLOW_ENDPOINTS.fetchUserFollowings(payload));

    return res.data.data;
};