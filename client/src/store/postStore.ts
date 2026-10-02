import { create } from 'zustand';

interface PostState {
    isCreatePostModelOpen: boolean;
    setIsCreatePostModelOpen: (isModelOpen: boolean) => void;
};

export const usePostStore = create<PostState>((set) => ({
    isCreatePostModelOpen: false,
    setIsCreatePostModelOpen: (isModelOpen) => {
        set({
            isCreatePostModelOpen: isModelOpen
        });
    }
}));