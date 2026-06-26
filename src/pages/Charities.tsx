import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../lib/axios';
import { Charity } from '../types';

export default function Charities() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const res = await api.get('/charities');
        setCharities(res.data.data.charities);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCharities();
  }, []);

  return (
    <>
      <Navbar />
      <main className="container py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 font-display text-4xl font-bold">Our Charity Partners</h1>
          <p className="mx-auto max-w-2xl text-text-muted">
            Choose where your impact goes. A minimum of 10% of every subscription directly funds these incredible causes.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="skeleton h-80 w-full"></div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {charities.map((charity) => (
              <div key={charity.id} className="glass-card flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-glow-green">
                <div className="h-48 w-full bg-surface">
                  {charity.image_url ? (
                    <img src={charity.image_url} alt={charity.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-border text-text-muted">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="mb-2 font-display text-xl font-bold">{charity.name}</h3>
                  <p className="mb-6 line-clamp-3 text-sm text-text-muted">{charity.description}</p>
                  <div className="mt-auto flex items-center justify-between">
                    {charity.is_featured ? <span className="badge badge-green">Featured Partner</span> : <span></span>}
                    <Link to={`/charities/${charity.id}`} className="btn-secondary py-2 text-sm">View Profile</Link>
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
