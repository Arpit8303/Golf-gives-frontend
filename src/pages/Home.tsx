import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-bg px-4 text-center border-b border-border">
          <div className="absolute inset-0 z-0 bg-gradient-dark"></div>
          {/* Animated background elements */}
          <div className="absolute top-1/4 left-1/4 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-green/10 blur-[120px]"></div>
          <div className="absolute bottom-1/4 right-1/4 h-[40rem] w-[40rem] translate-x-1/2 translate-y-1/2 rounded-full bg-accent-purple/10 blur-[150px]"></div>

          <div className="container relative z-10 mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/50 bg-surface px-5 py-2 text-sm font-semibold text-text-muted shadow-lg">
                <span className="text-accent-green">♡</span> Golf that gives back
              </div>
              <h1 className="mb-6 font-display text-5xl font-bold leading-tight md:text-7xl">
                Play golf.<br/>
                Win prizes. <span className="text-white">Support charity.</span>
              </h1>
              <p className="mx-auto mb-12 max-w-2xl text-lg text-text-muted md:text-xl">
                Enter your Stableford scores each month, join the draw, and give a portion of your subscription to a cause you care about.
              </p>
              
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row mb-20">
                <Link to="/register" className="btn-primary w-full sm:w-auto px-8 py-4 text-lg">
                  Subscribe to play
                </Link>
                <Link to="#how-it-works" className="btn-secondary w-full sm:w-auto px-8 py-4 text-lg bg-surface hover:bg-surface/80 border border-border">
                  How it works
                </Link>
              </div>

              {/* Stats Bar */}
              <div className="flex flex-wrap justify-center gap-4 md:gap-12 text-left">
                <div className="glass-card p-6 min-w-[160px] text-center border-border/50">
                  <div className="text-xs text-text-muted mb-2 font-semibold uppercase tracking-wider">Current jackpot</div>
                  <div className="font-display text-4xl font-bold text-accent-green">£4,820</div>
                </div>
                <div className="glass-card p-6 min-w-[160px] text-center border-border/50">
                  <div className="text-xs text-text-muted mb-2 font-semibold uppercase tracking-wider">Active members</div>
                  <div className="font-display text-4xl font-bold text-white">1,204</div>
                </div>
                <div className="glass-card p-6 min-w-[160px] text-center border-border/50">
                  <div className="text-xs text-text-muted mb-2 font-semibold uppercase tracking-wider">Donated to charity</div>
                  <div className="font-display text-4xl font-bold text-accent-purple">£38k</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section (Redesigned) */}
        <section id="how-it-works" className="bg-bg py-24 border-b border-border">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid gap-8 md:grid-cols-3">
              {[
                { step: '1', title: 'Subscribe', desc: 'Choose monthly or yearly. Pick your charity.' },
                { step: '2', title: 'Enter scores', desc: 'Add up to 5 Stableford scores (1-45) per month.' },
                { step: '3', title: 'Win and give', desc: 'Monthly draw picks winners. Charity gets your cut.' }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center group cursor-default">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-surface font-display text-2xl font-bold text-white group-hover:border-accent-purple group-hover:text-accent-purple transition-colors">
                    {item.step}
                  </div>
                  <h3 className="mb-4 font-display text-xl font-bold text-white">{item.title}</h3>
                  <p className="text-text-muted max-w-[250px]">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Prize Pool Breakdown (Matches PRD) */}
            <div className="mt-24 grid gap-6 md:grid-cols-3">
               <div className="glass-card p-8 text-center bg-surface/30">
                 <div className="text-xs text-text-muted uppercase tracking-widest font-semibold mb-4">5-Number Match</div>
                 <div className="text-4xl font-bold text-accent-purple mb-2">40%</div>
                 <div className="text-sm text-text-muted">Jackpot — rolls over</div>
               </div>
               <div className="glass-card p-8 text-center bg-surface/30 border-t-4 border-t-transparent hover:border-t-white transition-all">
                 <div className="text-xs text-text-muted uppercase tracking-widest font-semibold mb-4">4-Number Match</div>
                 <div className="text-4xl font-bold text-white mb-2">35%</div>
                 <div className="text-sm text-text-muted">Pool share</div>
               </div>
               <div className="glass-card p-8 text-center bg-surface/30 border-t-4 border-t-transparent hover:border-t-white transition-all">
                 <div className="text-xs text-text-muted uppercase tracking-widest font-semibold mb-4">3-Number Match</div>
                 <div className="text-4xl font-bold text-white mb-2">25%</div>
                 <div className="text-sm text-text-muted">Pool share</div>
               </div>
            </div>
          </div>
        </section>

        {/* Featured Charities Mini-Section */}
        <section className="py-24 bg-surface/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-green/5 blur-[120px]"></div>
          <div className="container mx-auto px-4 max-w-6xl relative z-10">
            <div className="text-xs text-accent-green uppercase tracking-widest font-semibold mb-8 flex items-center gap-2">
              <span>♡</span> Featured Charities
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
               <div className="glass-card p-6 border-accent-green/30 flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-pointer">
                  <div className="w-12 h-12 rounded-lg bg-surface border border-border flex items-center justify-center text-xl">⛳</div>
                  <div>
                    <h4 className="font-bold">Green Earth Golf</h4>
                    <p className="text-sm text-accent-green">£12,400 raised</p>
                  </div>
               </div>
               <div className="glass-card p-6 flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-pointer">
                  <div className="w-12 h-12 rounded-lg bg-surface border border-border flex items-center justify-center text-xl">🏥</div>
                  <div>
                    <h4 className="font-bold">Fairway Health</h4>
                    <p className="text-sm text-accent-green">£8,700 raised</p>
                  </div>
               </div>
               <div className="glass-card p-6 flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-pointer">
                  <div className="w-12 h-12 rounded-lg bg-surface border border-border flex items-center justify-center text-xl">🏌️</div>
                  <div>
                    <h4 className="font-bold">Golf for Kids</h4>
                    <p className="text-sm text-accent-green">£6,100 raised</p>
                  </div>
               </div>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
