import { api } from '@/lib';
import * as postTypes from '../types';
import { POST_ENDPOINTS } from './postEndpoints';

export const createPost = async (payload: postTypes.CreatePostPayload): Promise<postTypes.CreatePostResponse['data']> => {

    const res = await api.post<postTypes.CreatePostResponse>(POST_ENDPOINTS.create, payload);

    return res.data.data;
};

export const fetchHomeFeed = async (cursor?: string): Promise<postTypes.FetchHomeFeedResponse['data']> => {

    const res = await api.get<postTypes.FetchHomeFeedResponse>(POST_ENDPOINTS.fetchHomeFeed(cursor));

    return res.data.data;
};

export const fetchPostDetails = async (postId: string): Promise<postTypes.FetchPostDetailsResponse['data']> => {

    const res = await api.get<postTypes.FetchPostDetailsResponse>(POST_ENDPOINTS.details(postId));

    return res.data.data;
};

export const updatePost = async (payload: postTypes.UpdatePostPayload): Promise<postTypes.UpdatePostResponse['data']> => {

    const { postId, data } = payload;

    const res = await api.patch<postTypes.UpdatePostResponse>(POST_ENDPOINTS.update(postId), data);

    return res.data.data;
};

export const deletePost = async (postId: string): Promise<void> => {

    await api.delete<postTypes.DeletePostResponse>(POST_ENDPOINTS.delete(postId));
};

export const fetchUserPost = async (payload: postTypes.FetchUserPostPayload): Promise<postTypes.FetchUserPostResponse['data']> => {

    const res = await api.get<postTypes.FetchUserPostResponse>(POST_ENDPOINTS.fetchUserPost(payload));

    return res.data.data;
};