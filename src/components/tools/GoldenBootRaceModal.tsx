/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz European & Global Golden Shoe Race Simulator
 * Real-time top scorer standings, goals per 90, and league coefficient weighting.
 */

import React, { useState } from 'react';
import { Trophy, Award, Target, Flame, ChevronRight, X, Sparkles, Filter } from 'lucide-react';
import { PlayerAvatar } from '../common/PlayerAvatar';

interface GoldenShoeCandidate {
  rank: number;
  name: string;
  playerId: string;
  club: string;
  league: string;
  coefficient: number;
  goals: number;
  assists: number;
  minutesPlayed: number;
  penalties: number;
  points: number;
}

const CANDIDATES: GoldenShoeCandidate[] = [
  {
    rank: 1,
    name: 'Erling Haaland',
    playerId: 'player-haaland',
    club: 'Manchester City',
    league: 'Premier League',
    coefficient: 2.0,
    goals: 10,
    assists: 1,
    minutesPlayed: 630,
    penalties: 1,
    points: 20.0,
  },
  {
    rank: 2,
    name: 'Harry Kane',
    playerId: 'player-kane',
    club: 'Bayern Munich',
    league: 'Bundesliga',
    coefficient: 2.0,
    goals: 8,
    assists: 4,
    minutesPlayed: 540,
    penalties: 2,
    points: 16.0,
  },
  {
    rank: 3,
    name: 'Kylian Mbappé',
    playerId: 'player-mbappe',
    club: 'Real Madrid',
    league: 'La Liga',
    coefficient: 2.0,
    goals: 7,
    assists: 3,
    minutesPlayed: 710,
    penalties: 2,
    points: 14.0,
  },
  {
    rank: 4,
    name: 'Robert Lewandowski',
    playerId: 'player-lewandowski',
    club: 'FC Barcelona',
    league: 'La Liga',
    coefficient: 2.0,
    goals: 7,
    assists: 2,
    minutesPlayed: 680,
    penalties: 1,
    points: 14.0,
  },
  {
    rank: 5,
    name: 'Mohamed Salah',
    playerId: 'player-salah',
    club: 'Liverpool',
    league: 'Premier League',
    coefficient: 2.0,
    goals: 5,
    assists: 4,
    minutesPlayed: 630,
    penalties: 1,
    points: 10.0,
  },
  {
    rank: 6,
    name: 'Dimitri Petratos',
    playerId: 'player-petratos',
    club: 'Mohun Bagan SG',
    league: 'Indian Super League',
    coefficient: 1.5,
    goals: 4,
    assists: 3,
    minutesPlayed: 450,
    penalties: 1,
    points: 6.0,
  },
  {
    rank: 7,
    name: 'Sunil Chhetri',
    playerId: 'player-chhetri',
    club: 'Bengaluru FC',
    league: 'Indian Super League',
    coefficient: 1.5,
    goals: 3,
    assists: 1,
    minutesPlayed: 390,
    penalties: 1,
    points: 4.5,
  },
];

export const GoldenBootRaceModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [filterLeague, setFilterLeague] = useState<string>('ALL');

  if (!isOpen) return null;

  const filtered = CANDIDATES.filter((c) =>
    filterLeague === 'ALL' ? true : c.league.toLowerCase().includes(filterLeague.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-mono font-bold tracking-wide">
            <Trophy className="w-3.5 h-3.5 text-amber-200" />
            <span>GLOBAL TOP SCORER RADAR</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-display mt-2 text-white">
            Golden Shoe & League Top Scorers Race
          </h2>
          <p className="text-xs text-amber-100 mt-1">
            UEFA & Domestic coefficient weighted scoring tracker for Europe and Indian Super League.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 p-3 bg-slate-50 border-b border-slate-200 text-xs overflow-x-auto no-scrollbar">
          {['ALL', 'Premier League', 'La Liga', 'Bundesliga', 'Indian Super League'].map((lg) => (
            <button
              key={lg}
              onClick={() => setFilterLeague(lg)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                filterLeague === lg
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {lg === 'ALL' ? '🌐 All Leagues' : lg}
            </button>
          ))}
        </div>

        {/* Table Content */}
        <div className="p-4 overflow-y-auto space-y-2.5 max-h-[60vh]">
          {filtered.map((player) => {
            const goalsPer90 = ((player.goals / player.minutesPlayed) * 90).toFixed(2);
            return (
              <div
                key={player.playerId}
                className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-amber-400 transition-all flex items-center justify-between gap-4 shadow-2xs group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                      player.rank === 1
                        ? 'bg-amber-400 text-slate-950 font-mono shadow-xs'
                        : player.rank === 2
                        ? 'bg-slate-200 text-slate-800 font-mono'
                        : player.rank === 3
                        ? 'bg-amber-700/20 text-amber-900 font-mono'
                        : 'bg-slate-100 text-slate-500 font-mono'
                    }`}
                  >
                    #{player.rank}
                  </div>

                  <PlayerAvatar
                    id={player.playerId}
                    name={player.name}
                    className="w-10 h-10 shrink-0"
                  />

                  <div className="min-w-0">
                    <div className="font-extrabold text-sm text-slate-900 truncate flex items-center gap-1.5">
                      <span>{player.name}</span>
                      {player.rank === 1 && (
                        <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          Leader
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {player.club} · {player.league}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right shrink-0">
                  <div className="hidden sm:block">
                    <div className="text-xs font-mono font-bold text-slate-700">{goalsPer90}</div>
                    <div className="text-[10px] text-slate-400">G/90 mins</div>
                  </div>

                  <div>
                    <div className="text-base font-black font-mono text-amber-600">
                      {player.goals} ⚽
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {player.points} pts (x{player.coefficient})
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Points = Goals × League Coefficient factor (Top 5 UEFA: 2.0, ISL/Others: 1.5)</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
