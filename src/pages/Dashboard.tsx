import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useScoreStore } from '../store/scoreStore';
import { useWinnerStore } from '../store/winnerStore';
import Navbar from '../components/Navbar';
import PlanPicker from '../components/subscription/PlanPicker';
import UploadProofModal from '../components/winners/UploadProofModal';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { scores, fetchScores, addScore, deleteScore, updateScore } = useScoreStore();
  const { wins, totalWon, fetchWins } = useWinnerStore();
  const [showPlanPicker, setShowPlanPicker] = useState(false);
  const [uploadModalId, setUploadModalId] = useState<string | null>(null);
  const [sliderValue, setSliderValue] = useState(user?.charity_percentage ?? 20);

  const [scoreInput, setScoreInput] = useState('');
  const [dateInput, setDateInput] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (user?.subscription_status === 'active') {
      fetchScores();
      fetchWins();
    }
  }, [fetchScores, fetchWins, user?.subscription_status]);

  const handleAddScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scoreInput || !dateInput) return;
    await addScore(parseInt(scoreInput), dateInput);
    setScoreInput('');
  };

  const handleEditScore = async (id: string, currentScore: number) => {
    const newScore = window.prompt('Enter new score (1-45):', currentScore.toString());
    if (newScore) {
      const parsed = parseInt(newScore);
      if (parsed >= 1 && parsed <= 45) {
        await updateScore(id, { score: parsed });
      } else {
        alert('Score must be between 1 and 45');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans">
      <Navbar />
      <main className="container py-10 max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-1">Welcome, {user?.full_name?.split(' ')[0] || 'Player'}</h1>
          <p className="text-sm text-gray-400">Here's your performance overview</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-6">
          {/* Subscription Card */}
          <div className="bg-[#1a1a1a] rounded-xl border border-white/5 p-6 flex flex-col relative overflow-hidden">
            <h3 className="flex items-center gap-2 text-sm font-semibold mb-6 text-gray-200">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
              Subscription
            </h3>
            
            <div className="space-y-4 flex-1">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Status</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${user?.subscription_status === 'active' ? 'border-green-500/50 text-green-400 bg-green-500/10' : 'border-red-500/50 text-red-400 bg-red-500/10'}`}>
                  {user?.subscription_status?.toUpperCase() || 'INACTIVE'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Plan</span>
                {user?.subscription_plan ? (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold border border-purple-500/50 text-purple-400 bg-purple-500/10">
                    {user.subscription_plan.toUpperCase()}
                  </span>
                ) : (
                  <span className="text-gray-500">-</span>
                )}
              </div>
              {user?.subscription_renewal_date && (
                <div className="text-xs text-gray-500 pt-2">
                  Renews {new Date(user.subscription_renewal_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              )}
            </div>

            <div className="mt-6">
              {user?.subscription_status !== 'active' ? (
                <button onClick={() => setShowPlanPicker(true)} className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-sm font-semibold transition-colors">
                  Subscribe to play
                </button>
              ) : (
                <button onClick={() => toast.error('Cancellation portal coming soon!')} className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-sm font-semibold transition-colors">
                  Cancel plan
                </button>
              )}
            </div>
          </div>

          {/* Your Impact Card */}
          <div className="bg-[#1a1a1a] rounded-xl border border-white/5 p-6 flex flex-col">
            <h3 className="flex items-center gap-2 text-sm font-semibold mb-6 text-gray-200">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              Your impact
            </h3>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold">Green Earth Golf</h4>
                <p className="text-xs text-gray-500">Selected charity</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-3xl font-bold text-green-400 mb-1">{sliderValue}%</div>
              <div className="text-xs text-gray-500">
                of subscription → charity - £{((99.99 * sliderValue) / 100).toFixed(2)}/yr
              </div>
            </div>

            <div className="mt-auto relative pb-2">
              <input 
                type="range" 
                min="10" 
                max="100" 
                value={sliderValue} 
                onChange={(e) => setSliderValue(parseInt(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-green-400"
              />
            </div>
          </div>
        </div>

        {/* Your Scores Card */}
        <div className="bg-[#1a1a1a] rounded-xl border border-white/5 p-6 mb-6">
          <h3 className="flex items-center gap-2 text-sm font-semibold mb-6 text-gray-200">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
            Your scores
          </h3>
          
          <form onSubmit={handleAddScore} className="flex flex-col sm:flex-row gap-4 items-end mb-8">
            <div className="flex-1 w-full">
              <label className="block text-xs text-gray-500 mb-2">Score (1-45)</label>
              <input 
                type="number" 
                value={scoreInput}
                onChange={e => setScoreInput(e.target.value)}
                min="1" max="45"
                placeholder="e.g. 34" 
                disabled={user?.subscription_status !== 'active'}
                className="w-full bg-[#242424] border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 disabled:opacity-50" 
              />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-xs text-gray-500 mb-2">Date</label>
              <input 
                type="date" 
                value={dateInput}
                onChange={e => setDateInput(e.target.value)}
                disabled={user?.subscription_status !== 'active'}
                className="w-full bg-[#242424] border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 disabled:opacity-50" 
              />
            </div>
            <button 
              type="submit" 
              disabled={user?.subscription_status !== 'active'}
              className="px-6 py-2.5 rounded-lg border border-white/10 hover:bg-white/5 text-sm font-semibold transition-colors disabled:opacity-50 h-[42px]"
            >
              Add score
            </button>
          </form>

          <div className="w-full">
            <div className="grid grid-cols-4 text-xs text-gray-500 border-b border-white/5 pb-3 mb-3">
              <div>#</div>
              <div className="text-center">Score</div>
              <div className="text-center">Date</div>
              <div className="text-right">Actions</div>
            </div>
            
            {scores.length === 0 ? (
              <div className="text-center text-sm text-gray-500 py-6">
                No scores yet. Add your first score above!
              </div>
            ) : (
              <div className="space-y-1">
                {scores.map((score, index) => (
                  <div key={score.id} className="grid grid-cols-4 items-center text-sm py-2 group hover:bg-white/5 rounded-lg px-2 -mx-2 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">#{index + 1}</span>
                      {index === 0 && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">NEW</span>}
                    </div>
                    <div className="text-center text-white">{score.score}</div>
                    <div className="text-center text-gray-300">
                      {new Date(score.entry_date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                    <div className="flex justify-end gap-3 text-gray-500">
                      <button onClick={() => handleEditScore(score.id, score.score)} className="hover:text-white transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button onClick={() => deleteScore(score.id)} className="hover:text-red-400 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="text-center text-xs text-gray-500 mt-8">
              5 scores max — oldest removed automatically
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Monthly Draw Card */}
          <div className="flex-1 bg-[#1a1a1a] rounded-xl border border-white/5 p-6 relative flex flex-col">
            <h3 className="flex items-center gap-2 text-sm font-semibold mb-6 text-gray-200">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
              Monthly draw
            </h3>
            
            <div className="flex gap-4 mb-8">
              <div className="flex-1 text-center py-4 bg-[#242424] rounded-lg border border-white/5">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-1">Next Draw</div>
                <div className="text-white font-bold">31 Jul 2026</div>
              </div>
              <div className="flex-1 text-center py-4 bg-[#242424] rounded-lg border border-white/5">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-1">Prize Pool</div>
                <div className="text-green-400 font-bold">£4,820</div>
              </div>
            </div>

            <div className="mb-8 flex-1">
              <div className="text-xs text-gray-500 mb-3">Your numbers</div>
              <div className="flex items-center gap-2">
                {[7, 14, 22, 31, 30].map((num, i) => (
                  <div key={i} className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-purple-500/20">
                    {num}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center mt-auto border-t border-white/5 pt-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold border border-green-500/50 text-green-400 bg-green-500/10">
                ENTERED
              </span>
              <span className="text-xs text-gray-500">2 draws this month</span>
            </div>
          </div>

          {/* My Winnings Card */}
          <div className="flex-1 bg-[#1a1a1a] rounded-xl border border-white/5 p-6 flex flex-col">
            <h3 className="flex items-center gap-2 text-sm font-semibold mb-6 text-gray-200">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              My winnings
            </h3>

            <div className="flex gap-4 mb-8">
              <div className="flex-1 text-center py-4 bg-[#242424] rounded-lg border border-white/5">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-1">Total Won</div>
                <div className="text-green-400 font-bold">£{totalWon.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</div>
              </div>
              <div className="flex-1 text-center py-4 bg-[#242424] rounded-lg border border-white/5">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-1">Pending</div>
                <div className="text-orange-400 font-bold">{wins.filter(w => w.payment_status === 'pending').length}</div>
              </div>
            </div>

            <div className="space-y-4 mb-8 overflow-y-auto max-h-48 pr-2 flex-1 flex flex-col justify-center">
              {wins.length === 0 ? (
                <div className="text-center text-sm text-gray-500 py-4 my-auto">No wins yet. Keep playing!</div>
              ) : (
                <div className="my-auto space-y-4">
                  {wins.map(w => (
                    <div key={w.id} className="flex justify-between items-center text-sm">
                      <span className="text-white">{w.draws.draw_month} — <span className="text-gray-400">{w.match_type} match</span></span>
                      <div className="flex items-center gap-3">
                        <span className="text-green-400 font-semibold">£{w.prize_amount}</span>
                        {w.payment_status === 'paid' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30">PAID</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">PENDING</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-auto border-t border-white/5 pt-4">
              <button 
                onClick={() => {
                  const pendingWin = wins.find(w => w.verification_status === 'pending' && !w.proof_url);
                  if (pendingWin) {
                    setUploadModalId(pendingWin.id);
                  } else {
                    toast.success('No pending uploads needed!');
                  }
                }} 
                className="w-full py-2.5 rounded-lg border border-white/10 hover:bg-white/5 text-sm font-semibold flex items-center justify-center gap-2 text-gray-300 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                Upload proof
              </button>
            </div>
          </div>
        </div>

      </main>

      {showPlanPicker && (
        <PlanPicker onClose={() => setShowPlanPicker(false)} />
      )}

      {uploadModalId && (
        <UploadProofModal 
          drawResultId={uploadModalId} 
          onClose={() => setUploadModalId(null)} 
          onSuccess={() => fetchWins()} 
        />
      )}
    </div>
  );
}
