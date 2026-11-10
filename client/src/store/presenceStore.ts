import { create } from 'zustand';

interface PresenceState {
  userStatuses: Record<string, boolean>;
  setOnline: (userId: string, isOnline: boolean) => void;
  setMany: (statuses: Record<string, boolean>) => void;
  reset: () => void;
};

export const usePresenceStore = create<PresenceState>((set) => ({

  userStatuses: {},

  setOnline: (userId, isOnline) => set((state) => ({
    userStatuses: { ...state.userStatuses, [userId]: isOnline },
  })),

  setMany: (statuses) => set((state) => ({
    userStatuses: { ...state.userStatuses, ...statuses },
  })),

  reset: () => set({ userStatuses: {} })
}));