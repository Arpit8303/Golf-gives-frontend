import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import { Charity } from '../../types';

export default function AdminCharities() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  const fetchCharities = async () => {
    try {
      const res = await api.get('/admin/charities');
      setCharities(res.data.data.charities);
    } catch (err) {
      toast.error('Failed to load charities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharities();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/charities', { name, description, image_url: imageUrl, is_featured: isFeatured });
      toast.success('Charity added successfully');
      setName('');
      setDescription('');
      setImageUrl('');
      setIsFeatured(false);
      fetchCharities();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to add charity');
    }
  };

  if (loading) return <div className="skeleton h-64 w-full"></div>;

  return (
    <div className="space-y-8">
      {/* Add New Charity */}
      <div className="bg-surface border border-border p-6 rounded-xl">
        <h3 className="font-display text-lg font-bold mb-4">Add New Charity</h3>
        <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="input-label">Charity Name</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)} className="input-field" />
          </div>
          <div className="sm:col-span-2">
            <label className="input-label">Description</label>
            <textarea required value={description} onChange={e => setDescription(e.target.value)} className="input-field h-24" />
          </div>
          <div className="sm:col-span-2">
            <label className="input-label">Image URL</label>
            <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="input-field" placeholder="https://..." />
          </div>
          <div className="sm:col-span-2 flex items-center gap-2 mt-2">
            <input type="checkbox" id="featured" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="accent-accent-green w-4 h-4" />
            <label htmlFor="featured" className="text-sm font-semibold text-white cursor-pointer">Featured Partner</label>
          </div>
          <div className="sm:col-span-2 mt-4">
            <button type="submit" className="btn-primary w-full sm:w-auto px-8">Add Charity</button>
          </div>
        </form>
      </div>

      {/* List Charities */}
      <div>
        <h3 className="font-display text-lg font-bold mb-4">Existing Charities</h3>
        {charities.length === 0 ? (
          <div className="text-text-muted bg-surface p-6 rounded-xl border border-dashed border-border text-center">
            No charities found. Add one above to populate the database!
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {charities.map(c => (
              <div key={c.id} className="bg-surface border border-border p-4 rounded-xl flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-lg">{c.name}</h4>
                  {c.is_featured && <span className="badge badge-green text-[10px]">Featured</span>}
                </div>
                <p className="text-sm text-text-muted line-clamp-2 mb-4 flex-1">{c.description}</p>
                <div className="text-xs text-text-muted mt-auto pt-4 border-t border-border">
                  Added on {new Date(c.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
