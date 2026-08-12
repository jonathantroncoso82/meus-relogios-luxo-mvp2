import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  initFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: (user, token) => {
    localStorage.setItem('luxwatch_token', token);
    localStorage.setItem('luxwatch_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('luxwatch_token');
    localStorage.removeItem('luxwatch_user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  initFromStorage: () => {
    const token = localStorage.getItem('luxwatch_token');
    const userStr = localStorage.getItem('luxwatch_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        set({ user, token, isAuthenticated: true });
      } catch {
        localStorage.removeItem('luxwatch_token');
        localStorage.removeItem('luxwatch_user');
      }
    }
  },
}));
