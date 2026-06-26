import { create } from 'zustand';
import api from '../lib/axios';
import toast from 'react-hot-toast';

export interface WinnerResult {
  id: string;
  match_type: number;
  prize_amount: number;
  payment_status: 'pending' | 'paid';
  proof_url: string | null;
  verification_status: 'pending' | 'approved' | 'rejected';
  draws: { id: string; draw_month: string };
}

interface WinnerState {
  wins: WinnerResult[];
  totalWon: number;
  isLoading: boolean;
  fetchWins: () => Promise<void>;
}

export const useWinnerStore = create<WinnerState>((set) => ({
  wins: [],
  totalWon: 0,
  isLoading: false,

  fetchWins: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/winners/my-wins');
      set({ wins: res.data.data.wins, totalWon: res.data.data.totalWon });
    } catch {
      toast.error('Failed to load winnings');
    } finally {
      set({ isLoading: false });
    }
  },
}));
