import { api } from "@/lib";
import * as userTypes from "../types";
import { USER_ENDPOINTS } from "./userEndpoints";


export const searchUser = async (payload: userTypes.SearchUserPayload): Promise<userTypes.SearchUserResponse> => {

    const res = await api.get(USER_ENDPOINTS.searchUser(payload));

    return res.data.data;
};

export const checkUserStatuses = async (payload: userTypes.UserStatusPayload): Promise<userTypes.UserStatusResponse> => {

    const res = await api.post(USER_ENDPOINTS.userStatus, payload);

    return res.data.data;
};