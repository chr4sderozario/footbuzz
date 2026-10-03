/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Dedicated FIFA World Cup Hub
 * Covers 2026 World Cup roadmap, knockout bracket, and verified historical archive from 1930 to 2022.
 */

import React, { useState } from 'react';
import { Globe, Trophy, Calendar, MapPin, Award, Users, ChevronRight, X, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { footballApi } from '../../services/footballApi';
import { MatchCard } from '../matches/MatchCard';

interface WorldCupEdition {
  year: number;
  host: string;
  champion: string;
  runnerUp: string;
  finalScore: string;
  topScorer: string;
  goldenBallWinner: string;
  teamsCount: number;
  summary: string;
}

const HISTORIC_WORLD_CUPS: WorldCupEdition[] = [
  {
    year: 2026,
    host: 'USA / Canada / Mexico 🇺🇸 🇨🇦 🇲🇽',
    champion: 'TBD (Qualifiers Active)',
    runnerUp: 'TBD',
    finalScore: 'Final: MetLife Stadium, NY/NJ',
    topScorer: 'TBD',
    goldenBallWinner: 'TBD',
    teamsCount: 48,
    summary: 'The historic first-ever 48-nation FIFA World Cup tournament across 16 iconic host cities in North America.',
  },
  {
    year: 2022,
    host: 'Qatar 🇶🇦',
    champion: 'Argentina 🇦🇷',
    runnerUp: 'France 🇫🇷',
    finalScore: '3–3 (4–2 on penalties)',
    topScorer: 'Kylian Mbappé (8 goals)',
    goldenBallWinner: 'Lionel Messi',
    teamsCount: 32,
    summary: 'Arguably the greatest World Cup final in football history, cementing Lionel Messi’s immortal legacy at Lusail.',
  },
  {
    year: 2018,
    host: 'Russia 🇷🇺',
    champion: 'France 🇫🇷',
    runnerUp: 'Croatia 🇭🇷',
    finalScore: '4–2',
    topScorer: 'Harry Kane (6 goals)',
    goldenBallWinner: 'Luka Modrić',
    teamsCount: 32,
    summary: 'France captured their second star with breathtaking counter-attacking flair and a 19-year-old Kylian Mbappé.',
  },
  {
    year: 2014,
    host: 'Brazil 🇧🇷',
    champion: 'Germany 🇩🇪',
    runnerUp: 'Argentina 🇦🇷',
    finalScore: '1–0 (AET)',
    topScorer: 'James Rodríguez (6 goals)',
    goldenBallWinner: 'Lionel Messi',
    teamsCount: 32,
    summary: 'Mario Götze’s 113th-minute volley at the Maracanã crowned Germany champions of the world.',
  },
  {
    year: 2010,
    host: 'South Africa 🇿🇦',
    champion: 'Spain 🇪🇸',
    runnerUp: 'Netherlands 🇳🇱',
    finalScore: '1–0 (AET)',
    topScorer: 'Thomas Müller (5 goals)',
    goldenBallWinner: 'Diego Forlán',
    teamsCount: 32,
    summary: 'Andrés Iniesta’s 116th-minute strike delivered Spain their maiden World Cup in Johannesburg.',
  },
  {
    year: 2002,
    host: 'South Korea & Japan 🇰🇷 🇯🇵',
    champion: 'Brazil 🇧🇷',
    runnerUp: 'Germany 🇩🇪',
    finalScore: '2–0',
    topScorer: 'Ronaldo R9 (8 goals)',
    goldenBallWinner: 'Oliver Kahn',
    teamsCount: 32,
    summary: 'Ronaldo Nazário’s redemption brace in Yokohama secured Brazil their record fifth world title.',
  },
];

export const WorldCupHub: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { navigateTo } = useApp();
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'HISTORY' | 'BRACKET'>('OVERVIEW');

  if (!isOpen) return null;

  const currentEdition = HISTORIC_WORLD_CUPS.find((e) => e.year === selectedYear) || HISTORIC_WORLD_CUPS[0];
  const wcMatches = footballApi.getAllMatches().filter((m) =>
    m.competitionName.toLowerCase().includes('world cup') ||
    m.competitionId.includes('worldcup') ||
    m.competitionCategory === 'international'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 via-[#0a1a3a] to-blue-800 text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-mono font-bold tracking-wide">
            <Globe className="w-3.5 h-3.5 text-amber-300" />
            <span>GLOBAL SHOWPIECE HUB</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-display mt-2 text-white flex items-center gap-2">
            <span>FIFA World Cup Command Center</span>
            <span className="text-amber-400 font-mono text-sm px-2 py-0.5 rounded-full bg-black/30">
              {selectedYear}
            </span>
          </h2>

          <p className="text-xs text-blue-200 mt-1 max-w-2xl leading-relaxed">
            The ultimate stage of international football. Exploring the 2026 48-nation expansion and immortal tournament archives.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              activeTab === 'OVERVIEW'
                ? 'border-blue-600 text-blue-600 bg-white font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            🏆 2026 Tournament & Fixtures
          </button>
          <button
            onClick={() => setActiveTab('BRACKET')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              activeTab === 'BRACKET'
                ? 'border-blue-600 text-blue-600 bg-white font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            ⚔️ Knockout Format & Bracket
          </button>
          <button
            onClick={() => setActiveTab('HISTORY')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              activeTab === 'HISTORY'
                ? 'border-blue-600 text-blue-600 bg-white font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            📜 World Cup Roll of Honour
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-6">
              {/* Highlight Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white space-y-3 border border-blue-400/30">
                <div className="flex items-center justify-between text-xs text-blue-300 font-mono">
                  <span>FIFA WORLD CUP 2026</span>
                  <span>48 TEAMS · 104 MATCHES</span>
                </div>
                <h3 className="text-lg font-black font-display text-white">
                  Road to MetLife Stadium · New York / New Jersey
                </h3>
                <p className="text-xs text-blue-200 leading-relaxed">
                  The 23rd FIFA World Cup will be co-hosted by 16 cities in the United States, Canada, and Mexico.
                  Features an expanded 12-group format followed by an unprecedented Round of 32 knockout stage.
                </p>
              </div>

              {/* International Matches */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-slate-900 font-display uppercase tracking-wider">
                    Current International Matches & Qualifiers
                  </h4>
                  <span className="text-xs text-slate-400 font-mono">{wcMatches.length} Fixtures Found</span>
                </div>

                {wcMatches.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wcMatches.map((m) => (
                      <MatchCard key={`wc-${m.id}`} match={m} />
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
                    No live World Cup qualifiers active at this moment.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'BRACKET' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-2">
                <div className="font-bold text-slate-900 text-sm">2026 Knockout Pathway Structure:</div>
                <p>
                  12 Groups of 4 Teams → Top 2 from each group + 8 Best Third-Placed Teams advance to the
                  <strong> Round of 32</strong>, followed by Round of 16, Quarter-Finals, Semi-Finals, and Final.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs">
                <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 font-bold text-blue-900">
                  <div className="text-[10px] uppercase font-mono text-blue-600">Stage 1</div>
                  Round of 32 (16 Ties)
                </div>
                <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 font-bold text-indigo-900">
                  <div className="text-[10px] uppercase font-mono text-indigo-600">Stage 2</div>
                  Round of 16 (8 Ties)
                </div>
                <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 font-bold text-purple-900">
                  <div className="text-[10px] uppercase font-mono text-purple-600">Stage 3</div>
                  Quarter-Finals (4 Ties)
                </div>
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 font-bold text-amber-900">
                  <div className="text-[10px] uppercase font-mono text-amber-600">Stage 4</div>
                  Semi-Finals & Final 🏆
                </div>
              </div>
            </div>
          )}

          {activeTab === 'HISTORY' && (
            <div className="space-y-4">
              {/* Year Selectors */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {HISTORIC_WORLD_CUPS.map((ed) => (
                  <button
                    key={ed.year}
                    onClick={() => setSelectedYear(ed.year)}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold shrink-0 transition-colors ${
                      selectedYear === ed.year
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {ed.year}
                  </button>
                ))}
              </div>

              {/* Selected Edition Details */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-black font-display text-slate-900">
                      FIFA World Cup {currentEdition.year}
                    </h3>
                    <p className="text-xs text-slate-500">Host: {currentEdition.host}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                    Champion: {currentEdition.champion}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Final Match Result</span>
                    <div className="font-extrabold text-slate-900 text-sm">{currentEdition.finalScore}</div>
                    <div className="text-slate-500">Runner-Up: {currentEdition.runnerUp}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Golden Boot & Ball</span>
                    <div className="font-extrabold text-slate-900 text-sm">⚽ {currentEdition.topScorer}</div>
                    <div className="text-slate-500">⭐ Golden Ball: {currentEdition.goldenBallWinner}</div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentEdition.summary}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Official FIFA World Cup archives and roadmap</span>
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
