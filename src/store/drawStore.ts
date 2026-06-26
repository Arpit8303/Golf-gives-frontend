import { create } from 'zustand';
import { Draw, UpcomingDraw } from '../types';
import api from '../lib/axios';

interface DrawState {
  draws: Draw[];
  upcomingDraw: UpcomingDraw | null;
  jackpotRollover: number;
  isLoading: boolean;
  fetchPublishedDraws: () => Promise<void>;
  fetchUpcomingDraw: () => Promise<void>;
}

export const useDrawStore = create<DrawState>((set) => ({
  draws: [],
  upcomingDraw: null,
  jackpotRollover: 0,
  isLoading: false,

  fetchPublishedDraws: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get<{ success: boolean; data: { draws: Draw[] } }>('/draws');
      set({ draws: res.data.data.draws });
    } catch {
      // silent — homepage handles fallback UI
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUpcomingDraw: async () => {
    try {
      const res = await api.get<{ success: boolean; data: UpcomingDraw }>('/draws/upcoming');
      const data = res.data.data;
      set({
        upcomingDraw: data,
        jackpotRollover: data.jackpotRollover ?? 0,
      });
    } catch {
      // silent
    }
  },
}));
