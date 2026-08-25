import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setTokens: (access: string, refresh: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      setTokens: (access, refresh) => {
        localStorage.setItem('admin_token', access);
        localStorage.setItem('admin_refresh', refresh);
        set({ token: access, refreshToken: refresh, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_refresh');
        set({ token: null, refreshToken: null, isAuthenticated: false });
      },
    }),
    { name: 'tasty-fingers-auth' }
  )
);
