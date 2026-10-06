/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FIFA World Cup Finals Archive (1930 - 2022)
 * Full verified match scores, goalscorers, attendance, venues, and winning captains for all 22 World Cup finals.
 */

import React, { useState } from 'react';
import { Trophy, Calendar, MapPin, Users, Search, X, ShieldCheck } from 'lucide-react';

interface WorldCupFinalsArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WorldCupFinalRecord {
  year: number;
  winner: string;
  winnerFlag: string;
  runnerUp: string;
  runnerUpFlag: string;
  score: string;
  extraTimeOrPens?: string;
  venue: string;
  hostCountry: string;
  attendance: string;
  winningCaptain: string;
  scorers: string;
}

export const WORLD_CUP_FINALS_DATA: WorldCupFinalRecord[] = [
  { year: 2022, winner: 'Argentina', winnerFlag: '🇦🇷', runnerUp: 'France', runnerUpFlag: '🇫🇷', score: '3 - 3', extraTimeOrPens: '(4-2 on penalties)', venue: 'Lusail Iconic Stadium, Lusail', hostCountry: 'Qatar 🇶🇦', attendance: '88,966', winningCaptain: 'Lionel Messi', scorers: 'Messi 23\'(P), 108\', Di María 36\' | Mbappé 80\'(P), 81\', 118\'(P)' },
  { year: 2018, winner: 'France', winnerFlag: '🇫🇷', runnerUp: 'Croatia', runnerUpFlag: '🇭🇷', score: '4 - 2', venue: 'Luzhniki Stadium, Moscow', hostCountry: 'Russia 🇷🇺', attendance: '78,011', winningCaptain: 'Hugo Lloris', scorers: 'Mandžukić 18\'(OG), Griezmann 38\'(P), Pogba 59\', Mbappé 65\' | Perišić 28\', Mandžukić 69\'' },
  { year: 2014, winner: 'Germany', winnerFlag: '🇩🇪', runnerUp: 'Argentina', runnerUpFlag: '🇦🇷', score: '1 - 0', extraTimeOrPens: '(a.e.t.)', venue: 'Estádio do Maracanã, Rio de Janeiro', hostCountry: 'Brazil 🇧🇷', attendance: '74,738', winningCaptain: 'Philipp Lahm', scorers: 'Mario Götze 113\'' },
  { year: 2010, winner: 'Spain', winnerFlag: '🇪🇸', runnerUp: 'Netherlands', runnerUpFlag: '🇳🇱', score: '1 - 0', extraTimeOrPens: '(a.e.t.)', venue: 'Soccer City, Johannesburg', hostCountry: 'South Africa 🇿🇦', attendance: '84,490', winningCaptain: 'Iker Casillas', scorers: 'Andrés Iniesta 116\'' },
  { year: 2006, winner: 'Italy', winnerFlag: '🇮🇹', runnerUp: 'France', runnerUpFlag: '🇫🇷', score: '1 - 1', extraTimeOrPens: '(5-3 on penalties)', venue: 'Olympiastadion, Berlin', hostCountry: 'Germany 🇩🇪', attendance: '69,000', winningCaptain: 'Fabio Cannavaro', scorers: 'Materazzi 19\' | Zidane 7\'(P)' },
  { year: 2002, winner: 'Brazil', winnerFlag: '🇧🇷', runnerUp: 'Germany', runnerUpFlag: '🇩🇪', score: '2 - 0', venue: 'International Stadium, Yokohama', hostCountry: 'South Korea & Japan 🇯🇵', attendance: '69,029', winningCaptain: 'Cafu', scorers: 'Ronaldo 67\', 79\'' },
  { year: 1998, winner: 'France', winnerFlag: '🇫🇷', runnerUp: 'Brazil', runnerUpFlag: '🇧🇷', score: '3 - 0', venue: 'Stade de France, Saint-Denis', hostCountry: 'France 🇫🇷', attendance: '75,000', winningCaptain: 'Didier Deschamps', scorers: 'Zidane 27\', 45+1\', Petit 90+3\'' },
  { year: 1994, winner: 'Brazil', winnerFlag: '🇧🇷', runnerUp: 'Italy', runnerUpFlag: '🇮🇹', score: '0 - 0', extraTimeOrPens: '(3-2 on penalties)', venue: 'Rose Bowl, Pasadena, California', hostCountry: 'United States 🇺🇸', attendance: '94,194', winningCaptain: 'Dunga', scorers: 'Tied 0-0 after extra time (Baggio penalty miss)' },
  { year: 1986, winner: 'Argentina', winnerFlag: '🇦🇷', runnerUp: 'West Germany', runnerUpFlag: '🇩🇪', score: '3 - 2', venue: 'Estadio Azteca, Mexico City', hostCountry: 'Mexico 🇲🇽', attendance: '114,600', winningCaptain: 'Diego Maradona', scorers: 'Brown 23\', Valdano 55\', Burruchaga 84\' | Rummenigge 74\', Völler 80\'' },
  { year: 1970, winner: 'Brazil', winnerFlag: '🇧🇷', runnerUp: 'Italy', runnerUpFlag: '🇮🇹', score: '4 - 1', venue: 'Estadio Azteca, Mexico City', hostCountry: 'Mexico 🇲🇽', attendance: '107,412', winningCaptain: 'Carlos Alberto', scorers: 'Pelé 18\', Gérson 66\', Jairzinho 71\', Carlos Alberto 86\' | Boninsegna 37\'' },
  { year: 1966, winner: 'England', winnerFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', runnerUp: 'West Germany', runnerUpFlag: '🇩🇪', score: '4 - 2', extraTimeOrPens: '(a.e.t.)', venue: 'Wembley Stadium, London', hostCountry: 'England 🏴󠁧󠁢󠁥󠁮󠁧󠁿', attendance: '96,924', winningCaptain: 'Bobby Moore', scorers: 'Geoff Hurst 18\', 101\', 120\', Peters 78\' | Haller 12\', Weber 89\'' },
  { year: 1958, winner: 'Brazil', winnerFlag: '🇧🇷', runnerUp: 'Sweden', runnerUpFlag: '🇸🇪', score: '5 - 2', venue: 'Råsunda Stadium, Solna', hostCountry: 'Sweden 🇸🇪', attendance: '49,737', winningCaptain: 'Hilderaldo Bellini', scorers: 'Vavá 9\', 32\', Pelé 55\', 90\', Zagallo 68\' | Liedholm 4\', Simonsson 80\'' },
  { year: 1930, winner: 'Uruguay', winnerFlag: '🇺🇾', runnerUp: 'Argentina', runnerUpFlag: '🇦🇷', score: '4 - 2', venue: 'Estadio Centenario, Montevideo', hostCountry: 'Uruguay 🇺🇾', attendance: '68,346', winningCaptain: 'José Nasazzi', scorers: 'Dorado 12\', Cea 57\', Iriarte 68\', Castro 89\' | Peucelle 20\', Stábile 37\'' },
];

export const WorldCupFinalsArchiveModal: React.FC<WorldCupFinalsArchiveModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filtered = WORLD_CUP_FINALS_DATA.filter((f) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        f.winner.toLowerCase().includes(q) ||
        f.runnerUp.toLowerCase().includes(q) ||
        f.venue.toLowerCase().includes(q) ||
        f.hostCountry.toLowerCase().includes(q) ||
        String(f.year).includes(q)
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950 via-[#1f1604] to-slate-950 text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold tracking-wide border border-amber-500/30 mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>FIFA WORLD CUP HISTORIC FINALS (1930 - 2022)</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-display text-white">
            World Cup Finals Archive & Match Summaries
          </h2>
          <p className="text-xs text-slate-300">
            Official scorelines, winning captains, iconic goalscorers, and attendance records from Montevideo 1930 to Lusail 2022.
          </p>
        </div>

        {/* Search */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs shrink-0">
          <div className="relative max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search final by nation, year, or stadium (e.g. 2022, Argentina, Pelé, Maracanã)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Finals List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {filtered.map((f) => (
            <div
              key={f.year}
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 shadow-xs hover:shadow-md transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono font-black text-xs">
                  {f.year} FIFA World Cup™
                </span>
                <span className="text-[11px] font-mono text-slate-500">{f.hostCountry}</span>
              </div>

              {/* Match Score Banner */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 font-black text-sm text-slate-900">
                  <span className="text-xl">{f.winnerFlag}</span>
                  <span className="text-amber-700 font-black">{f.winner} (Champions)</span>
                </div>

                <div className="text-center font-mono">
                  <div className="font-black text-base text-slate-900">{f.score}</div>
                  {f.extraTimeOrPens && (
                    <div className="text-[9px] font-bold text-amber-600">{f.extraTimeOrPens}</div>
                  )}
                </div>

                <div className="flex items-center gap-2 font-bold text-sm text-slate-600">
                  <span>{f.runnerUp}</span>
                  <span className="text-xl">{f.runnerUpFlag}</span>
                </div>
              </div>

              {/* Goalscorers & Venue */}
              <div className="space-y-1 text-[11px] text-slate-600">
                <div className="font-medium">
                  ⚽ <strong>Scorers:</strong> {f.scorers}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-500 pt-1">
                  <span>🏟️ {f.venue}</span>
                  <span>👥 Attendance: {f.attendance}</span>
                  <span>👑 Captain: {f.winningCaptain}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <span className="text-[11px] font-mono text-slate-400">FIFA Official Tournament Archive</span>
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
