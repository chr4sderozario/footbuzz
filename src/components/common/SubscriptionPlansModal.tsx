/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Premium Subscriptions Modal (Plus · Pro · Max)
 * Features official plans comparison, pricing teaser, and waitlist reminder trigger.
 */

import React, { useState } from 'react';
import {
  X,
  Crown,
  Check,
  Sparkles,
  Zap,
  Shield,
  Bell,
  Star,
  Tv,
  Activity,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SubscriptionPlansModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { addToast } = useApp();
  const [selectedPlan, setSelectedPlan] = useState<'PLUS' | 'PRO' | 'MAX'>('PRO');
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleNotifyMe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail.trim()) return;
    setIsSubmitted(true);
    addToast(
      'Priority Waitlist Confirmed! 🚀',
      `You're on the list for FootBuzz ${selectedPlan} with 30-day free launch perks.`,
      'SUCCESS'
    );
    setTimeout(() => {
      onClose();
      setIsSubmitted(false);
      setWaitlistEmail('');
    }, 1800);
  };

  const plans = [
    {
      id: 'PLUS',
      name: 'FootBuzz Plus',
      badge: 'FAN FAVORITE',
      price: '$2.99 / mo',
      headline: 'Pure Ad-Free Matchday Experience',
      color: 'from-emerald-500 to-teal-600',
      border: 'border-emerald-500/40',
      perks: [
        '100% Ad-free live score updates',
        'Unlimited match kickoff & goal push alerts',
        'HD audio commentary for top European & ISL derbies',
        'Custom favorite teams & players tracking widget',
        'Offline match schedule & league tables cache',
      ],
    },
    {
      id: 'PRO',
      name: 'FootBuzz Pro',
      badge: 'RECOMMENDED · POPULAR',
      price: '$6.99 / mo',
      headline: 'Tactical Command & xG Analytics Suite',
      color: 'from-amber-400 via-amber-500 to-orange-500',
      border: 'border-amber-400',
      popular: true,
      perks: [
        'Everything in Plus',
        'Real-time xG shot maps & momentum swing gauges',
        'Interactive 22-player tactical pitch chalkboard',
        '30-year Head-to-Head deep statistical archives',
        'Verified referee radar & VAR offside breakdown',
        'Instant verified YouTube match highlights sync',
      ],
    },
    {
      id: 'MAX',
      name: 'FootBuzz Max',
      badge: 'ELITE ACCESS',
      price: '$12.99 / mo',
      headline: 'Unlimited FootAI & Multi-Screen Radar',
      color: 'from-purple-500 via-indigo-500 to-blue-600',
      border: 'border-purple-500/40',
      perks: [
        'Everything in Pro & Plus',
        'Unlimited FootAI tactical analyst conversations',
        'Multi-screen live dashboard (monitor 6 games at once)',
        'Full match replay links & post-game tactical verdicts',
        'Early-bird ticketing alerts for World Cup 2026 & UCL Finals',
        'VIP Ballon d’Or & Transfer telemetry projections',
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-950 via-[#072418] to-slate-950 text-white p-5 sm:p-7 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[11px] font-mono font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>PREVIEW · COMING SOON</span>
          </div>

          <h2 className="text-xl sm:text-3xl font-black font-display text-white tracking-tight">
            FootBuzz <span className="text-amber-400">Plus</span> · <span className="text-emerald-400">Pro</span> · <span className="text-purple-400">Max</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Upgrade your football universe with tactical pitch tracking, ad-free live commentary, xG analytics, and unlimited FootAI intelligence.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto no-scrollbar space-y-6">
          {/* Plan Selector Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {plans.map((p) => {
              const isSelected = selectedPlan === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPlan(p.id as any)}
                  className={`relative rounded-2xl p-4 sm:p-5 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? `${p.border} bg-slate-50/80 shadow-md ring-2 ring-emerald-500/20`
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {p.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-xs whitespace-nowrap">
                      Most Popular
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-black text-base sm:text-lg text-slate-900">
                        {p.name}
                      </span>
                      <Crown className={`w-4 h-4 ${isSelected ? 'text-amber-500' : 'text-slate-400'}`} />
                    </div>

                    <div className="font-mono text-lg sm:text-xl font-black text-[#009270]">
                      {p.price}
                    </div>

                    <p className="text-[11px] font-semibold text-slate-500 leading-snug">
                      {p.headline}
                    </p>

                    <ul className="pt-2 space-y-1.5 text-xs text-slate-700">
                      {p.perks.map((perk, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px] leading-tight">
                          <Check className="w-3.5 h-3.5 text-[#009270] shrink-0 mt-0.5" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 mt-2 border-t border-slate-100">
                    <span
                      className={`w-full py-1.5 rounded-xl text-xs font-black flex items-center justify-center gap-1 transition-colors ${
                        isSelected
                          ? 'bg-[#009270] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isSelected ? 'Selected Tier' : 'Choose Plan'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Waitlist Teaser Form */}
          <div className="bg-gradient-to-br from-slate-900 to-[#04281f] text-white rounded-2xl p-5 border border-emerald-500/30 space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                Early Access
              </span>
              <span className="text-xs font-bold text-emerald-200">
                Get 30 days free when Plus, Pro & Max launch!
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-black font-display text-white">
              Join the FootBuzz Priority Launch Waitlist
            </h3>

            <form onSubmit={handleNotifyMe} className="flex flex-col sm:flex-row gap-2 pt-1">
              <input
                type="email"
                required
                placeholder="Enter your email for launch perks (e.g. supporter@gmail.com)..."
                value={waitlistEmail}
                onChange={(e) => setWaitlistEmail(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950/80 border border-emerald-500/40 text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-amber-400"
              />
              <button
                type="submit"
                disabled={isSubmitted}
                className="px-5 py-2.5 rounded-xl bg-[#009270] hover:bg-[#028060] text-white font-black text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>{isSubmitted ? 'Confirmed ✓' : 'Notify Me on Launch'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
