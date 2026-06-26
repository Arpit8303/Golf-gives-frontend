import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useScoreStore } from '../store/scoreStore';
import { useWinnerStore } from '../store/winnerStore';
import Navbar from '../components/Navbar';
import PlanPicker from '../components/subscription/PlanPicker';
import UploadProofModal from '../components/winners/UploadProofModal';
import toast from 'react-hot-toast';

// ── Animated number counter ──────────────────────────────────
function AnimatedNumber({ value, prefix = "", suffix = "", duration = 1200 }: any) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseFloat(value);
    if (isNaN(end)) return;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setDisplay(end); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <span>{prefix}{display}{suffix}</span>;
}

// ── Lottery ball ─────────────────────────────────────────────
function LotteryBall({ number, delay = 0, size = 44 }: any) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "radial-gradient(circle at 35% 35%, #a855f7, #7e22ce)",
      boxShadow: "inset -3px -3px 6px rgba(0,0,0,0.4), 0 4px 16px rgba(168,85,247,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 700, fontSize: 15,
      transform: visible ? "scale(1) translateY(0)" : "scale(0) translateY(-20px)",
      opacity: visible ? 1 : 0,
      transition: `transform 0.45s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms, opacity 0.3s ease ${delay}ms`,
      cursor: "default", userSelect: "none",
    }}>{number}</div>
  );
}

// ── Pulsing button ───────────────────────────────────────────
function PulseButton({ children, onClick, style = {} }: any) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%", padding: "14px 0", borderRadius: 10, border: "none",
        background: hovered
          ? "linear-gradient(135deg,#a855f7,#7c3aed)"
          : "linear-gradient(135deg,#9333ea,#6d28d9)",
        color: "#fff", fontWeight: 700, fontSize: 16, cursor: "pointer",
        boxShadow: hovered
          ? "0 0 0 6px rgba(147,51,234,0.25), 0 8px 24px rgba(147,51,234,0.4)"
          : "0 0 0 0px rgba(147,51,234,0.0), 0 4px 14px rgba(147,51,234,0.3)",
        transition: "all 0.3s ease",
        animation: "subtlePulse 2.4s ease-in-out infinite",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// ── Charity slider ───────────────────────────────────────────
function CharitySlider({ initialPercent = 35, yearlyAmount = 100, onChange }: any) {
  const [pct, setPct] = useState(initialPercent);
  const donation = ((pct / 100) * yearlyAmount).toFixed(2);
  const trees = Math.max(1, Math.floor(parseFloat(donation) / 5));

  const handleChange = (e: any) => {
    const val = Number(e.target.value);
    setPct(val);
    if(onChange) onChange(val);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <div style={{ color: "#22c55e", fontWeight: 800, fontSize: 32 }}>
          <AnimatedNumber value={pct} suffix="%" />
        </div>
        <div style={{ color: "#9ca3af", fontSize: 13, lineHeight: 1.4 }}>
          of subscription → charity<br />
          <span style={{ color: "#4ade80" }}>£{donation}/yr</span>
        </div>
      </div>

      <input
        type="range" min={10} max={100} value={pct}
        onChange={handleChange}
        style={{ width: "100%", accentColor: "#22c55e", cursor: "pointer", marginBottom: 8 }}
      />

      <div style={{
        background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)",
        borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#86efac",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        🌳 Your contribution plants ~<strong>{trees} trees</strong> this year
        <span style={{ marginLeft: "auto", color: "#6b7280", fontSize: 11 }}>
          Drag to increase
        </span>
      </div>
    </div>
  );
}

// ── Score empty state ─────────────────────────────────────────
function EmptyScoreState() {
  return (
    <div style={{
      textAlign: "center", padding: "28px 0 16px", color: "#6b7280",
    }}>
      <div style={{ fontSize: 38, marginBottom: 8 }}>⛳</div>
      <p style={{ margin: "0 0 6px", color: "#9ca3af", fontWeight: 500 }}>
        No scores yet
      </p>
      <p style={{ margin: 0, fontSize: 13, color: "#4b5563" }}>
        Add your first score above to enter monthly draws
      </p>
    </div>
  );
}

// ── Score row ─────────────────────────────────────────────────
function ScoreRow({ index, score, date, onDelete }: any) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid", gridTemplateColumns: "40px 1fr 1fr 80px",
        padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)",
        background: hovered ? "rgba(255,255,255,0.02)" : "transparent",
        transition: "background 0.2s",
        borderRadius: 6,
      }}
    >
      <span style={{ color: "#6b7280", fontSize: 13 }}>{index}</span>
      <span style={{ color: "#e5e7eb", fontWeight: 600 }}>{score}</span>
      <span style={{ color: "#9ca3af", fontSize: 13 }}>{date}</span>
      <span
        onClick={onDelete}
        style={{ color: "#ef4444", fontSize: 12, cursor: "pointer", textAlign: "right" }}
      >
        Delete
      </span>
    </div>
  );
}

// ── Winnings motivation bar ───────────────────────────────────
function WinChanceBar({ scoresCount = 0 }: any) {
  const pct = Math.min(100, scoresCount * 20);
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
        <span>Draw entry strength</span>
        <span style={{ color: "#a78bfa" }}>{pct}%</span>
      </div>
      <div style={{ background: "#1f2937", borderRadius: 999, height: 6, overflow: "hidden" }}>
        <div style={{
          width: `${pct}%`, height: "100%", borderRadius: 999,
          background: "linear-gradient(90deg,#7c3aed,#a855f7)",
          transition: "width 1s ease",
        }} />
      </div>
      <p style={{ fontSize: 11, color: "#4b5563", marginTop: 6 }}>
        {scoresCount < 5
          ? `Add ${5 - scoresCount} more score${5 - scoresCount !== 1 ? "s" : ""} to maximise your draw entry`
          : "🎯 Maximum entry strength achieved!"}
      </p>
    </div>
  );
}

// ── Card wrapper ──────────────────────────────────────────────
function Card({ children, style = {} }: any) {
  return (
    <div style={{
      background: "#111827",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 14, padding: "20px 22px",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      ...style,
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.35)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {children}
    </div>
  );
}

function CardLabel({ icon, label }: any) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
      <span style={{ fontSize: 15 }}>{icon}</span>
      <span style={{ color: "#e5e7eb", fontWeight: 600, fontSize: 15 }}>{label}</span>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// MAIN DASHBOARD COMPONENT
// ════════════════════════════════════════════════════════════
export default function Dashboard() {
  const { user } = useAuthStore();
  const { scores, fetchScores, addScore, deleteScore } = useScoreStore();
  const { wins, totalWon, fetchWins } = useWinnerStore();

  const [showPlanPicker, setShowPlanPicker] = useState(false);
  const [uploadModalId, setUploadModalId] = useState<string | null>(null);

  const [scoreInput, setScoreInput] = useState("");
  const [dateInput, setDateInput] = useState(new Date().toISOString().split('T')[0]);
  const [scoreError, setScoreError] = useState("");

  useEffect(() => {
    if (user?.subscription_status === 'active') {
      fetchScores();
      fetchWins();
    }
  }, [fetchScores, fetchWins, user?.subscription_status]);

  const drawNumbers = [7, 14, 22, 31, 30];
  const prizePool = 4820;
  const nextDraw = "31 Jul 2026";
  const charityName = "Green Earth Golf";
  const yearlyAmount = user?.subscription_plan === 'yearly' ? 99.99 : (user?.subscription_plan === 'monthly' ? 9.99 * 12 : 99.99);

  // ── Score add ──
  const handleAddScore = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setScoreError("");
    const val = parseInt(scoreInput, 10);
    if (isNaN(val) || val < 1 || val > 45) {
      setScoreError("Score must be between 1 and 45");
      return;
    }
    if (!dateInput.trim()) {
      setScoreError("Please enter a date");
      return;
    }
    // Check duplicate date
    if (scores.find(s => s.entry_date === dateInput.trim())) {
      setScoreError("A score for this date already exists. Edit or delete it first.");
      return;
    }
    
    try {
      await addScore(val, dateInput.trim());
      setScoreInput("");
    } catch (err: any) {
      setScoreError(err?.response?.data?.error?.message || "Failed to add score");
    }
  };

  const pageStyle = {
    minHeight: "100vh",
    background: "#0d1117",
    color: "#e5e7eb",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    padding: "0 0 60px",
  };

  const containerStyle = {
    maxWidth: 1100, margin: "0 auto", padding: "32px 20px",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 18,
  };

  return (
    <div style={pageStyle}>
      <style>{`
        @keyframes subtlePulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(147,51,234,0.35); }
          50%      { box-shadow: 0 0 0 8px rgba(147,51,234,0); }
        }
        input[type=range]::-webkit-slider-thumb { cursor: pointer; }
        * { box-sizing: border-box; }
      `}</style>

      {/* ── Navbar ── */}
      <Navbar />

      <div style={containerStyle}>
        {/* ── Welcome ── */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ margin: "0 0 4px", fontSize: 26, fontWeight: 700 }}>Welcome, {user?.full_name?.split(' ')[0] || 'Player'} 👋</h1>
          <p style={{ margin: 0, color: "#6b7280", fontSize: 14 }}>Here's your performance overview</p>
        </div>

        {/* ── Row 1: Subscription + Charity ── */}
        <div style={{ ...gridStyle, marginBottom: 18 }}>

          {/* Subscription */}
          <Card>
            <CardLabel icon="💳" label="Subscription" />
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ color: "#9ca3af", fontSize: 14 }}>Status</span>
              <span style={{
                background: user?.subscription_status === 'active' ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", 
                color: user?.subscription_status === 'active' ? "#4ade80" : "#f87171",
                padding: "2px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600,
              }}>{user?.subscription_status?.toUpperCase() || 'INACTIVE'}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <span style={{ color: "#9ca3af", fontSize: 14 }}>Plan</span>
              <span style={{ color: "#4b5563", fontSize: 14 }}>{user?.subscription_plan ? user.subscription_plan.toUpperCase() : '—'}</span>
            </div>
            {user?.subscription_status !== 'active' ? (
              <PulseButton onClick={() => setShowPlanPicker(true)}>🏌️ Subscribe to Play</PulseButton>
            ) : (
              <button 
                onClick={() => toast.error('Cancellation portal coming soon!')}
                style={{
                  width: "100%", padding: "14px 0", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)",
                  background: "transparent", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer",
                }}
              >
                Cancel plan
              </button>
            )}
            
            <p style={{ textAlign: "center", color: "#4b5563", fontSize: 12, margin: "8px 0 0" }}>
              Monthly & yearly plans available
            </p>
          </Card>

          {/* Charity Impact */}
          <Card>
            <CardLabel icon="💚" label="Your Impact" />
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 42, height: 42, borderRadius: "50%",
                background: "rgba(34,197,94,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
              }}>💚</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{charityName}</div>
                <div style={{ color: "#6b7280", fontSize: 12 }}>Selected charity</div>
              </div>
            </div>
            <CharitySlider initialPercent={user?.charity_percentage ?? 35} yearlyAmount={yearlyAmount} onChange={(val: number) => {
              // Debounced API call placeholder
            }} />
          </Card>
        </div>

        {/* ── Row 2: Scores (full width) ── */}
        <Card style={{ marginBottom: 18 }}>
          <CardLabel icon="🎯" label="Your Scores" />

          {/* Input row */}
          <form onSubmit={handleAddScore} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ color: "#6b7280", fontSize: 12, display: "block", marginBottom: 4 }}>
                Score (1–45)
              </label>
              <input
                type="number" min={1} max={45}
                placeholder="e.g. 34"
                value={scoreInput}
                onChange={e => setScoreInput(e.target.value)}
                disabled={user?.subscription_status !== 'active'}
                style={{
                  width: "100%", background: "#1f2937",
                  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
                  padding: "10px 14px", color: "#e5e7eb", fontSize: 14,
                  outline: "none", opacity: user?.subscription_status !== 'active' ? 0.5 : 1
                }}
              />
            </div>
            <div>
              <label style={{ color: "#6b7280", fontSize: 12, display: "block", marginBottom: 4 }}>
                Date
              </label>
              <input
                type="date"
                value={dateInput}
                onChange={e => setDateInput(e.target.value)}
                disabled={user?.subscription_status !== 'active'}
                style={{
                  width: "100%", background: "#1f2937",
                  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
                  padding: "10px 14px", color: "#e5e7eb", fontSize: 14,
                  outline: "none", opacity: user?.subscription_status !== 'active' ? 0.5 : 1
                }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button
                type="submit"
                disabled={user?.subscription_status !== 'active'}
                style={{
                  background: "#1f2937", border: "1px solid rgba(255,255,255,0.12)",
                  color: "#e5e7eb", padding: "10px 20px", borderRadius: 8,
                  fontWeight: 600, cursor: user?.subscription_status !== 'active' ? "not-allowed" : "pointer", 
                  fontSize: 14, whiteSpace: "nowrap", height: "42px",
                  transition: "background 0.2s", opacity: user?.subscription_status !== 'active' ? 0.5 : 1
                }}
                onMouseEnter={e => { if(user?.subscription_status === 'active') e.currentTarget.style.background = "#374151" }}
                onMouseLeave={e => { e.currentTarget.style.background = "#1f2937" }}
              >
                + Add Score
              </button>
            </div>
          </form>

          {scoreError && (
            <div style={{
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 8, padding: "8px 14px", color: "#f87171", fontSize: 13, marginBottom: 12,
            }}>
              ⚠️ {scoreError}
            </div>
          )}

          {/* Score table */}
          {scores.length > 0 ? (
            <div>
              <div style={{
                display: "grid", gridTemplateColumns: "40px 1fr 1fr 80px",
                padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.08)",
                marginBottom: 4,
              }}>
                {["#", "Score", "Date", "Actions"].map(h => (
                  <span key={h} style={{ color: "#4b5563", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</span>
                ))}
              </div>
              {scores.map((s, i) => (
                <ScoreRow 
                  key={s.id} 
                  index={i + 1} 
                  score={s.score} 
                  date={new Date(s.entry_date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })} 
                  onDelete={() => deleteScore(s.id)} 
                />
              ))}
            </div>
          ) : (
            <EmptyScoreState />
          )}

          <p style={{
            textAlign: "center", color: "#374151", fontSize: 12,
            margin: "12px 0 0", paddingTop: 12,
            borderTop: "1px solid rgba(255,255,255,0.04)",
          }}>
            5 scores max — oldest removed automatically
          </p>
        </Card>

        {/* ── Row 3: Draw + Winnings ── */}
        <div style={gridStyle}>

          {/* Monthly Draw */}
          <Card>
            <CardLabel icon="✨" label="Monthly Draw" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
              <div style={{
                background: "#1a1f2e", borderRadius: 10, padding: "14px",
                textAlign: "center",
              }}>
                <div style={{ color: "#6b7280", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
                  Next Draw
                </div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{nextDraw}</div>
              </div>
              <div style={{
                background: "#1a1f2e", borderRadius: 10, padding: "14px",
                textAlign: "center",
              }}>
                <div style={{ color: "#6b7280", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
                  Prize Pool
                </div>
                <div style={{ fontWeight: 700, fontSize: 16, color: "#22c55e" }}>
                  £<AnimatedNumber value={prizePool} />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ color: "#6b7280", fontSize: 13, marginBottom: 10 }}>Your numbers</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {drawNumbers.map((n, i) => (
                  <LotteryBall key={n} number={n} delay={i * 100} />
                ))}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 'auto' }}>
              <div style={{
                background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)",
                color: "#4ade80", padding: "4px 14px", borderRadius: 999,
                fontSize: 13, fontWeight: 600,
              }}>
                ✓ ENTERED
              </div>
              <span style={{ color: "#6b7280", fontSize: 13 }}>2 draws this month</span>
            </div>
          </Card>

          {/* My Winnings */}
          <Card>
            <CardLabel icon="🏆" label="My Winnings" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div style={{ background: "#1a1f2e", borderRadius: 10, padding: 14, textAlign: "center" }}>
                <div style={{ color: "#6b7280", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
                  Total Won
                </div>
                <div style={{ fontWeight: 700, fontSize: 20 }}>£{totalWon.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</div>
              </div>
              <div style={{ background: "#1a1f2e", borderRadius: 10, padding: 14, textAlign: "center" }}>
                <div style={{ color: "#6b7280", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
                  Pending
                </div>
                <div style={{ fontWeight: 700, fontSize: 20 }}>{wins.filter(w => w.payment_status === 'pending').length}</div>
              </div>
            </div>

            {/* Motivation section or Winnings list */}
            {wins.length > 0 ? (
               <div className="space-y-4 mb-4 overflow-y-auto max-h-40 pr-2">
                 {wins.map(w => (
                   <div key={w.id} className="flex justify-between items-center text-sm" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                     <span style={{ color: '#fff' }}>{w.draws.draw_month} — <span style={{ color: '#9ca3af' }}>{w.match_type} match</span></span>
                     <div className="flex items-center gap-3">
                       <span style={{ color: '#4ade80', fontWeight: 600 }}>£{w.prize_amount}</span>
                       {w.payment_status === 'paid' ? (
                         <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 'bold', background: 'rgba(34,197,94,0.2)', color: '#4ade80' }}>PAID</span>
                       ) : (
                         <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 'bold', background: 'rgba(249,115,22,0.2)', color: '#fb923c' }}>PENDING</span>
                       )}
                     </div>
                   </div>
                 ))}
               </div>
            ) : (
              <div style={{
                background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.15)",
                borderRadius: 10, padding: "14px 16px", marginBottom: 14
              }}>
                <p style={{ margin: "0 0 4px", fontSize: 13, color: "#9ca3af" }}>
                  🎯 Next draw on <strong style={{ color: "#e5e7eb" }}>{nextDraw}</strong>
                </p>
                <p style={{ margin: "0 0 10px", fontSize: 13, color: "#9ca3af" }}>
                  Prize pool: <strong style={{ color: "#22c55e" }}>£{prizePool.toLocaleString()}</strong>
                </p>
                <WinChanceBar scoresCount={scores.length} />
              </div>
            )}

            <button
              onClick={() => {
                const pendingWin = wins.find(w => w.verification_status === 'pending' && !w.proof_url);
                if (pendingWin) {
                  setUploadModalId(pendingWin.id);
                } else {
                  toast.success('No pending uploads needed!');
                }
              }} 
              style={{
                width: "100%", marginTop: "auto", padding: "10px 0",
                background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8, color: "#9ca3af", cursor: "pointer", fontSize: 14,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "all 0.2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
                e.currentTarget.style.color = "#e5e7eb";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.color = "#9ca3af";
              }}
            >
              ⬆ Upload proof of winnings
            </button>
          </Card>
        </div>
      </div>

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
