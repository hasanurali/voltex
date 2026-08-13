const POST_MESSAGES = Object.freeze({
    POST_CREATE_SUCCESS: "Post created successfully",
    POSTS_FETCH_SUCCESS: "Posts fetched successfully",
    POST_DETAILS_FETCH_SUCCESS: "Post details fetched successfully",
    USER_POSTS_FETCH_SUCCESS: "User posts fetched successfully",
    POST_UPDATE_SUCCESS: "Post updated successfully",
    POST_DELETE_SUCCESS: "Post deleted successfully",

    CONTENT_OR_MEDIA_REQUIRED: "Post content or media is required",
    POST_CREATE_FAIL: "Post creation failed. Please try again",
    POST_UPDATE_FAIL: "Post update failed. Please try again",
    NOT_OWNER: "Only the post owner can perform this action",
    INVALID_POST_ID: "Invalid post ID",
    NOT_FOUND: "Post not found"
});

export default POST_MESSAGES;