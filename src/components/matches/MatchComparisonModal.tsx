/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, ArrowRightLeft, Shield, BarChart3, Clock, Trophy } from 'lucide-react';
import { Match } from '../../types/football';
import { footballApi } from '../../services/footballApi';
import { ClubCrest } from '../common/ClubCrest';

interface MatchComparisonModalProps {
  initialMatchIdA: string;
  initialMatchIdB?: string;
  isOpen?: boolean;
  onClose: () => void;
}

export const MatchComparisonModal: React.FC<MatchComparisonModalProps> = ({
  initialMatchIdA,
  initialMatchIdB,
  isOpen = true,
  onClose,
}) => {
  if (!isOpen) return null;
  const allMatches = footballApi.getAllMatches();
  const [matchIdA, setMatchIdA] = useState<string>(initialMatchIdA);
  const [matchIdB, setMatchIdB] = useState<string>(
    initialMatchIdB || (allMatches.find((m) => m.id !== initialMatchIdA)?.id || (allMatches[0] ? allMatches[0].id : ''))
  );

  const matchA = footballApi.getMatchById(matchIdA);
  const matchB = footballApi.getMatchById(matchIdB);

  if (!matchA || !matchB) return null;

  const compareStat = (statA?: [number, number], statB?: [number, number], label: string = '') => {
    if (!statA || !statB) return null;
    const totalA = statA[0] + statA[1];
    const totalB = statB[0] + statB[1];

    return (
      <div className="py-2.5 border-b border-slate-800/60 text-xs">
        <div className="text-center font-medium text-slate-400 mb-1.5">{label}</div>
        <div className="grid grid-cols-2 gap-4 items-center">
          {/* Match A */}
          <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="font-semibold text-slate-200">{matchA.homeTeam.code} {statA[0]}</span>
            <span className="text-slate-500 font-mono text-[10px]">vs</span>
            <span className="font-semibold text-slate-200">{statA[1]} {matchA.awayTeam.code}</span>
          </div>

          {/* Match B */}
          <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="font-semibold text-slate-200">{matchB.homeTeam.code} {statB[0]}</span>
            <span className="text-slate-500 font-mono text-[10px]">vs</span>
            <span className="font-semibold text-slate-200">{statB[1]} {matchB.awayTeam.code}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-950 border border-slate-800 p-6 shadow-2xl text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Side-by-Side Match Comparison</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selectors for both matches */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Match 1</label>
            <select
              value={matchIdA}
              onChange={(e) => setMatchIdA(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500"
            >
              {allMatches.map((m) => (
                <option key={`sel-a-${m.id}`} value={m.id}>
                  {m.homeTeam.name} vs {m.awayTeam.name} ({m.competitionName} {m.season})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Match 2</label>
            <select
              value={matchIdB}
              onChange={(e) => setMatchIdB(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500"
            >
              {allMatches.map((m) => (
                <option key={`sel-b-${m.id}`} value={m.id}>
                  {m.homeTeam.name} vs {m.awayTeam.name} ({m.competitionName} {m.season})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Match Headers Compare Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Match A Card */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-[11px] font-semibold text-emerald-400 mb-1">{matchA.competitionName} · {matchA.season}</div>
            <div className="flex items-center justify-between gap-3 py-2">
              <div className="flex items-center gap-2">
                <ClubCrest name={matchA.homeTeam.name} code={matchA.homeTeam.code} primaryColor={matchA.homeTeam.crestColor} size="sm" />
                <span className="text-xs font-bold text-white truncate">{matchA.homeTeam.name}</span>
              </div>
              <span className="font-mono text-xl font-black text-white">{matchA.score.home}</span>
            </div>
            <div className="flex items-center justify-between gap-3 py-2">
              <div className="flex items-center gap-2">
                <ClubCrest name={matchA.awayTeam.name} code={matchA.awayTeam.code} primaryColor={matchA.awayTeam.crestColor} size="sm" />
                <span className="text-xs font-bold text-white truncate">{matchA.awayTeam.name}</span>
              </div>
              <span className="font-mono text-xl font-black text-white">{matchA.score.away}</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
              <span>{matchA.date}</span>
              <span>{matchA.venue}</span>
            </div>
          </div>

          {/* Match B Card */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-[11px] font-semibold text-emerald-400 mb-1">{matchB.competitionName} · {matchB.season}</div>
            <div className="flex items-center justify-between gap-3 py-2">
              <div className="flex items-center gap-2">
                <ClubCrest name={matchB.homeTeam.name} code={matchB.homeTeam.code} primaryColor={matchB.homeTeam.crestColor} size="sm" />
                <span className="text-xs font-bold text-white truncate">{matchB.homeTeam.name}</span>
              </div>
              <span className="font-mono text-xl font-black text-white">{matchB.score.home}</span>
            </div>
            <div className="flex items-center justify-between gap-3 py-2">
              <div className="flex items-center gap-2">
                <ClubCrest name={matchB.awayTeam.name} code={matchB.awayTeam.code} primaryColor={matchB.awayTeam.crestColor} size="sm" />
                <span className="text-xs font-bold text-white truncate">{matchB.awayTeam.name}</span>
              </div>
              <span className="font-mono text-xl font-black text-white">{matchB.score.away}</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
              <span>{matchB.date}</span>
              <span>{matchB.venue}</span>
            </div>
          </div>
        </div>

        {/* Statistical Comparison Matrix */}
        <div className="space-y-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-emerald-400" /> Statistical Comparison
          </h3>

          {compareStat(matchA.statistics?.possession, matchB.statistics?.possession, 'Possession (%)')}
          {compareStat(matchA.statistics?.shotsTotal, matchB.statistics?.shotsTotal, 'Total Shots')}
          {compareStat(matchA.statistics?.shotsOnTarget, matchB.statistics?.shotsOnTarget, 'Shots on Target')}
          {compareStat(matchA.statistics?.expectedGoals, matchB.statistics?.expectedGoals, 'Expected Goals (xG)')}
          {compareStat(matchA.statistics?.passesTotal, matchB.statistics?.passesTotal, 'Completed Passes')}
          {compareStat(matchA.statistics?.passAccuracy, matchB.statistics?.passAccuracy, 'Pass Accuracy (%)')}
          {compareStat(matchA.statistics?.corners, matchB.statistics?.corners, 'Corner Kicks')}
          {compareStat(matchA.statistics?.fouls, matchB.statistics?.fouls, 'Fouls Committed')}
        </div>
      </div>
    </div>
  );
};
