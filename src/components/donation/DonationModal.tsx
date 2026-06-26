import { useState } from 'react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import { Charity } from '../../types';

interface DonationModalProps {
  charity: Charity;
  onClose: () => void;
}

export default function DonationModal({ charity, onClose }: DonationModalProps) {
  const [amount, setAmount] = useState<number | ''>(20);
  const [loading, setLoading] = useState(false);

  const handleDonate = async () => {
    if (!amount || amount < 5) {
      toast.error('Minimum donation is £5');
      return;
    }

    setLoading(true);
    try {
      // Amount in pence
      const res = await api.post('/donations/create', { charityId: charity.id, amountGBP: amount });
      const { url } = res.data.data;
      if (url) {
        window.location.href = url; // Redirect to Stripe Checkout
      } else {
        toast.error('Failed to create donation session');
        setLoading(false);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Donation failed');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 px-4 backdrop-blur-sm">
      <div className="glass-card relative w-full max-w-md p-8 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-text-muted hover:text-white"
        >
          ✕
        </button>

        <div className="mb-6 text-center">
          <div className="mx-auto w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-4 text-2xl border border-border shadow-glow-green">
            ❤️
          </div>
          <h2 className="mb-2 font-display text-2xl font-bold">Donate to {charity.name}</h2>
          <p className="text-sm text-text-muted">100% of your donation goes directly to the charity, securely processed by Stripe.</p>
        </div>

        <div className="mb-6">
          <label className="input-label">Select Amount</label>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[10, 20, 50].map((amt) => (
              <button
                key={amt}
                onClick={() => setAmount(amt)}
                className={`py-3 rounded-xl border text-lg font-semibold transition-all ${
                  amount === amt 
                    ? 'bg-accent-green/10 border-accent-green text-accent-green shadow-glow-green' 
                    : 'bg-surface border-border text-text-muted hover:text-white hover:border-white'
                }`}
              >
                £{amt}
              </button>
            ))}
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">£</span>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value ? parseInt(e.target.value) : '')}
              min="5"
              className="input-field pl-8"
              placeholder="Custom Amount"
            />
          </div>
        </div>

        <button 
          onClick={handleDonate} 
          disabled={loading || !amount || amount < 5} 
          className="btn-green w-full py-4 text-lg"
        >
          {loading ? 'Processing...' : `Donate £${amount || 0}`}
        </button>
      </div>
    </div>
  );
}
