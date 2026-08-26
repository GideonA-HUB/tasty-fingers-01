import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CustomerUser {
  customer_id: string;
  email: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  phone: string;
  avatar: string;
  avatar_choices?: { value: string; label: string }[];
  address: string;
  city: string;
  state: string;
  created_at?: string;
}

interface CustomerState {
  token: string | null;
  refreshToken: string | null;
  user: CustomerUser | null;
  isAuthenticated: boolean;
  setSession: (access: string, refresh: string, user: CustomerUser) => void;
  setUser: (user: CustomerUser) => void;
  logout: () => void;
}

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      setSession: (access, refresh, user) => {
        localStorage.setItem('customer_token', access);
        localStorage.setItem('customer_refresh', refresh);
        set({
          token: access,
          refreshToken: refresh,
          user,
          isAuthenticated: true,
        });
      },

      setUser: (user) => set({ user }),

      logout: () => {
        localStorage.removeItem('customer_token');
        localStorage.removeItem('customer_refresh');
        set({
          token: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    { name: 'tasty-fingers-customer' }
  )
);
