import { create } from 'zustand';
import { Score } from '../types';
import api from '../lib/axios';
import toast from 'react-hot-toast';

interface ScoreState {
  scores: Score[];
  isLoading: boolean;
  fetchScores: () => Promise<void>;
  addScore: (score: number, entryDate: string) => Promise<void>;
  updateScore: (id: string, updates: { score?: number; entry_date?: string }) => Promise<void>;
  deleteScore: (id: string) => Promise<void>;
}

export const useScoreStore = create<ScoreState>((set, get) => ({
  scores: [],
  isLoading: false,

  fetchScores: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get<{ success: boolean; data: { scores: Score[] } }>('/scores');
      set({ scores: res.data.data.scores });
    } catch {
      toast.error('Failed to load scores');
    } finally {
      set({ isLoading: false });
    }
  },

  addScore: async (score, entryDate) => {
    try {
      const res = await api.post<{ success: boolean; data: { scores: Score[] } }>('/scores', {
        score,
        entry_date: entryDate,
      });
      set({ scores: res.data.data.scores });
      toast.success('Score added!');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      toast.error(axiosErr.response?.data?.error ?? 'Failed to add score');
    }
  },

  updateScore: async (id, updates) => {
    try {
      await api.put(`/scores/${id}`, updates);
      await get().fetchScores();
      toast.success('Score updated!');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      toast.error(axiosErr.response?.data?.error ?? 'Failed to update score');
    }
  },

  deleteScore: async (id) => {
    try {
      await api.delete(`/scores/${id}`);
      set((state) => ({ scores: state.scores.filter((s) => s.id !== id) }));
      toast.success('Score deleted');
    } catch {
      toast.error('Failed to delete score');
    }
  },
}));
