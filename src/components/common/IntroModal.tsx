/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Welcome, League Onboarding & "Pick Your 5" Priority Matches
 */

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Trophy,
  Globe,
  Flame,
  CheckCircle2,
  ArrowRight,
  Shield,
  Calendar,
  Layers,
  Search,
  Pin,
  Clock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { footballApi } from '../../services/footballApi';
import { ClubCrest } from './ClubCrest';
import { CompetitionBadge } from './CompetitionBadge';

export const IntroModal: React.FC = () => {
  const {
    introModalOpen,
    setIntroModalOpen,
    selectedLeagueFilter,
    setSelectedLeagueFilter,
    picked5MatchIds,
    togglePick5Match,
    navigateTo,
  } = useApp();

  const [activeStep, setActiveStep] = useState<1 | 2>(1);
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>(['comp-isl', 'comp-ucl', 'fifa-friendly', 'comp-pl']);

  const upcomingMatches = footballApi.getAllMatches().slice(0, 6);

  if (!introModalOpen) return null;

  const handleClose = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('footbuzz_intro_seen', 'true');
    }
    setIntroModalOpen(false);
  };

  const handleLeagueToggle = (leagueId: string) => {
    setSelectedLeagues((prev) =>
      prev.includes(leagueId) ? prev.filter((id) => id !== leagueId) : [...prev, leagueId]
    );
  };

  const handleComplete = (targetLeague?: string) => {
    if (targetLeague) {
      setSelectedLeagueFilter(targetLeague);
    } else if (selectedLeagues.length > 0) {
      setSelectedLeagueFilter(selectedLeagues[0]);
    }
    handleClose();
    navigateTo('home');
  };

  const supportedLeagues = [
    {
      id: 'comp-isl',
      name: 'Indian Super League (ISL)',
      flag: '🇮🇳',
      category: 'Domestic Glory',
      badge: 'Featured',
    },
    {
      id: 'fifa-friendly',
      name: 'International Friendlies & FIFA',
      flag: '🌍',
      category: 'Global Marquee',
      badge: 'High Stakes',
    },
    {
      id: 'comp-ucl',
      name: 'UEFA Champions League',
      flag: '🏆',
      category: 'European Elite',
      badge: 'Must Watch',
    },
    {
      id: 'comp-pl',
      name: 'English Premier League',
      flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      category: 'Top Tier',
      badge: 'Popular',
    },
    {
      id: 'comp-laliga',
      name: 'La Liga EA SPORTS',
      flag: '🇪🇸',
      category: 'Spanish Passion',
      badge: 'Clásico Power',
    },
    {
      id: 'comp-seriea',
      name: 'Italian Serie A',
      flag: '🇮🇹',
      category: 'Tactical Masterclass',
      badge: 'Scudetto',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Top Visual Banner */}
        <div className="relative bg-gradient-to-br from-[#009270] via-[#028060] to-[#090d16] text-white p-6 sm:p-8 space-y-3 shrink-0">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-black uppercase tracking-wider font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Step {activeStep} of 2 · Welcome to FootBuzz</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveStep(1)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  activeStep === 1 ? 'w-6 bg-amber-400' : 'bg-white/40'
                }`}
              />
              <button
                onClick={() => setActiveStep(2)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  activeStep === 2 ? 'w-6 bg-amber-400' : 'bg-white/40'
                }`}
              />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight leading-snug">
            {activeStep === 1
              ? 'Everything Football. One Place.'
              : 'Pick 5 Priority Matches to Track'}
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-lg">
            {activeStep === 1
              ? 'Select the leagues you care about most — from Indian Super League (ISL) blockbusters to International Friendlies and UEFA Champions League clashes.'
              : 'Pin up to 5 real upcoming fixtures to your personalized homepage watchlist for instant live tracking.'}
          </p>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {activeStep === 1 ? (
            <>
              {/* Feature Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm">
                    🇮🇳
                  </div>
                  <div className="font-extrabold text-xs text-slate-900">ISL Spotlight</div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Featured coverage of Indian Super League rivalries and clubs.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#009270] flex items-center justify-center font-bold text-sm">
                    🌍
                  </div>
                  <div className="font-extrabold text-xs text-slate-900">Intl Friendlies</div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Marquee international clashes and global heavyweight derbies.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                    ⚡
                  </div>
                  <div className="font-extrabold text-xs text-slate-900">Interactive Lineups</div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Card flip stats, player comparison, and animated pitch views.
                  </p>
                </div>
              </div>

              {/* League Selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 font-display flex items-center gap-1.5">
                      <Trophy className="w-4 h-4 text-[#009270]" /> Select Leagues You Want to Follow
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Tap to customize your primary football experience:
                    </p>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-400">
                    {selectedLeagues.length} Selected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {supportedLeagues.map((lg) => {
                    const isSelected = selectedLeagues.includes(lg.id);
                    return (
                      <div
                        key={lg.id}
                        onClick={() => handleLeagueToggle(lg.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 select-none ${
                          isSelected
                            ? 'bg-emerald-50/80 border-[#009270] ring-1 ring-[#009270] shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <CompetitionBadge id={lg.id} name={lg.name} size="sm" />
                          <div className="min-w-0">
                            <div className="font-bold text-xs text-slate-900 truncate">
                              {lg.name}
                            </div>
                            <div className="text-[10px] text-slate-500 font-medium">
                              {lg.category}
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-1.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            {lg.badge}
                          </span>
                          <CheckCircle2
                            className={`w-4 h-4 transition-colors ${
                              isSelected ? 'text-[#009270] fill-emerald-100' : 'text-slate-300'
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            /* STEP 2: "PICK YOUR 5" PRIORITY MATCHES */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900 font-display flex items-center gap-1.5">
                    <Pin className="w-4 h-4 text-amber-500" /> Pin Priority Matches ({picked5MatchIds.length}/5)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select up to 5 real upcoming fixtures to pin to "Your Football" hub:
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {upcomingMatches.map((match) => {
                  const isPinned = picked5MatchIds.includes(match.id);
                  return (
                    <div
                      key={`pick-modal-${match.id}`}
                      onClick={() => togglePick5Match(match.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isPinned
                          ? 'bg-amber-50/70 border-amber-400 ring-1 ring-amber-400 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <ClubCrest name={match.homeTeam.name} code={match.homeTeam.code} crestUrl={match.homeTeam.crestUrl} size="xs" />
                          <span className="font-bold text-xs text-slate-900 truncate max-w-[90px] sm:max-w-[120px]">{match.homeTeam.shortName}</span>
                        </div>
                        <span className="text-xs font-mono text-slate-400 font-bold">vs</span>
                        <div className="flex items-center gap-1.5">
                          <ClubCrest name={match.awayTeam.name} code={match.awayTeam.code} crestUrl={match.awayTeam.crestUrl} size="xs" />
                          <span className="font-bold text-xs text-slate-900 truncate max-w-[90px] sm:max-w-[120px]">{match.awayTeam.shortName}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[11px] font-mono text-slate-500 font-bold">
                          {match.time}
                        </span>
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
                            isPinned
                              ? 'bg-amber-500 text-slate-950 font-black'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          <Pin className="w-3 h-3" />
                          <span>{isPinned ? 'Pinned' : 'Pin'}</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          {activeStep === 1 ? (
            <>
              <button
                onClick={handleClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Skip for now
              </button>

              <button
                onClick={() => setActiveStep(2)}
                className="px-6 py-2.5 rounded-xl bg-[#009270] hover:bg-[#028060] text-white text-xs font-black transition-all shadow-md flex items-center gap-2"
              >
                <span>Continue to Pick Your 5 Matches</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveStep(1)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
              >
                ← Back to Leagues
              </button>

              <button
                onClick={() => handleComplete()}
                className="px-6 py-2.5 rounded-xl bg-[#009270] hover:bg-[#028060] text-white text-xs font-black transition-all shadow-md flex items-center gap-2"
              >
                <span>Enter FootBuzz Command Centre</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
