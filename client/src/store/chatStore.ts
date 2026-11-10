import { create } from 'zustand';

interface ChatState {
    activeConversationId: string | null;
    setActiveConversationId: (id: string | null) => void;
};

export const useChatStore = create<ChatState>((set) => ({
    activeConversationId: null,
    setActiveConversationId: (id) => set({ activeConversationId: id })
}));