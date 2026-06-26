import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../lib/axios';
import { Draw } from '../types';

export default function DrawResults() {
  const [draws, setDraws] = useState<Draw[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDraws = async () => {
      try {
        const res = await api.get('/draws');
        setDraws(res.data.data.draws);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDraws();
  }, []);

  return (
    <>
      <Navbar />
      <main className="container py-12">
        <div className="mb-12">
          <h1 className="mb-4 font-display text-4xl font-bold">Draw Results</h1>
          <p className="text-text-muted">Past winning numbers and prize pools.</p>
        </div>

        {loading ? (
          <div className="skeleton h-64 w-full"></div>
        ) : (
          <div className="grid gap-6">
            {draws.map((draw) => (
              <div key={draw.id} className="glass-card p-6">
                <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <h3 className="font-display text-2xl font-bold">{draw.draw_month} Draw</h3>
                    <span className="text-sm text-text-muted">Type: {draw.draw_type}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-text-muted">Jackpot Rollover</div>
                    <div className="font-display text-xl font-bold text-accent-green">
                      £{(draw.jackpot_rollover / 100).toFixed(2)}
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted">Winning Numbers</h4>
                  <div className="flex flex-wrap gap-3">
                    {draw.drawn_numbers.map((num, i) => (
                      <div key={i} className="flex h-12 w-12 items-center justify-center rounded-full bg-surface border border-border font-display text-xl font-bold text-white shadow-glass">
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
