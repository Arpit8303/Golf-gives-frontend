import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [platformFee, setPlatformFee] = useState(15);
  const [emailAlerts, setEmailAlerts] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // For the internship demo, we just simulate saving to backend
    toast.success('System settings saved successfully');
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="bg-surface border border-border p-6 rounded-xl">
        <h3 className="font-display text-lg font-bold mb-6">System Settings</h3>
        
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Maintenance Mode Toggle */}
          <div className="flex items-center justify-between p-4 bg-[#1a1a1a] border border-white/5 rounded-lg">
            <div>
              <h4 className="font-semibold">Maintenance Mode</h4>
              <p className="text-sm text-gray-500">Disable user access to the platform (Admin only)</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
            </label>
          </div>

          {/* Email Alerts Toggle */}
          <div className="flex items-center justify-between p-4 bg-[#1a1a1a] border border-white/5 rounded-lg">
            <div>
              <h4 className="font-semibold">Email Notifications</h4>
              <p className="text-sm text-gray-500">Send automated emails for draws and payouts</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>

          {/* Platform Fee */}
          <div className="p-4 bg-[#1a1a1a] border border-white/5 rounded-lg">
            <h4 className="font-semibold mb-2">Platform Operational Fee (%)</h4>
            <p className="text-sm text-gray-500 mb-4">Percentage deducted from gross pool before splits</p>
            <input 
              type="number" 
              value={platformFee}
              onChange={(e) => setPlatformFee(Number(e.target.value))}
              className="bg-[#121212] border border-white/10 rounded-lg px-4 py-2 w-full focus:outline-none focus:border-purple-500"
              min="0"
              max="100"
            />
          </div>

          <div className="pt-4 border-t border-white/5">
            <button type="submit" className="btn-primary w-full sm:w-auto px-8">
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
