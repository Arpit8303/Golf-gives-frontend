import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../lib/axios';
import { Charity } from '../types';
import DonationModal from '../components/donation/DonationModal';

export default function CharityProfile() {
  const { id } = useParams<{ id: string }>();
  const [charity, setCharity] = useState<Charity | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDonationModal, setShowDonationModal] = useState(false);

  useEffect(() => {
    const fetchCharity = async () => {
      try {
        const res = await api.get(`/charities/${id}`);
        setCharity(res.data.data.charity);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCharity();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container py-12 flex justify-center items-center h-[60vh]">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-surface border-t-accent-green"></div>
        </div>
      </>
    );
  }

  if (!charity) {
    return (
      <>
        <Navbar />
        <div className="container py-12 text-center">
          <h1 className="text-3xl font-bold text-error mb-4">Charity Not Found</h1>
          <Link to="/charities" className="btn-primary">Back to Charities</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container py-12 max-w-5xl">
        <Link to="/charities" className="text-text-muted hover:text-white mb-6 inline-flex items-center gap-2 text-sm font-semibold transition-colors">
          ← Back to Charities
        </Link>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="glass-card overflow-hidden mb-8">
              <div className="h-64 w-full bg-surface border-b border-border">
                {charity.image_url ? (
                  <img src={charity.image_url} alt={charity.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-text-muted font-display text-2xl">
                    {charity.name}
                  </div>
                )}
              </div>
              <div className="p-8">
                <h1 className="font-display text-4xl font-bold mb-4">{charity.name}</h1>
                <div className="prose prose-invert max-w-none text-text-muted">
                  <p className="whitespace-pre-wrap leading-relaxed">{charity.description}</p>
                </div>
              </div>
            </div>

            {/* Event Timeline (JSONB) */}
            <div className="glass-card p-8">
              <h2 className="font-display text-2xl font-bold mb-6">Upcoming Events</h2>
              {charity.events && charity.events.length > 0 ? (
                <div className="relative border-l-2 border-border ml-3 space-y-8">
                  {charity.events.map((event, idx) => (
                    <div key={idx} className="relative pl-8">
                      <div className="absolute -left-2.5 mt-1.5 h-5 w-5 rounded-full bg-surface border-4 border-accent-purple shadow-glow-purple"></div>
                      <div className="text-xs font-semibold text-accent-purple mb-1">{new Date(event.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                      <h3 className="text-lg font-bold mb-1">{event.title}</h3>
                      <div className="text-sm text-text-muted mb-2 flex items-center gap-2">
                        <span>📍</span> {event.location}
                      </div>
                      <p className="text-sm text-text-muted">{event.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-text-muted bg-surface/50 rounded-xl border border-dashed border-border/50">
                  No upcoming events scheduled at this time.
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="glass-card p-6 sticky top-24">
              <h3 className="font-display text-xl font-bold mb-4">Support This Cause</h3>
              <p className="text-sm text-text-muted mb-6">
                You can support {charity.name} directly through a one-off donation, or by selecting them as your designated charity in your active subscription.
              </p>
              <button onClick={() => setShowDonationModal(true)} className="btn-green w-full mb-4">
                Donate Now
              </button>
              <button className="btn-secondary w-full">
                Select for Subscription
              </button>
            </div>
          </div>
        </div>
      </main>

      {showDonationModal && (
        <DonationModal charity={charity} onClose={() => setShowDonationModal(false)} />
      )}
    </>
  );
}
