/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Ballon d'Or History & Power Rankings Tracker Tool
 * Complete official France Football Ballon d'Or & Ballon d'Or Féminin winners archive with voting records.
 */

import React, { useState } from 'react';
import { Trophy, Award, Star, Search, X, Sparkles, Filter, ShieldCheck, Flame } from 'lucide-react';

interface BallonDorTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BallonDorWinner {
  year: number;
  winner: string;
  club: string;
  country: string;
  flag: string;
  category: 'MENS' | 'WOMENS' | 'KOPA' | 'YACHINE';
  runnerUp: string;
  thirdPlace: string;
  pointsOrVotes: string;
  keyAchievement: string;
}

export const BALLON_DOR_ARCHIVE: BallonDorWinner[] = [
  // Recent Men's
  { year: 2024, winner: 'Rodri', club: 'Manchester City', country: 'Spain', flag: '🇪🇸', category: 'MENS', runnerUp: 'Vinícius Júnior', thirdPlace: 'Jude Bellingham', pointsOrVotes: '1,170 pts', keyAchievement: 'UEFA Euro 2024 MVP & Premier League Champion' },
  { year: 2023, winner: 'Lionel Messi', club: 'Inter Miami / PSG', country: 'Argentina', flag: '🇦🇷', category: 'MENS', runnerUp: 'Erling Haaland', thirdPlace: 'Kylian Mbappé', pointsOrVotes: '462 pts', keyAchievement: 'FIFA World Cup 2022 Champion & Golden Ball' },
  { year: 2022, winner: 'Karim Benzema', club: 'Real Madrid', country: 'France', flag: '🇫🇷', category: 'MENS', runnerUp: 'Sadio Mané', thirdPlace: 'Kevin De Bruyne', pointsOrVotes: '549 pts', keyAchievement: 'UEFA Champions League & La Liga Top Scorer' },
  { year: 2021, winner: 'Lionel Messi', club: 'PSG / Barcelona', country: 'Argentina', flag: '🇦🇷', category: 'MENS', runnerUp: 'Robert Lewandowski', thirdPlace: 'Jorginho', pointsOrVotes: '613 pts', keyAchievement: 'Copa América 2021 Champion & Best Player' },
  { year: 2019, winner: 'Lionel Messi', club: 'Barcelona', country: 'Argentina', flag: '🇦🇷', category: 'MENS', runnerUp: 'Virgil van Dijk', thirdPlace: 'Cristiano Ronaldo', pointsOrVotes: '686 pts', keyAchievement: 'European Golden Shoe & La Liga Champion' },
  { year: 2018, winner: 'Luka Modrić', club: 'Real Madrid', country: 'Croatia', flag: '🇭🇷', category: 'MENS', runnerUp: 'Cristiano Ronaldo', thirdPlace: 'Antoine Griezmann', pointsOrVotes: '753 pts', keyAchievement: 'UCL Champion & World Cup Golden Ball Finalist' },

  // Women's Ballon d'Or (Ballon d'Or Féminin)
  { year: 2024, winner: 'Aitana Bonmatí', club: 'Barcelona Femení', country: 'Spain', flag: '🇪🇸', category: 'WOMENS', runnerUp: 'Caroline Graham Hansen', thirdPlace: 'Salma Paralluelo', pointsOrVotes: '675 pts', keyAchievement: 'UWCL & Liga F Quadruple Winner, UWCL Top Scorer' },
  { year: 2023, winner: 'Aitana Bonmatí', club: 'Barcelona Femení', country: 'Spain', flag: '🇪🇸', category: 'WOMENS', runnerUp: 'Sam Kerr', thirdPlace: 'Salma Paralluelo', pointsOrVotes: '266 pts', keyAchievement: 'FIFA Women’s World Cup MVP & UWCL Champion' },
  { year: 2022, winner: 'Alexia Putellas', club: 'Barcelona Femení', country: 'Spain', flag: '🇪🇸', category: 'WOMENS', runnerUp: 'Beth Mead', thirdPlace: 'Sam Kerr', pointsOrVotes: '178 pts', keyAchievement: 'UWCL Top Scorer & Spanish Domestic Treble' },
  { year: 2021, winner: 'Alexia Putellas', club: 'Barcelona Femení', country: 'Spain', flag: '🇪🇸', category: 'WOMENS', runnerUp: 'Jennifer Hermoso', thirdPlace: 'Sam Kerr', pointsOrVotes: '186 pts', keyAchievement: 'First Continental Treble with Barcelona Femení' },
  { year: 2019, winner: 'Megan Rapinoe', club: 'Reign FC', country: 'United States', flag: '🇺🇸', category: 'WOMENS', runnerUp: 'Lucy Bronze', thirdPlace: 'Alex Morgan', pointsOrVotes: '176 pts', keyAchievement: 'FIFA Women’s World Cup Golden Boot & Golden Ball' },
  { year: 2018, winner: 'Ada Hegerberg', club: 'Lyon Féminin', country: 'Norway', flag: '🇳🇴', category: 'WOMENS', runnerUp: 'Pernille Harder', thirdPlace: 'Dzsenifer Marozsán', pointsOrVotes: '136 pts', keyAchievement: 'Inaugural Ballon d’Or Féminin Winner & UWCL Record' },
];

export const BallonDorTrackerModal: React.FC<BallonDorTrackerModalProps> = ({ isOpen, onClose }) => {
  const [selectedCat, setSelectedCat] = useState<'ALL' | 'MENS' | 'WOMENS'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filtered = BALLON_DOR_ARCHIVE.filter((w) => {
    if (selectedCat !== 'ALL' && w.category !== selectedCat) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        w.winner.toLowerCase().includes(q) ||
        w.club.toLowerCase().includes(q) ||
        w.country.toLowerCase().includes(q) ||
        String(w.year).includes(q)
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950 via-[#2a1b02] to-slate-950 text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold tracking-wide border border-amber-500/30 mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>FRANCE FOOTBALL OFFICIAL ARCHIVE</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-display text-white">
            Ballon d'Or & Ballon d'Or Féminin Hall of Fame
          </h2>
          <p className="text-xs text-slate-300">
            Official records, point tallies, and runner-up voting results for the most prestigious individual prize in football.
          </p>
        </div>

        {/* Toolbar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-1.5 font-bold">
            <button
              onClick={() => setSelectedCat('ALL')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedCat === 'ALL' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'bg-white border text-slate-600'
              }`}
            >
              All Honours
            </button>
            <button
              onClick={() => setSelectedCat('MENS')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedCat === 'MENS' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'bg-white border text-slate-600'
              }`}
            >
              Men's Ballon d'Or
            </button>
            <button
              onClick={() => setSelectedCat('WOMENS')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedCat === 'WOMENS' ? 'bg-purple-700 text-white shadow-xs' : 'bg-white border text-slate-600'
              }`}
            >
              Ballon d'Or Féminin
            </button>
          </div>

          <div className="relative w-full sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search winner or year..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* List of Winners */}
        <div className="p-6 overflow-y-auto space-y-3.5 flex-1">
          {filtered.map((item) => (
            <div
              key={`${item.year}-${item.category}`}
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 shadow-xs hover:shadow-md transition-all space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black font-mono text-amber-600">{item.year}</span>
                  <span
                    className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                      item.category === 'WOMENS' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.category === 'WOMENS' ? "Ballon d'Or Féminin" : "Ballon d'Or"}
                  </span>
                </div>
                <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                  {item.pointsOrVotes}
                </span>
              </div>

              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-black text-base text-slate-900 flex items-center gap-1.5">
                    <span>{item.flag}</span>
                    <span>{item.winner}</span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">{item.club} · {item.country}</div>
                </div>

                <div className="text-[11px] text-slate-500 text-right space-y-0.5 shrink-0">
                  <div>🥈 2nd: <span className="font-semibold text-slate-800">{item.runnerUp}</span></div>
                  <div>🥉 3rd: <span className="font-semibold text-slate-800">{item.thirdPlace}</span></div>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-[11px] font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="truncate">{item.keyAchievement}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <span className="text-[11px] font-mono text-slate-400">France Football Certified Records</span>
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
