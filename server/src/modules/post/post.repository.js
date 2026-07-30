import postModel from "./post.model.js";

export const createPost = async (postData, session) => {

    const post = await postModel.create([postData], { session });

    return post;
};