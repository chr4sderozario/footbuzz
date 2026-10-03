/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Football History & Time Machine Discovery Page
 */

import React, { useState } from 'react';
import {
  History,
  Trophy,
  Sparkles,
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { footballApi } from '../../services/footballApi';
import { useApp } from '../../context/AppContext';
import { MatchCard } from '../matches/MatchCard';

export const HistoryPage: React.FC = () => {
  const tournaments = footballApi.getHistoricTournaments();
  const historicalMatches = footballApi.getHistoricalMatches();
  const concepts = footballApi.getConcepts();
  const legends = footballApi.getPlayers().filter((p) => p.isLegend);
  const { navigateTo } = useApp();

  const [selectedYear, setSelectedYear] = useState<number>(1970);
  const activeTournament = tournaments.find((t) => t.year === selectedYear) || tournaments[0];

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-2">
          <History className="w-3.5 h-3.5 text-amber-700" />
          <span>FOOTBALL TIME MACHINE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
          Football History, Archives & Tactical Knowledge
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
          Step back into the golden eras of world football. Explore historic World Cups, legendary finals, tactical philosophies, and verified match archives.
        </p>
      </div>

      {/* FOOTBALL TIME MACHINE: INTERACTIVE TIMELINE SELECTOR */}
      <section className="rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#009270]" /> World Cup Time Machine
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Select a tournament year to inspect the champions, golden boot, and key moments.</p>
          </div>
          <div className="font-mono text-2xl font-black text-[#009270] tracking-wider">
            {activeTournament.year}
          </div>
        </div>

        {/* Year Selector Scroller */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {tournaments.map((t) => (
            <button
              key={`tm-${t.year}`}
              onClick={() => setSelectedYear(t.year)}
              className={`px-4 py-2 rounded-xl text-xs font-black font-mono transition-all shrink-0 ${
                selectedYear === t.year
                  ? 'bg-[#009270] text-white shadow-xs scale-105'
                  : 'bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {t.year}
            </button>
          ))}
        </div>

        {/* Active Tournament Showcase Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <div className="text-xs font-bold text-[#009270] uppercase tracking-wider">
                Host: {activeTournament.host || activeTournament.hostCountry} · {activeTournament.totalGoals} Goals in {activeTournament.matchesPlayed || activeTournament.totalMatches} Matches
              </div>
              <h3 className="text-xl font-black text-slate-900 font-display mt-1">
                {activeTournament.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                {activeTournament.summary}
              </p>
            </div>

            {/* Iconic Moments List */}
            {(activeTournament.iconicMoments || activeTournament.keyMoments) && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Iconic Tournament Moments
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {(activeTournament.iconicMoments || activeTournament.keyMoments || []).map((mom: any, idx: number) => (
                    <li key={`mom-${idx}`} className="flex items-start gap-2">
                      <span className="text-[#009270] font-black shrink-0">✦</span>
                      <span>{typeof mom === 'string' ? mom : mom.title || mom.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Awards & Champions Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div>
              <div className="text-[10px] uppercase font-bold text-[#009270] tracking-wider">Champion</div>
              <div className="text-base font-black text-slate-900 mt-0.5">{activeTournament.championTeamName || activeTournament.champion}</div>
              <div className="text-[11px] text-slate-500">Runner-up: {activeTournament.runnerUpTeamName || activeTournament.runnerUp}</div>
            </div>

            {activeTournament.goldenBoot && (
              <div className="border-t border-slate-200 pt-3">
                <div className="text-[10px] uppercase font-bold text-[#009270] tracking-wider">Golden Boot</div>
                <div className="text-xs font-bold text-slate-900 mt-0.5">
                  {activeTournament.goldenBoot.player} ({activeTournament.goldenBoot.country})
                </div>
                <div className="text-[11px] text-[#009270] font-mono font-bold">
                  {activeTournament.goldenBoot.goals} Goals
                </div>
              </div>
            )}

            {activeTournament.goldenBall && (
              <div className="border-t border-slate-200 pt-3">
                <div className="text-[10px] uppercase font-bold text-[#009270] tracking-wider">Golden Ball</div>
                <div className="text-xs font-bold text-slate-900 mt-0.5">
                  {activeTournament.goldenBall.player} ({activeTournament.goldenBall.country})
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION: CLASSIC & HISTORIC FINALS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-black text-slate-900 font-display">
              Classic Finals & Historic Encounters
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {historicalMatches.map((m) => (
            <MatchCard key={`hist-${m.id}`} match={m} variant="featured" />
          ))}
        </div>
      </section>

      {/* SECTION: FOOTBALL KNOWLEDGE LAYER & TACTICAL CONCEPTS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#009270]" />
            <h2 className="text-lg font-black text-slate-900 font-display">
              Football Knowledge Layer & Tactics Dictionary
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {concepts.map((concept) => (
            <div
              key={concept.id}
              onClick={() => navigateTo('concept-detail', { conceptId: concept.id })}
              className="group p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 hover:border-[#009270] hover:shadow-md transition-all cursor-pointer space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[#009270] tracking-wider">
                  {(concept.category || 'TACTICS').replace('_', ' ')}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#009270] group-hover:translate-x-1 transition-all" />
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900 group-hover:text-[#009270] transition-colors">
                  {concept.name}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                  {concept.shortDesc}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 truncate">
                Origin: {concept.origin}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: ALL-TIME LEGENDS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-black text-slate-900 font-display">
              All-Time Football Legends
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {legends.map((legend) => (
            <div
              key={`legend-${legend.id}`}
              onClick={() => navigateTo('player-detail', { playerId: legend.id })}
              className="group p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 hover:border-[#009270] hover:shadow-md transition-all cursor-pointer space-y-2 text-center"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-mono font-black text-sm text-slate-900">
                #{legend.number}
              </div>
              <h3 className="text-sm font-black text-slate-900 group-hover:text-[#009270] transition-colors">
                {legend.name}
              </h3>
              <p className="text-[11px] text-slate-500">
                {legend.nationality} · {legend.detailedPosition}
              </p>
              <div className="text-[10px] text-[#009270] font-mono font-bold">
                {legend.seasonStats.goals} Verified Goals
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
