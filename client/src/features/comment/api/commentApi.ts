import { api } from '@/lib';
import * as commentTypes from '../type';
import { COMMENT_ENDPOINTS } from './commentEndpoints';

export const createComment = async (payload: commentTypes.CreateCommentPayload): Promise<commentTypes.CreateCommentResponse['data']> => {

    const res = await api.post<commentTypes.CreateCommentResponse>(COMMENT_ENDPOINTS.createComment, payload);

    return res.data.data;
};

export const fetchComment = async (payload: commentTypes.FetchCommentPayload): Promise<commentTypes.FetchCommentResponse['data']> => {

    const res = await api.get<commentTypes.FetchCommentResponse>(COMMENT_ENDPOINTS.fetchComment(payload));

    return res.data.data;
};

export const fetchCommentReplies = async (payload: commentTypes.FetchCommentReplyPayload): Promise<commentTypes.FetchCommentRepliesResponse['data']> => {

    const res = await api.get<commentTypes.FetchCommentRepliesResponse>(COMMENT_ENDPOINTS.fetchCommentReplies(payload));

    return res.data.data;
};

export const updateComment = async (payload: commentTypes.UpdateCommentPayload): Promise<commentTypes.UpdateCommentResponse['data']> => {

    const { commentId, content } = payload;

    const res = await api.patch<commentTypes.UpdateCommentResponse>(COMMENT_ENDPOINTS.updateComment(commentId), { content });

    return res.data.data;
};

export const deleteComment = async (commentId: string): Promise<void> => {

    await api.delete<commentTypes.DeleteCommentResponse>(COMMENT_ENDPOINTS.deleteComment(commentId));
};