import { create } from "zustand";

interface AuthState {
    isLoggedIn: boolean;
    login: () => void;
    logout: () => void;
    initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isLoggedIn: false,

    login: () => set({ isLoggedIn: true }),
    logout: () => set({ isLoggedIn: false }),

    initialize: () => {
        const token = localStorage.getItem("access_token");
        set({isLoggedIn: !!token});
    },
}));