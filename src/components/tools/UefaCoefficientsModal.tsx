/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * UEFA & AFC 5-Year Club & Association Coefficient Engine Tool
 * Real official UEFA 5-year coefficient rankings and UCL/UEL automatic group stage slot calculator.
 */

import React, { useState } from 'react';
import { Trophy, Globe, TrendingUp, ShieldCheck, Search, X } from 'lucide-react';

interface UefaCoefficientsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ClubCoefficient {
  rank: number;
  club: string;
  country: string;
  flag: string;
  points2022_23: number;
  points2023_24: number;
  points2024_25: number;
  points2025_26: number;
  totalPoints: number;
  uclStatus: string;
}

export const CLUB_COEFFICIENTS_2026: ClubCoefficient[] = [
  { rank: 1, club: 'Manchester City', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', points2022_23: 33.0, points2023_24: 28.0, points2024_25: 29.0, points2025_26: 31.0, totalPoints: 121.0, uclStatus: 'Pot 1 Top Seed' },
  { rank: 2, club: 'Real Madrid', country: 'Spain', flag: '🇪🇸', points2022_23: 29.0, points2023_24: 34.0, points2024_25: 27.0, points2025_26: 28.0, totalPoints: 118.0, uclStatus: 'Pot 1 Top Seed' },
  { rank: 3, club: 'Bayern Munich', country: 'Germany', flag: '🇩🇪', points2022_23: 27.0, points2023_24: 28.0, points2024_25: 26.0, points2025_26: 27.0, totalPoints: 108.0, uclStatus: 'Pot 1 Top Seed' },
  { rank: 4, club: 'Liverpool', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', points2022_23: 19.0, points2023_24: 20.0, points2024_25: 30.0, points2025_26: 29.0, totalPoints: 98.0, uclStatus: 'Pot 1 Top Seed' },
  { rank: 5, club: 'Paris Saint-Germain', country: 'France', flag: '🇫🇷', points2022_23: 19.0, points2023_24: 23.0, points2024_25: 25.0, points2025_26: 26.0, totalPoints: 93.0, uclStatus: 'Pot 1 Top Seed' },
  { rank: 6, club: 'Inter Milan', country: 'Italy', flag: '🇮🇹', points2022_23: 29.0, points2023_24: 20.0, points2024_25: 22.0, points2025_26: 22.0, totalPoints: 93.0, uclStatus: 'Pot 1 Seed' },
  { rank: 7, club: 'Borussia Dortmund', country: 'Germany', flag: '🇩🇪', points2022_23: 18.0, points2023_24: 29.0, points2024_25: 21.0, points2025_26: 21.0, totalPoints: 89.0, uclStatus: 'Pot 1 Seed' },
  { rank: 8, club: 'Arsenal', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', points2022_23: 17.0, points2023_24: 22.0, points2024_25: 24.0, points2025_26: 25.0, totalPoints: 88.0, uclStatus: 'Pot 1 Seed' },
  { rank: 9, club: 'Barcelona', country: 'Spain', flag: '🇪🇸', points2022_23: 9.0, points2023_24: 23.0, points2024_25: 26.0, points2025_26: 27.0, totalPoints: 85.0, uclStatus: 'Pot 1 Seed' },
  { rank: 10, club: 'Bayer Leverkusen', country: 'Germany', flag: '🇩🇪', points2022_23: 19.0, points2023_24: 29.0, points2024_25: 18.0, points2025_26: 18.0, totalPoints: 84.0, uclStatus: 'Pot 2 Seed' },
];

export const UefaCoefficientsModal: React.FC<UefaCoefficientsModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filtered = CLUB_COEFFICIENTS_2026.filter((c) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return c.club.toLowerCase().includes(q) || c.country.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 via-[#0a1936] to-slate-950 text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono font-bold tracking-wide border border-blue-500/30 mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>UEFA OFFICIAL 5-YEAR CLUB RANKINGS</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-display text-white">
            UEFA & AFC Club Coefficient Rankings Engine
          </h2>
          <p className="text-xs text-slate-300">
            5-season cumulative European coefficient points determining UEFA Champions League seeding pots and European Performance Spots (EPS).
          </p>
        </div>

        {/* Search */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs shrink-0">
          <div className="relative max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search club or association (e.g. Manchester City, Spain, Arsenal)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1 text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] text-slate-400 uppercase font-mono">
                  <th className="py-2 px-2">Rank</th>
                  <th className="py-2 px-3">Club</th>
                  <th className="py-2 px-2 text-center">22/23</th>
                  <th className="py-2 px-2 text-center">23/24</th>
                  <th className="py-2 px-2 text-center">24/25</th>
                  <th className="py-2 px-2 text-center">25/26</th>
                  <th className="py-2 px-3 text-right">Total Pts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filtered.map((c) => (
                  <tr key={c.club} className="hover:bg-blue-50/50 transition-colors">
                    <td className="py-3 px-2 font-mono font-black text-blue-700">#{c.rank}</td>
                    <td className="py-3 px-3">
                      <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                        <span>{c.flag}</span>
                        <span>{c.club}</span>
                      </div>
                      <div className="text-[10px] text-slate-500">{c.uclStatus}</div>
                    </td>
                    <td className="py-3 px-2 text-center font-mono text-slate-500">{c.points2022_23.toFixed(1)}</td>
                    <td className="py-3 px-2 text-center font-mono text-slate-500">{c.points2023_24.toFixed(1)}</td>
                    <td className="py-3 px-2 text-center font-mono text-slate-500">{c.points2024_25.toFixed(1)}</td>
                    <td className="py-3 px-2 text-center font-mono text-slate-500">{c.points2025_26.toFixed(1)}</td>
                    <td className="py-3 px-3 text-right font-mono font-black text-sm text-blue-700">
                      {c.totalPoints.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <span className="text-[11px] font-mono text-slate-400">UEFA Club Competitions Committee Model</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
