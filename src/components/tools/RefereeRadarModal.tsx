/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Referee & VAR Strictness Radar
 * Official officiating analytics: Yellow/Red cards per match, penalty frequency, and VAR review statistics.
 */

import React, { useState } from 'react';
import { Shield, AlertTriangle, Eye, X, Search, CheckCircle2, TrendingUp } from 'lucide-react';

interface RefereeRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RefereeProfile {
  id: string;
  name: string;
  nationality: string;
  league: string;
  matchesOfficiated: number;
  yellowCardsPerMatch: number;
  redCardsPerMatch: number;
  penaltiesPerMatch: number;
  varReviewRate: string; // e.g. "0.38 per game"
  strictnessIndex: number; // 0 to 10
  notableMatches: string[];
}

const REFEREE_DATA: RefereeProfile[] = [
  {
    id: 'ref-szymon',
    name: 'Szymon Marciniak',
    nationality: 'Poland',
    league: 'UEFA Champions League & FIFA Elite',
    matchesOfficiated: 44,
    yellowCardsPerMatch: 3.9,
    redCardsPerMatch: 0.12,
    penaltiesPerMatch: 0.32,
    varReviewRate: '0.22 per match',
    strictnessIndex: 7.2,
    notableMatches: ['2022 FIFA World Cup Final', '2023 UEFA Champions League Final'],
  },
  {
    id: 'ref-oliver',
    name: 'Michael Oliver',
    nationality: 'England',
    league: 'Premier League & UEFA',
    matchesOfficiated: 38,
    yellowCardsPerMatch: 4.2,
    redCardsPerMatch: 0.16,
    penaltiesPerMatch: 0.38,
    varReviewRate: '0.41 per match',
    strictnessIndex: 8.4,
    notableMatches: ['Arsenal vs Manchester City', 'UEFA Euro 2024 Quarter-Final'],
  },
  {
    id: 'ref-turpin',
    name: 'Clément Turpin',
    nationality: 'France',
    league: 'UEFA & Ligue 1',
    matchesOfficiated: 36,
    yellowCardsPerMatch: 3.6,
    redCardsPerMatch: 0.08,
    penaltiesPerMatch: 0.28,
    varReviewRate: '0.19 per match',
    strictnessIndex: 6.8,
    notableMatches: ['2022 UEFA Champions League Final', 'Bayern Munich vs Real Madrid'],
  },
  {
    id: 'ref-isl-venkatesh',
    name: 'R. Venkatesh',
    nationality: 'India',
    league: 'Indian Super League (ISL) & AFC',
    matchesOfficiated: 24,
    yellowCardsPerMatch: 4.6,
    redCardsPerMatch: 0.21,
    penaltiesPerMatch: 0.42,
    varReviewRate: 'Non-VAR (Pitch Referee Authority)',
    strictnessIndex: 8.9,
    notableMatches: ['ISL Kolkata Derby 2024', 'ISL Semi-Final Mohun Bagan vs Odisha'],
  },
];

export const RefereeRadarModal: React.FC<RefereeRadarModalProps> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = REFEREE_DATA.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.league.toLowerCase().includes(search.toLowerCase()) ||
      r.nationality.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-[#1c2842] to-[#2563eb] text-white p-6 relative shrink-0 space-y-2">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-mono font-bold tracking-wide">
            <Eye className="w-3.5 h-3.5" />
            <span>OFFICIATING & VAR RADAR</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-display text-white">
            Referee & VAR Strictness Radar
          </h2>

          <p className="text-xs text-blue-100/90 leading-relaxed">
            Analytics on match discipline, card distributions, penalty tendencies, and VAR overturn frequency.
          </p>
        </div>

        {/* Search */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by referee name, country, or league..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-hidden"
          />
        </div>

        {/* List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {filtered.map((ref) => (
            <div
              key={ref.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">{ref.name}</h3>
                  <div className="text-xs text-slate-500 font-medium">
                    {ref.nationality} · {ref.league}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Strictness Index</span>
                  <div className="text-lg font-black font-mono text-blue-600">
                    {ref.strictnessIndex} <span className="text-xs font-normal text-slate-400">/ 10</span>
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400">Yellows / Game</div>
                  <div className="font-mono font-black text-amber-600">{ref.yellowCardsPerMatch}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400">Reds / Game</div>
                  <div className="font-mono font-black text-rose-600">{ref.redCardsPerMatch}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400">Pens / Game</div>
                  <div className="font-mono font-black text-slate-900">{ref.penaltiesPerMatch}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400">VAR Rate</div>
                  <div className="font-mono font-black text-purple-600 text-[11px] truncate">
                    {ref.varReviewRate}
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex items-center gap-1.5 truncate">
                <span className="font-bold text-slate-700">Notable Games:</span>
                <span>{ref.notableMatches.join(' · ')}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Official Match Regulatory Feed</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
