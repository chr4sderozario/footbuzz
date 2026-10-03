/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, Trophy, Calendar, History, Shield } from 'lucide-react';
import { footballApi } from '../../services/footballApi';
import { useApp } from '../../context/AppContext';
import { ClubCrest } from '../common/ClubCrest';
import { CompetitionBadge } from '../common/CompetitionBadge';
import { MatchCard } from '../matches/MatchCard';

export const CompetitionDetailPage: React.FC<{ competitionId: string }> = ({ competitionId }) => {
  const comp = footballApi.getCompetitionById(competitionId);
  const matches = footballApi.getCompetitionMatches(competitionId);
  const { navigateTo } = useApp();

  const [activeTab, setActiveTab] = useState<'standings' | 'scorers' | 'matches' | 'history'>(
    'standings'
  );

  if (!comp) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
        Competition not found.{' '}
        <button onClick={() => navigateTo('competitions')} className="text-[#009270] font-bold underline">
          Back to Competitions
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Breadcrumb Back */}
      <button
        onClick={() => navigateTo('competitions')}
        className="flex items-center gap-1.5 text-xs font-bold text-[#009270] hover:underline transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Competitions</span>
      </button>

      {/* Header Banner */}
      <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <CompetitionBadge
            id={comp.id}
            name={comp.name}
            emblemUrl={comp.emblem}
            size="lg"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#009270]">
                {comp.country} · {comp.season}
              </span>
              <span className="text-slate-400 text-xs">· Founded {comp.founded}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display mt-0.5">
              {comp.name}
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
              {comp.historySummary}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs shrink-0">
          <div>
            <div className="text-slate-400 text-[11px]">Trophy</div>
            <div className="font-bold text-slate-900 mt-0.5">{comp.trophyName}</div>
          </div>
          <div className="border-l border-slate-200 pl-4">
            <div className="text-slate-400 text-[11px]">Current Round</div>
            <div className="font-bold text-[#009270] mt-0.5">{comp.currentRound}</div>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl overflow-x-auto shadow-2xs">
        {(
          [
            { id: 'standings', label: 'Points Table' },
            { id: 'scorers', label: 'Top Goalscorers' },
            { id: 'matches', label: 'Fixtures & Matches' },
            { id: 'history', label: 'All-Time Champions' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#009270] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. STANDINGS TAB */}
      {activeTab === 'standings' && (
        <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 overflow-hidden shadow-xs">
          {!comp.standings || comp.standings.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              Standings currently in knockout format or unavailable.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-mono text-[11px]">
                    <th className="py-3 px-4 w-12 text-center">#</th>
                    <th className="py-3 px-4">Club</th>
                    <th className="py-3 px-2 text-center">P</th>
                    <th className="py-3 px-2 text-center">W</th>
                    <th className="py-3 px-2 text-center">D</th>
                    <th className="py-3 px-2 text-center">L</th>
                    <th className="py-3 px-2 text-center hidden sm:table-cell">GF</th>
                    <th className="py-3 px-2 text-center hidden sm:table-cell">GA</th>
                    <th className="py-3 px-2 text-center">GD</th>
                    <th className="py-3 px-4 text-center font-bold text-slate-900">PTS</th>
                    <th className="py-3 px-4 text-center hidden md:table-cell">Form</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {comp.standings.map((row) => (
                    <tr
                      key={`stand-${row.teamId}`}
                      onClick={() => navigateTo('team-detail', { teamId: row.teamId })}
                      className="hover:bg-emerald-50/40 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-600">
                        <span
                          className={`inline-flex items-center justify-center w-5 h-5 rounded ${
                            row.position <= 4
                              ? 'bg-emerald-100 text-[#009270] font-black'
                              : 'text-slate-500'
                          }`}
                        >
                          {row.position}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                        <ClubCrest name={row.teamName} size="xs" />
                        <span className="hover:text-[#009270] transition-colors">{row.teamName}</span>
                      </td>
                      <td className="py-3 px-2 text-center font-mono text-slate-700">{row.played}</td>
                      <td className="py-3 px-2 text-center font-mono text-slate-700">{row.won}</td>
                      <td className="py-3 px-2 text-center font-mono text-slate-700">{row.drawn}</td>
                      <td className="py-3 px-2 text-center font-mono text-slate-700">{row.lost}</td>
                      <td className="py-3 px-2 text-center font-mono text-slate-500 hidden sm:table-cell">
                        {row.goalsFor}
                      </td>
                      <td className="py-3 px-2 text-center font-mono text-slate-500 hidden sm:table-cell">
                        {row.goalsAgainst}
                      </td>
                      <td className="py-3 px-2 text-center font-mono font-bold text-slate-700">
                        {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-black text-sm text-[#009270]">
                        {row.points}
                      </td>
                      <td className="py-3 px-4 text-center hidden md:table-cell">
                        <div className="flex items-center justify-center gap-1">
                          {row.form.map((f, i) => (
                            <span
                              key={`f-${i}`}
                              className={`w-4 h-4 rounded text-[9px] font-bold font-mono flex items-center justify-center ${
                                f === 'W'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : f === 'D'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : 'bg-rose-100 text-rose-800 border border-rose-300'
                              }`}
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 2. TOP SCORERS TAB */}
      {activeTab === 'scorers' && (
        <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" /> Golden Boot & Top Goalscorers
          </h3>
          {!comp.topScorers || comp.topScorers.length === 0 ? (
            <div className="text-xs text-slate-500 py-6 text-center">
              Top scorer stats unavailable.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {comp.topScorers.map((scorer) => (
                <div
                  key={`top-${scorer.playerId}`}
                  onClick={() => navigateTo('player-detail', { playerId: scorer.playerId })}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#009270] cursor-pointer flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-black text-amber-600 w-5">
                      #{scorer.rank}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-900 hover:text-[#009270] transition-colors">
                        {scorer.playerName}
                      </div>
                      <div className="text-[11px] text-slate-500">{scorer.teamName}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-base font-black text-[#009270]">
                      {scorer.goals} <span className="text-[10px] text-slate-500 font-sans font-normal">goals</span>
                    </div>
                    <div className="text-[10px] text-slate-500">{scorer.assists} assists · {scorer.matches} apps</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. MATCHES TAB */}
      {activeTab === 'matches' && (
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900">Fixtures & Results</h3>
          {matches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matches.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
              No live or scheduled fixtures reported for {comp.name} in current data feed.
            </div>
          )}
        </div>
      )}

      {/* 4. HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <History className="w-4 h-4 text-[#009270]" /> Historical Championship Roll
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {comp.allTimeChampions.map((champ, idx) => (
              <div
                key={`champ-${idx}`}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">{champ.team}</div>
                    <div className="text-[11px] text-slate-500">Last won: {champ.lastWon}</div>
                  </div>
                </div>
                <div className="font-mono text-xs font-bold text-amber-700 px-2 py-0.5 rounded bg-amber-100/70 border border-amber-300">
                  {champ.titles} {champ.titles === 1 ? 'Title' : 'Titles'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
