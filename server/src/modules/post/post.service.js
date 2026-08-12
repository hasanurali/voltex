import { StatusCodes } from "http-status-codes";

import * as postRepository from "./post.repository.js";
import * as authRepository from "../auth/auth.repository.js";
import * as followRepository from "../follow/follow.repository.js";
import { blockRepository } from "../block/index.js";
import { ApiError, whitelistInput, withTransaction, encodeCursor, decodeCursor, convertToObjectId } from "../../shared/utils/index.js";
import { POST_MESSAGES, AUTH_MESSAGES, USER_MESSAGES } from "../../shared/constants/messages/index.js";

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
        userFollowingIds = followingIds.map(doc => doc.following);

        const userFollowingIdsSet = new Set(
            userFollowingIds.map(id => id.toString())
        );

        const followersFollowingIds = await followRepository.fetchUsersFollowingIds(userFollowingIds);
        suggestedFollowingIds = [
            ...new Set(
                followersFollowingIds
                    .map(doc => doc.following.toString())
                    .filter(id => id !== userId.toString() && !userFollowingIdsSet.has(id))
            )
        ].map(id => convertToObjectId(id));
    };

    const [blockedByMe, blockedMe] = await Promise.all([
        blockRepository.fetchBlockedUserIds(userId),
        blockRepository.fetchBlockerUserIds(userId)
    ]);

    const blockedIds = new Set([
        ...blockedByMe.map(id => id.toString()),
        ...blockedMe.map(id => id.toString())
    ]);

    userFollowingIds = userFollowingIds.filter(
        id => !blockedIds.has(id.toString())
    );

    suggestedFollowingIds = suggestedFollowingIds.filter(
        id => !blockedIds.has(id.toString())
    );

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

export const fetchPostDetailsService = async (postId) => {

    const objectId = convertToObjectId(postId);
    if (!objectId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, POST_MESSAGES.INVALID_POST_ID);
    };

    const [detailedPost] = await postRepository.fetchPostDetails(objectId);

    if (!detailedPost) {
        throw new ApiError(StatusCodes.NOT_FOUND, POST_MESSAGES.NOT_FOUND);
    };

    return detailedPost;
};

export const fetchUserPostsService = async (username, page = 1, limit = 10) => {

    if (!username?.trim()) {
        throw new ApiError(StatusCodes.BAD_REQUEST, AUTH_MESSAGES.INVALID_USERNAME);
    };

    const user = await authRepository.checkUserExists(username);
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, USER_MESSAGES.NOT_FOUND);
    };

    const parsedPage = Number(page);
    const parsedLimit = Number(limit);

    const safePage = Number.isFinite(parsedPage) ?
        Math.max(Math.floor(parsedPage), 1)
        :
        1;

    const safeLimit = Number.isFinite(parsedLimit) ?
        Math.min(Math.max(Math.floor(parsedLimit), 1), 50)
        :
        10;

    const skip = (safePage - 1) * safeLimit;

    const [result] = await postRepository.fetchUserPosts(user._id, safeLimit, skip);

    const posts = result?.data ?? [];
    const total = result?.metadata?.[0]?.total ?? 0;

    const totalPages = Math.ceil(total / safeLimit);

    return {
        posts,
        pagination: {
            total,
            page: safePage,
            limit: safeLimit,
            totalPages,
            hasNextPage: safePage < totalPages,
            hasPrevPage: safePage > 1
        }
    };
};

export const updatePostService = async (userId, postId, postData) => {

    if (!postData || !Object.keys(postData).length) {
        throw new ApiError(StatusCodes.BAD_REQUEST, POST_MESSAGES.POST_UPDATE_FAIL);
    };

    const { media } = postData;

    const objectId = convertToObjectId(postId);
    if (!objectId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, POST_MESSAGES.INVALID_POST_ID)
    };

    const post = await postRepository.findPost(objectId);
    if (!post) {
        throw new ApiError(StatusCodes.NOT_FOUND, POST_MESSAGES.NOT_FOUND);
    };

    if (post.author.toString() !== userId.toString()) {
        throw new ApiError(StatusCodes.FORBIDDEN, POST_MESSAGES.NOT_OWNER)
    };

    if (media !== undefined) {
        const isValidPublicIds = media.every(({ publicId }) => publicId?.trim());
        if (!isValidPublicIds) {
            throw new ApiError(StatusCodes.BAD_REQUEST, POST_MESSAGES.POST_UPDATE_FAIL)
        };
    };

    const allowedPostFields = ['content', 'media', 'hashtags', 'visibility'];
    const whitelistedPostData = whitelistInput(postData, allowedPostFields);

    let whitelistedMediaData;
    if (media !== undefined) {
        const allowedMediaFields = ['mediaType', 'url', 'publicId'];
        whitelistedMediaData = media.map(media => whitelistInput(media, allowedMediaFields));
    };

    const whitelistedData = {
        ...whitelistedPostData,
        ...(whitelistedMediaData !== undefined && { media: whitelistedMediaData })
    };

    if (!Object.keys(whitelistedData).length) {
        throw new ApiError(StatusCodes.BAD_REQUEST, POST_MESSAGES.POST_UPDATE_FAIL);
    };

    const updatedPost = await postRepository.updatePost(objectId, whitelistedData);

    return updatedPost;
};

export const deletePostService = async (userId, postId) => {

    const objectId = convertToObjectId(postId);
    if (!objectId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, POST_MESSAGES.INVALID_POST_ID)
    };

    const post = await postRepository.findPost(objectId);
    if (!post) {
        throw new ApiError(StatusCodes.NOT_FOUND, POST_MESSAGES.NOT_FOUND);
    };

    if (post.author.toString() !== userId.toString()) {
        throw new ApiError(StatusCodes.FORBIDDEN, POST_MESSAGES.NOT_OWNER)
    };

    await withTransaction(async (session) => {

        await postRepository.softDeletePost(objectId, userId, session);

        await authRepository.decrementPost(userId, session);
    });
};