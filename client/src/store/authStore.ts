import { create } from 'zustand';
import type { AuthUser } from '@/features/auth/types';

interface AuthState {
    auth: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setAuth: (auth: AuthUser) => void;
    clearAuth: () => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    auth: null,
    isAuthenticated: false,
    isLoading: true,
    setAuth: (auth) => set({ auth, isAuthenticated: true, isLoading: false }),
    clearAuth: () => set({ auth: null, isAuthenticated: false, isLoading: false }),
    setLoading: (isLoading) => set({ isLoading }),
}));