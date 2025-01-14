import { create } from 'zustand';
import { fetchSignIn, fetchSignUp } from '../utils/userService';
// Make sure to create these API functions

interface UserState {
    user: { id: string; name: string; email: string } | null;
    signIn: (email: string, password: string) => Promise<any>;
    signUp: (name: string, email: string, password: string) => Promise<any>;
    clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    signIn: async (email, password) => {
        try {
            const response = await fetchSignIn(email, password);
            if (response) {
                set({ user: response.user });
                return response;
            }
        } catch (error) {
            console.error('Sign-in failed:', error);
            return null;
        }
    },
    signUp: async (name, email, password) => {
        try {
            const response = await fetchSignUp(name, email, password);
            if (response) {
                set({ user: { id: response.id, name, email } });
                return response;
            }
        } catch (error) {
            console.error('Sign-up failed:', error);
            return null;
        }
    },
    clearUser: () => set({ user: null }),
})); 