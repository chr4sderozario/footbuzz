/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Historic Trophy Room & Ballon d'Or Hall of Fame
 * Interactive museum of Ballon d'Or, European Golden Shoe & World Cup Golden Ball winners.
 */

import React, { useState } from 'react';
import { Trophy, Award, Star, X, Search, Sparkles, Filter } from 'lucide-react';
import { PlayerAvatar } from '../common/PlayerAvatar';

interface TrophyRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AwardWinner {
  year: number;
  winner: string;
  club: string;
  country: string;
  goalsOrStat: string;
  runnerUp: string;
  historicalNote: string;
  playerId?: string;
}

const BALLON_DOR_WINNERS: AwardWinner[] = [
  {
    year: 2024,
    winner: 'Rodrigo Hernández (Rodri)',
    club: 'Manchester City',
    country: 'Spain',
    goalsOrStat: 'Euro 2024 MVP, Premier League Champion, 1 Loss in 64 Games',
    runnerUp: 'Vinícius Júnior (Real Madrid)',
    historicalNote: 'First defensive midfielder to win the Ballon d\'Or since Lothar Matthäus (1990) and first Spanish winner since Luis Suárez (1960).',
    playerId: 'player-rodri',
  },
  {
    year: 2023,
    winner: 'Lionel Messi',
    club: 'Inter Miami / PSG',
    country: 'Argentina',
    goalsOrStat: 'FIFA World Cup Champion, World Cup Golden Ball, 7 Goals & 3 Assists',
    runnerUp: 'Erling Haaland (Manchester City)',
    historicalNote: 'Messi extended his immortal record to 8 Ballon d\'Or titles, spanning 2009 to 2023.',
    playerId: 'player-messi',
  },
  {
    year: 2022,
    winner: 'Karim Benzema',
    club: 'Real Madrid',
    country: 'France',
    goalsOrStat: '44 Goals in 46 Matches, UEFA Champions League & La Liga Winner',
    runnerUp: 'Sadio Mané (Liverpool)',
    historicalNote: 'Oldest first-time winner since Stanley Matthews in 1956 at age 34.',
  },
  {
    year: 2021,
    winner: 'Lionel Messi',
    club: 'Barcelona / PSG',
    country: 'Argentina',
    goalsOrStat: 'Copa América Champion & Best Player, Copa del Rey Winner',
    runnerUp: 'Robert Lewandowski (Bayern Munich)',
    historicalNote: 'Secured his 7th Ballon d\'Or after leading Argentina to their first international trophy in 28 years.',
    playerId: 'player-messi',
  },
  {
    year: 2019,
    winner: 'Lionel Messi',
    club: 'FC Barcelona',
    country: 'Argentina',
    goalsOrStat: '51 Goals, European Golden Shoe, La Liga Champion',
    runnerUp: 'Virgil van Dijk (Liverpool)',
    historicalNote: 'Won by a historic razor-thin margin of just 7 voting points over Virgil van Dijk.',
    playerId: 'player-messi',
  },
  {
    year: 2018,
    winner: 'Luka Modrić',
    club: 'Real Madrid',
    country: 'Croatia',
    goalsOrStat: 'FIFA World Cup Golden Ball, Champions League Winner',
    runnerUp: 'Cristiano Ronaldo (Real Madrid)',
    historicalNote: 'Ended the historic 10-year Messi–Ronaldo duopoly (2008–2017).',
  },
  {
    year: 2017,
    winner: 'Cristiano Ronaldo',
    club: 'Real Madrid',
    country: 'Portugal',
    goalsOrStat: 'Champions League & La Liga Double, 42 Goals',
    runnerUp: 'Lionel Messi (Barcelona)',
    historicalNote: 'Secured his 5th Ballon d\'Or, equalizing Messi at 5–5 in their legendary rivalry.',
    playerId: 'player-ronaldo',
  },
  {
    year: 2016,
    winner: 'Cristiano Ronaldo',
    club: 'Real Madrid',
    country: 'Portugal',
    goalsOrStat: 'UEFA Euro 2016 Champion, UEFA Champions League Winner, 51 Goals',
    runnerUp: 'Lionel Messi (Barcelona)',
    historicalNote: 'Captained Portugal to their historic first major international championship.',
    playerId: 'player-ronaldo',
  },
  {
    year: 2015,
    winner: 'Lionel Messi',
    club: 'FC Barcelona',
    country: 'Argentina',
    goalsOrStat: 'Continental Treble (UCL, La Liga, Copa del Rey), 52 Goals',
    runnerUp: 'Cristiano Ronaldo (Real Madrid)',
    historicalNote: 'Orchestrated the legendary "MSN" (Messi, Suárez, Neymar) attacking trident.',
    playerId: 'player-messi',
  },
  {
    year: 2014,
    winner: 'Cristiano Ronaldo',
    club: 'Real Madrid',
    country: 'Portugal',
    goalsOrStat: 'La Décima (10th UCL Title), Record 17 Champions League Goals',
    runnerUp: 'Lionel Messi (Barcelona)',
    historicalNote: 'Set the all-time single-season UEFA Champions League scoring record (17 goals).',
    playerId: 'player-ronaldo',
  },
  {
    year: 2008,
    winner: 'Cristiano Ronaldo',
    club: 'Manchester United',
    country: 'Portugal',
    goalsOrStat: 'Premier League & Champions League Double, 42 Goals',
    runnerUp: 'Lionel Messi (Barcelona)',
    historicalNote: 'The start of the 15-year era of dominance between Ronaldo and Messi.',
    playerId: 'player-ronaldo',
  },
  {
    year: 2007,
    winner: 'Kaká',
    club: 'AC Milan',
    country: 'Brazil',
    goalsOrStat: 'UEFA Champions League Winner & Top Scorer (10 Goals)',
    runnerUp: 'Cristiano Ronaldo (Manchester United)',
    historicalNote: 'The last player to win the award before the Messi–Ronaldo dynasty began.',
  },
];

export const TrophyRoomModal: React.FC<TrophyRoomModalProps> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = BALLON_DOR_WINNERS.filter(
    (w) =>
      w.winner.toLowerCase().includes(search.toLowerCase()) ||
      w.club.toLowerCase().includes(search.toLowerCase()) ||
      w.country.toLowerCase().includes(search.toLowerCase()) ||
      w.year.toString().includes(search)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950 via-[#785918] to-[#d4af37] text-white p-6 relative shrink-0 space-y-2">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 text-amber-200 text-xs font-mono font-bold tracking-wide">
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            <span>HALL OF FAME & TROPHY ROOM</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-display text-white">
            Ballon d'Or & Golden Roll (1956–Present)
          </h2>

          <p className="text-xs text-amber-100/90 leading-relaxed">
            The definitive record of football's supreme individual honor awarded by France Football.
          </p>
        </div>

        {/* Search */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by winner, club (Real Madrid, Barcelona), or year..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-hidden"
          />
        </div>

        {/* List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {filtered.map((item) => (
            <div
              key={item.year}
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all space-y-2 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black font-mono flex items-center justify-center text-sm shadow-md shrink-0">
                    {item.year}
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-slate-900 group-hover:text-amber-600 transition-colors flex items-center gap-1.5">
                      <span>{item.winner}</span>
                    </h3>
                    <div className="text-xs text-slate-500 font-semibold mt-0.5">
                      {item.club} · {item.country}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Runner-Up</span>
                  <div className="text-xs font-bold text-slate-700">{item.runnerUp}</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs text-slate-700">
                <strong>Key Campaign: </strong>
                <span>{item.goalsOrStat}</span>
              </div>

              <div className="text-[11px] text-slate-500 italic">
                {item.historicalNote}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Official Ballon d'Or Records</span>
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
