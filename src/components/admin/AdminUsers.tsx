import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import { User } from '../../types';

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await api.get(`/admin/users?search=${search}`);
      if (res.data.success) {
        setUsers(res.data.data.users);
      }
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]); // Re-fetch on search change

  if (loading) return <div className="skeleton h-64 w-full"></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-lg font-semibold">Users</h2>
        <div className="flex gap-4">
          <input 
            type="text" 
            placeholder="Search users..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#1a1a1a] border border-white/5 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-white/20" 
          />
          <button className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-sm font-semibold transition-colors">
            Export CSV
          </button>
        </div>
      </div>

      <div className="w-full text-left">
        <div className="grid grid-cols-12 text-xs text-gray-500 border-b border-white/5 pb-3 mb-3 font-semibold uppercase tracking-wider">
          <div className="col-span-3">Name</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-2">Plan</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Charity %</div>
        </div>

        <div className="space-y-1">
          {users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No users found.</div>
          ) : (
            users.map((u) => (
              <div key={u.id} className="grid grid-cols-12 items-center text-sm py-3 border-b border-white/5">
                <div className="col-span-3 font-semibold">{u.full_name}</div>
                <div className="col-span-3 text-gray-400 truncate pr-4">{u.email}</div>
                <div className="col-span-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    u.subscription_plan === 'yearly' 
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      : 'bg-[#1a1a1a] text-gray-400 border border-white/10'
                  }`}>
                    {(u.subscription_plan || 'FREE').toUpperCase()}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    u.subscription_status === 'active'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {(u.subscription_status || 'INACTIVE').toUpperCase()}
                  </span>
                </div>
                <div className="col-span-2 text-gray-300">
                  {u.charity_percentage ?? 10}%
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
