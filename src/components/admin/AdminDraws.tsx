import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import { Draw } from '../../types';

export default function AdminDraws() {
  const [draws, setDraws] = useState<Draw[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawMonth, setDrawMonth] = useState('');

  const fetchDraws = async () => {
    try {
      const res = await api.get('/admin/draws');
      setDraws(res.data.data.draws);
    } catch (err) {
      toast.error('Failed to load draws');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDraws();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/draws', { drawMonth, drawType: 'random' });
      toast.success('Draw created successfully');
      setDrawMonth('');
      fetchDraws();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to create draw');
    }
  };

  const handleSimulate = async (id: string) => {
    try {
      await api.post(`/admin/draws/${id}/simulate`);
      toast.success('Draw simulated! Winners calculated.');
      fetchDraws();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Simulation failed');
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await api.post(`/admin/draws/${id}/publish`);
      toast.success('Draw published! Users can now see results.');
      fetchDraws();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Publish failed');
    }
  };

  if (loading) return <div className="skeleton h-64 w-full"></div>;

  return (
    <div className="space-y-8">
      {/* Create Draw */}
      <div className="bg-surface border border-border p-6 rounded-xl flex flex-col sm:flex-row items-end gap-4">
        <div className="flex-1 w-full">
          <label className="input-label">Draw Month (YYYY-MM)</label>
          <input 
            type="month" 
            required 
            value={drawMonth} 
            onChange={e => setDrawMonth(e.target.value)} 
            className="input-field" 
          />
        </div>
        <button onClick={handleCreate} disabled={!drawMonth} className="btn-primary w-full sm:w-auto h-[46px]">
          Create New Draw
        </button>
      </div>

      {/* List Draws */}
      <div>
        <h3 className="font-display text-lg font-bold mb-4">Draw History</h3>
        {draws.length === 0 ? (
          <div className="text-text-muted bg-surface p-6 rounded-xl border border-dashed border-border text-center">
            No draws exist yet. Create the first draw to populate the database!
          </div>
        ) : (
          <div className="space-y-4">
            {draws.map(draw => (
              <div key={draw.id} className="bg-surface border border-border p-5 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-bold text-lg">{draw.draw_month}</h4>
                    <span className={`badge text-[10px] ${draw.status === 'published' ? 'badge-green' : draw.status === 'simulated' ? 'badge-yellow' : 'badge-red'}`}>
                      {draw.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-text-muted">
                    Numbers: {draw.drawn_numbers.length > 0 ? draw.drawn_numbers.join(', ') : 'Not drawn yet'}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {draw.status === 'draft' && (
                    <button onClick={() => handleSimulate(draw.id)} className="btn-secondary py-1.5 px-4 text-sm">
                      Run Simulation
                    </button>
                  )}
                  {draw.status === 'simulated' && (
                    <button onClick={() => handlePublish(draw.id)} className="btn-green py-1.5 px-4 text-sm">
                      Publish Results
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
