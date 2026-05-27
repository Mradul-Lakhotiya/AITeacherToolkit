import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  email: string | null;
  loginTimestamp: number | null;
  setEmail: (email: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      email: null,
      loginTimestamp: null,
      setEmail: (email) => set({ email, loginTimestamp: email ? Date.now() : null }),
      logout: () => set({ email: null, loginTimestamp: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
