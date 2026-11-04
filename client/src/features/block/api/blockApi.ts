import { api } from '@/lib';
import * as blockTypes from '../type.ts';
import { BLOCK_ENDPOINTS } from './blockEndpoints.ts';

export const blockUser = async (username: string): Promise<void> => {

    await api.post<blockTypes.BlockUserResponse>(BLOCK_ENDPOINTS.blockUser(username));
};

export const unblockUser = async (username: string): Promise<void> => {

    await api.delete<blockTypes.UnblockUserResponse>(BLOCK_ENDPOINTS.unblockUser(username));
};

export const fetchBlockedUsers = async (): Promise<blockTypes.FetchBlockedUsersResponse['data']> => {

    const res = await api.get<blockTypes.FetchBlockedUsersResponse>(BLOCK_ENDPOINTS.fetchBlockedUsers);

    return res.data.data;
};