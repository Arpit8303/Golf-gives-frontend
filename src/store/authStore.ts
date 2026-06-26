import { create } from 'zustand';
import { User } from '../types';
import { setAccessToken } from '../lib/axios';
import api from '../lib/axios';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  fetchMe: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  accessToken: null,

  setAuth: (user, token) => {
    setAccessToken(token);
    set({ user, isAuthenticated: true, accessToken: token, isLoading: false });
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch { /* ignore */ }
    setAccessToken(null);
    set({ user: null, isAuthenticated: false, accessToken: null, isLoading: false });
  },

  fetchMe: async () => {
    try {
      // Attempt to refresh first (uses httpOnly cookie)
      const refreshRes = await api.post<{ success: boolean; data: { accessToken: string } }>('/auth/refresh');
      const token = refreshRes.data.data.accessToken;
      setAccessToken(token);

      const meRes = await api.get<{ success: boolean; data: { user: User } }>('/auth/me');
      set({ user: meRes.data.data.user, isAuthenticated: true, accessToken: token, isLoading: false });
    } catch {
      setAccessToken(null);
      set({ user: null, isAuthenticated: false, accessToken: null, isLoading: false });
    }
  },

  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),
}));
