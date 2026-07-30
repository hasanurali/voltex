import { StatusCodes } from "http-status-codes";

import * as postRepository from "./post.repository.js";
import * as authRepository from "../auth/auth.repository.js";
import { ApiError, whitelistInput, withTransaction } from "../../shared/utils/index.js";
import { POST_MESSAGES } from "../../shared/constants/messages/index.js";

export const createPostService = async (userId, postData) => {

    const { content, media = [] } = postData;

    if (!content && !media?.length) {
        throw new ApiError(StatusCodes.BAD_REQUEST, POST_MESSAGES.CONTENT_OR_MEDIA_REQUIRED);
    };

    const isValidPublicIds = media?.every(({ publicId }) => publicId?.trim());
    if (!isValidPublicIds) {
        throw new ApiError(StatusCodes.BAD_REQUEST, POST_MESSAGES.POST_CREATE_FAIL)
    };

    const allowedFields = ['content', 'media', 'hashtags', 'visibility'];
    const whitelistedData = whitelistInput(postData, allowedFields);

    let post;

    await withTransaction(async (session) => {

        post = await postRepository.createPost({
            author: userId,
            ...whitelistedData
        }, session);

        await authRepository.incrementPost(userId, session);
    });

    return post;
};