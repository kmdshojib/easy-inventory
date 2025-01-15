import { create } from 'zustand';
import { fetchSignIn, fetchSignUp } from '../utils/userService';

// Storage utility
const getStorageValue = (key: string) => {
    if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    }
    return null;
};

const setStorageValue = (key: string, value: any) => {
    if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
    }
};

export interface UserState {
    user: { id: string; name: string; email: string } | null;
    signIn: (email: string, password: string) => Promise<any>;
    signUp: (name: string, email: string, password: string) => Promise<any>;
    clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: getStorageValue('user'),
    signIn: async (email, password) => {
        try {
            const response = await fetchSignIn(email, password);
            if (response) {
                setStorageValue('user', response.user);
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
                const user = { id: response.id, name, email };
                // setStorageValue('user', user);
                // set({ user });
                return response;
            }
        } catch (error) {
            console.error('Sign-up failed:', error);
            return null;
        }
    },
    clearUser: () => {
        if (typeof window !== 'undefined') {
            window.localStorage.removeItem('user');
        }
        set({ user: null });
    },
}));