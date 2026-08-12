import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, Usuario } from '../types';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      usuario: null,
      isAuthenticated: false,

      login: (token: string, usuario: Usuario) => {
        set({ token, usuario, isAuthenticated: true });
      },

      logout: () => {
        set({ token: null, usuario: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
