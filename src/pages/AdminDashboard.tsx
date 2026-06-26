import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import AdminCharities from '../components/admin/AdminCharities';
import AdminDraws from '../components/admin/AdminDraws';
import AdminWinners from '../components/admin/AdminWinners';
import { Link } from 'react-router-dom';
import api from '../lib/axios';

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'users' | 'draws' | 'charities' | 'winners' | 'reports'>('users');
  const [reports, setReports] = useState({ totalUsers: 0, totalPrizePool: 0, totalDonated: 0, activeSubscribers: 0 });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get('/admin/reports');
        if (res.data.success) {
          setReports(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch reports', err);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#121212] border-r border-white/5 flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/20">
            A
          </div>
          <span className="font-display font-bold text-lg tracking-tight">Golf Gives</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30 ml-auto">
            Admin
          </span>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
          <div>
            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-3 px-3">Overview</div>
            <button 
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${activeTab === 'reports' ? 'bg-white/5 text-white border-l-2 border-purple-500 rounded-l-none pl-2.5' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              Reports
            </button>
          </div>

          <div>
            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-3 px-3">Manage</div>
            <div className="space-y-1">
              {[
                { id: 'users', label: 'Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
                { id: 'draws', label: 'Draws', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
                { id: 'charities', label: 'Charities', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
                { id: 'winners', label: 'Winners', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
              ].map(item => (
                <button 
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${activeTab === item.id ? 'bg-white/5 text-white border-l-2 border-purple-500 rounded-l-none pl-2.5' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-3 px-3">System</div>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Settings
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-white/5 mt-auto">
          <Link to="/dashboard" className="w-full flex justify-center py-2 text-xs text-gray-500 hover:text-white transition-colors">
            Exit Admin
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="px-10 py-8 flex justify-between items-end border-b border-white/5">
          <h1 className="text-2xl font-semibold">Reports and analytics</h1>
          <div className="text-sm text-gray-500">June 2026</div>
        </header>

        <div className="flex-1 overflow-y-auto p-10">
          
          {/* Top 4 Metric Cards */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-[#121212] border border-white/5 rounded-xl p-5">
              <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-2">Total users</div>
              <div className="text-2xl font-bold text-white">{reports.totalUsers.toLocaleString()}</div>
            </div>
            <div className="bg-[#121212] border border-white/5 rounded-xl p-5">
              <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-2">Prize pool</div>
              <div className="text-2xl font-bold text-green-400">£{reports.totalPrizePool.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</div>
            </div>
            <div className="bg-[#121212] border border-white/5 rounded-xl p-5">
              <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-2">Charity total</div>
              <div className="text-2xl font-bold text-white">£{reports.totalDonated.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</div>
            </div>
            <div className="bg-[#121212] border border-white/5 rounded-xl p-5">
              <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-2">Active subs</div>
              <div className="text-2xl font-bold text-white">{reports.activeSubscribers.toLocaleString()}</div>
            </div>
          </div>

          {/* Navigation Tabs (Big buttons) */}
          <div className="flex gap-4 mb-8">
            <button 
              onClick={() => setActiveTab('users')}
              className={`flex-1 py-4 px-6 rounded-xl border transition-all text-sm font-semibold ${activeTab === 'users' ? 'bg-[#1a1a1a] border-white/20 text-white' : 'bg-[#121212] border-white/5 text-gray-400 hover:text-white hover:border-white/10'}`}
            >
              User management
            </button>
            <button 
              onClick={() => setActiveTab('draws')}
              className={`flex-1 py-4 px-6 rounded-xl border transition-all text-sm font-semibold ${activeTab === 'draws' ? 'bg-[#1a1a1a] border-white/20 text-white' : 'bg-[#121212] border-white/5 text-gray-400 hover:text-white hover:border-white/10'}`}
            >
              Draw management
            </button>
            <button 
              onClick={() => setActiveTab('winners')}
              className={`flex-1 py-4 px-6 rounded-xl border transition-all text-sm font-semibold ${activeTab === 'winners' ? 'bg-[#1a1a1a] border-white/20 text-white' : 'bg-[#121212] border-white/5 text-gray-400 hover:text-white hover:border-white/10'}`}
            >
              Winners
            </button>
            <button 
              onClick={() => setActiveTab('charities')}
              className={`flex-1 py-4 px-6 rounded-xl border transition-all text-sm font-semibold ${activeTab === 'charities' ? 'bg-[#1a1a1a] border-white/20 text-white' : 'bg-[#121212] border-white/5 text-gray-400 hover:text-white hover:border-white/10'}`}
            >
              Charity CRUD
            </button>
          </div>

          {/* Tab Content Area */}
          <div className="bg-[#121212] rounded-xl border border-white/5 p-8 min-h-[400px]">
            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-lg font-semibold">Users</h2>
                  <div className="flex gap-4">
                    <input type="text" placeholder="Search users..." className="bg-[#1a1a1a] border border-white/5 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-white/20" />
                    <button className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-sm font-semibold transition-colors">
                      Export CSV
                    </button>
                  </div>
                </div>

                <div className="w-full text-left">
                  <div className="grid grid-cols-12 text-xs text-gray-500 border-b border-white/5 pb-3 mb-3 font-semibold uppercase tracking-wider">
                    <div className="col-span-2">Name</div>
                    <div className="col-span-3">Email</div>
                    <div className="col-span-2">Plan</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-1">Charity %</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>

                  <div className="space-y-1">
                    {/* Dummy Data matching screenshot */}
                    <div className="grid grid-cols-12 items-center text-sm py-3 border-b border-white/5">
                      <div className="col-span-2 font-semibold">Arpit Sharma</div>
                      <div className="col-span-3 text-gray-400">arpit@example.com</div>
                      <div className="col-span-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">YEARLY</span>
                      </div>
                      <div className="col-span-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30">ACTIVE</span>
                      </div>
                      <div className="col-span-1 text-gray-300">20%</div>
                      <div className="col-span-2 flex justify-end gap-2">
                        <button className="p-1.5 rounded bg-[#1a1a1a] border border-white/5 hover:bg-white/10 text-gray-400 transition-colors flex items-center gap-1 text-xs">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg> Edit
                        </button>
                        <button className="p-1.5 rounded bg-[#1a1a1a] border border-white/5 hover:bg-white/10 text-gray-400 transition-colors flex items-center gap-1 text-xs">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> View
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-12 items-center text-sm py-3 border-b border-white/5">
                      <div className="col-span-2 font-semibold">Priya Mehta</div>
                      <div className="col-span-3 text-gray-400">priya@example.com</div>
                      <div className="col-span-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1a1a1a] text-gray-400 border border-white/10">MONTHLY</span>
                      </div>
                      <div className="col-span-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30">ACTIVE</span>
                      </div>
                      <div className="col-span-1 text-gray-300">15%</div>
                      <div className="col-span-2 flex justify-end gap-2">
                         <button className="p-1.5 rounded bg-[#1a1a1a] border border-white/5 hover:bg-white/10 text-gray-400 transition-colors flex items-center gap-1 text-xs">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg> Edit
                        </button>
                        <button className="p-1.5 rounded bg-[#1a1a1a] border border-white/5 hover:bg-white/10 text-gray-400 transition-colors flex items-center gap-1 text-xs">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> View
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-12 items-center text-sm py-3 border-b border-white/5">
                      <div className="col-span-2 font-semibold">Ravi Singh</div>
                      <div className="col-span-3 text-gray-400">ravi@example.com</div>
                      <div className="col-span-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1a1a1a] text-gray-400 border border-white/10">MONTHLY</span>
                      </div>
                      <div className="col-span-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">LAPSED</span>
                      </div>
                      <div className="col-span-1 text-gray-300">10%</div>
                      <div className="col-span-2 flex justify-end gap-2">
                         <button className="p-1.5 rounded bg-[#1a1a1a] border border-white/5 hover:bg-white/10 text-gray-400 transition-colors flex items-center gap-1 text-xs">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg> Edit
                        </button>
                        <button className="p-1.5 rounded bg-[#1a1a1a] border border-white/5 hover:bg-white/10 text-gray-400 transition-colors flex items-center gap-1 text-xs">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg> Suspend
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'draws' && <AdminDraws />}
            {activeTab === 'charities' && <AdminCharities />}
            {activeTab === 'winners' && <AdminWinners />}
            {activeTab === 'reports' && <div className="text-gray-400">Advanced reports UI coming soon...</div>}
          </div>
        </div>
      </main>
    </div>
  );
}
