import { useState } from 'react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

interface PlanPickerProps {
  onClose: () => void;
}

export default function PlanPicker({ onClose }: PlanPickerProps) {
  const [loadingPlan, setLoadingPlan] = useState<'monthly' | 'yearly' | null>(null);

  const handleSubscribe = async (planId: 'monthly' | 'yearly') => {
    setLoadingPlan(planId);
    try {
      const res = await api.post('/subscriptions/create', { planId });
      const { url } = res.data.data;
      if (url) {
        window.location.href = url; // Redirect to Stripe Checkout
      } else {
        toast.error('Failed to create checkout session');
        setLoadingPlan(null);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Subscription failed');
      setLoadingPlan(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 px-4 backdrop-blur-sm">
      <div className="glass-card relative w-full max-w-2xl p-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-text-muted hover:text-white"
        >
          ✕
        </button>

        <div className="mb-8 text-center">
          <h2 className="mb-2 font-display text-3xl font-bold">Choose Your Plan</h2>
          <p className="text-text-muted">Unlock score tracking, prize draws, and charity giving.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Monthly Plan */}
          <div className="rounded-xl border border-border bg-surface p-6 transition-transform hover:-translate-y-1">
            <h3 className="mb-2 font-display text-2xl font-bold">Monthly</h3>
            <div className="mb-4 text-3xl font-bold text-accent-green">
              £9.99<span className="text-sm font-normal text-text-muted">/month</span>
            </div>
            <ul className="mb-8 space-y-3 text-sm text-text-muted">
              <li className="flex items-center gap-2">✓ Enter up to 5 scores/month</li>
              <li className="flex items-center gap-2">✓ Automatic prize draw entry</li>
              <li className="flex items-center gap-2">✓ 10%+ goes to your chosen charity</li>
              <li className="flex items-center gap-2">✓ Cancel anytime</li>
            </ul>
            <button
              onClick={() => handleSubscribe('monthly')}
              disabled={loadingPlan !== null}
              className="btn-secondary w-full"
            >
              {loadingPlan === 'monthly' ? 'Redirecting...' : 'Select Monthly'}
            </button>
          </div>

          {/* Yearly Plan */}
          <div className="relative rounded-xl border border-accent-purple bg-surface p-6 shadow-glow-purple transition-transform hover:-translate-y-1">
            <div className="absolute -top-3 right-4 rounded-full bg-accent-purple px-3 py-1 text-xs font-bold text-white shadow-lg">
              SAVE ~17%
            </div>
            <h3 className="mb-2 font-display text-2xl font-bold">Yearly</h3>
            <div className="mb-4 text-3xl font-bold text-accent-purple">
              £99.99<span className="text-sm font-normal text-text-muted">/year</span>
            </div>
            <ul className="mb-8 space-y-3 text-sm text-text-muted">
              <li className="flex items-center gap-2">✓ Enter up to 5 scores/month</li>
              <li className="flex items-center gap-2">✓ Automatic prize draw entry</li>
              <li className="flex items-center gap-2">✓ 10%+ goes to your chosen charity</li>
              <li className="flex items-center gap-2 font-semibold text-white">✓ 2 months free</li>
            </ul>
            <button
              onClick={() => handleSubscribe('yearly')}
              disabled={loadingPlan !== null}
              className="btn-purple w-full"
            >
              {loadingPlan === 'yearly' ? 'Redirecting...' : 'Select Yearly'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
