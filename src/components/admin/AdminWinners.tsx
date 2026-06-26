import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

interface Winner {
  id: string;
  match_type: number;
  prize_amount: number;
  payment_status: 'pending' | 'paid';
  verification_status: 'pending' | 'approved' | 'rejected';
  proof_url: string | null;
  users: { id: string; full_name: string; email: string };
  draws: { id: string; draw_month: string };
}

export default function AdminWinners() {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWinners = async () => {
    try {
      const res = await api.get('/admin/winners');
      setWinners(res.data.data.winners);
    } catch (err) {
      toast.error('Failed to load winners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWinners();
  }, []);

  const handleVerify = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await api.put(`/admin/winners/${id}/verify`, { status });
      toast.success(`Proof ${status}`);
      fetchWinners();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Verification failed');
    }
  };

  const handlePayout = async (id: string) => {
    try {
      await api.put(`/admin/winners/${id}/payout`);
      toast.success('Marked as paid');
      fetchWinners();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Payout update failed');
    }
  };

  if (loading) return <div className="skeleton h-64 w-full"></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-display text-lg font-bold">Winners & Verification</h3>
      </div>

      {winners.length === 0 ? (
        <div className="text-text-muted bg-[#1a1a1a] p-6 rounded-xl border border-dashed border-white/5 text-center">
          No winners yet. Run a draw simulation to calculate winners!
        </div>
      ) : (
        <div className="w-full text-left">
          <div className="grid grid-cols-12 text-xs text-gray-500 border-b border-white/5 pb-3 mb-3 font-semibold uppercase tracking-wider">
            <div className="col-span-2">User</div>
            <div className="col-span-2">Draw Month</div>
            <div className="col-span-1 text-center">Match</div>
            <div className="col-span-1 text-right">Prize</div>
            <div className="col-span-2 text-center">Proof</div>
            <div className="col-span-2 text-center">Payment</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          <div className="space-y-1">
            {winners.map(w => (
              <div key={w.id} className="grid grid-cols-12 items-center text-sm py-3 border-b border-white/5">
                <div className="col-span-2">
                  <div className="font-semibold text-white">{w.users.full_name}</div>
                  <div className="text-[10px] text-gray-500">{w.users.email}</div>
                </div>
                <div className="col-span-2 text-gray-300">{w.draws.draw_month}</div>
                <div className="col-span-1 text-center font-bold text-white">{w.match_type}</div>
                <div className="col-span-1 text-right font-bold text-green-400">£{w.prize_amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</div>
                
                <div className="col-span-2 text-center flex justify-center gap-2">
                  {w.proof_url ? (
                    <a href={w.proof_url} target="_blank" rel="noreferrer" className="text-purple-400 hover:underline text-xs flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      View
                    </a>
                  ) : (
                    <span className="text-xs text-gray-500">Not uploaded</span>
                  )}
                  {w.verification_status === 'approved' && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-green-500/20 text-green-400 border border-green-500/30">APPROVED</span>}
                  {w.verification_status === 'rejected' && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">REJECTED</span>}
                  {w.verification_status === 'pending' && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">PENDING</span>}
                </div>

                <div className="col-span-2 text-center">
                  {w.payment_status === 'paid' ? (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30">PAID</span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">PENDING</span>
                  )}
                </div>

                <div className="col-span-2 flex justify-end gap-2 flex-wrap">
                  {w.verification_status === 'pending' && w.proof_url && (
                    <>
                      <button onClick={() => handleVerify(w.id, 'approved')} className="p-1 rounded bg-[#1a1a1a] border border-green-500/30 hover:bg-green-500/10 text-green-400 transition-colors text-[10px]">Approve</button>
                      <button onClick={() => handleVerify(w.id, 'rejected')} className="p-1 rounded bg-[#1a1a1a] border border-red-500/30 hover:bg-red-500/10 text-red-400 transition-colors text-[10px]">Reject</button>
                    </>
                  )}
                  {w.verification_status === 'approved' && w.payment_status === 'pending' && (
                    <button onClick={() => handlePayout(w.id)} className="p-1 rounded bg-[#1a1a1a] border border-white/5 hover:bg-white/10 text-white transition-colors text-[10px]">Mark Paid</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
