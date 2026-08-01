import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

import * as postRepository from "./post.repository.js";
import * as authRepository from "../auth/auth.repository.js";
import * as followRepository from "../follow/follow.repository.js";
import { ApiError, whitelistInput, withTransaction, encodeCursor, decodeCursor } from "../../shared/utils/index.js";
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

export const fetchPostsService = async (userId, cursor) => {

    const decodedCursor = decodeCursor(cursor);

    let userFollowingIds = [];
    let suggestedFollowingIds = [];

    if (userId) {

        const followingIds = await followRepository.fetchUserFollowingIds(userId);
        userFollowingIds = userFollowingIds.map(doc => doc.following);

        const followersFollowingIds = await followRepository.fetchUsersFollowingIds(userFollowingIds);
        suggestedFollowingIds = [
            ...new Set(
                followersFollowingIds.map(doc => doc.following.toString())
            )
        ].map(id => new mongoose.Types.ObjectId(id));
    };

    const posts = await postRepository.fetchHomeFeed({ userFollowingIds, suggestedFollowingIds, cursor: decodedCursor });

    const lastPost = posts.at(-1);

    const nextCursor = lastPost ?
        encodeCursor({
            score: lastPost.finalScore,
            postId: lastPost._id
        })
        : null;

    const sanitizedPosts = posts.map(({ finalScore, ...post }) => post);

    return {
        posts: sanitizedPosts,
        nextCursor
    };
};