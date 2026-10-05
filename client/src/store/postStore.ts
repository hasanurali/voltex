import { create } from 'zustand';

interface PostState {
    isCreatePostModelOpen: boolean;
    setIsCreatePostModelOpen: (isModelOpen: boolean) => void;
    updatePostId: string | null;
    setUpdatePostId: (postId: string) => void;
    resetPostUpdateData: () => void;
};

export const usePostStore = create<PostState>((set) => ({
    isCreatePostModelOpen: false,
    setIsCreatePostModelOpen: (isModelOpen) => {
        set({
            isCreatePostModelOpen: isModelOpen
        });
    },
    updatePostId: null,
    setUpdatePostId: (postId) => {
        set({
            updatePostId: postId,
            isCreatePostModelOpen: true
        });
    },
    resetPostUpdateData: () => {
        set({
            updatePostId: null,
            isCreatePostModelOpen: false
        });
    }
}));