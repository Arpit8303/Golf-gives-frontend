// =============================================
// GolfGives TypeScript Interfaces
// =============================================

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: 'subscriber' | 'admin';
  subscription_status: 'active' | 'inactive' | 'cancelled' | 'lapsed';
  subscription_plan: 'monthly' | 'yearly' | null;
  subscription_renewal_date: string | null;
  charity_id: string | null;
  charity_percentage: number;
  created_at: string;
}

export interface Score {
  id: string;
  score: number;
  entry_date: string;
  created_at: string;
}

export interface Charity {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  is_featured: boolean;
  events: CharityEvent[];
  created_at: string;
}

export interface CharityEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
}

export interface Draw {
  id: string;
  draw_month: string;
  draw_type: 'random' | 'algorithmic';
  status: 'draft' | 'simulated' | 'published';
  drawn_numbers: number[];
  jackpot_rollover: number;
  created_at: string;
  prize_pools?: PrizePool[];
  draw_results?: DrawResult[];
}

export interface PrizePool {
  id: string;
  draw_id: string;
  total_pool: number;
  five_match_pool: number;
  four_match_pool: number;
  three_match_pool: number;
  jackpot_rollover: number;
}

export interface DrawResult {
  id: string;
  draw_id: string;
  user_id: string;
  match_type: 'five_match' | 'four_match' | 'three_match';
  prize_amount: number;
  payment_status: 'pending' | 'paid';
  proof_url: string | null;
  verification_status: 'pending' | 'approved' | 'rejected';
  draws?: { id: string; draw_month: string };
}

export interface Donation {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  charities?: { id: string; name: string; image_url: string | null };
}

export interface UpcomingDraw {
  nextDrawMonth: string;
  activeSubscribers: number;
  estimatedPool: number;
  jackpotRollover: number;
  hasRollover: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface ApiError {
  success: false;
  error: string;
  code: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
