const USER_PROJECTION = {
    select: "_id displayName username email isEmailVerified role followersCount followingCount postsCount createdAt",
};

export const USER_RESPONSE_PROJECTION = {
    ...USER_PROJECTION,
    lean: true
};

export const VERIFIED_EMAIL_RESPONSE_PROJECTION = {
    ...USER_PROJECTION
};

export const LOGIN_RESPONSE_PROJECTION = {
    select: `+password ${USER_PROJECTION.select}`,
};

export const PROFILE_RESPONSE_PROJECTION = {
    select: "_id user avatar.url coverImage.url bio website location",
    lean: true
};