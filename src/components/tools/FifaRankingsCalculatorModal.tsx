/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FIFA World Rankings Calculator & Points Simulator Tool
 * Official FIFA Elo model: P = Pbefore + I * (W - We) with match importance multipliers.
 */

import React, { useState } from 'react';
import { Globe, Calculator, ArrowRight, ShieldCheck, RefreshCw, X, Award } from 'lucide-react';

interface FifaRankingsCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FifaRankingsCalculatorModal: React.FC<FifaRankingsCalculatorModalProps> = ({ isOpen, onClose }) => {
  const [teamRatingA, setTeamRatingA] = useState<number>(1850); // e.g. Argentina / France
  const [teamRatingB, setTeamRatingB] = useState<number>(1740); // e.g. Brazil / England
  const [matchImportance, setMatchImportance] = useState<number>(50); // 50 = World Cup Finals match, 25 = Qualifiers, 10 = Friendly
  const [matchResult, setMatchResult] = useState<'WIN' | 'DRAW' | 'LOSS'>('WIN');

  if (!isOpen) return null;

  // FIFA Formula: We = 1 / (10^(-(dr/600)) + 1)
  const dr = teamRatingA - teamRatingB;
  const expectedResult = 1 / (Math.pow(10, -dr / 600) + 1);

  const actualOutcome = matchResult === 'WIN' ? 1.0 : matchResult === 'DRAW' ? 0.5 : 0.0;
  const pointsDelta = matchImportance * (actualOutcome - expectedResult);
  const newRatingA = Math.round((teamRatingA + pointsDelta) * 10) / 10;
  const newRatingB = Math.round((teamRatingB - pointsDelta) * 10) / 10;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-[#0a2318] to-slate-950 text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold tracking-wide border border-emerald-500/30 mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>OFFICIAL FIFA ELO RATING FORMULA</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-display text-white">
            FIFA Men's & Women's World Rankings Calculator
          </h2>
          <p className="text-xs text-slate-300">
            Simulate exact ranking points gained or lost based on FIFA's mathematical formula: <code className="font-mono text-emerald-300">P = Pbefore + I * (W - We)</code>.
          </p>
        </div>

        {/* Calculator Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Match Importance Multipliers */}
          <div className="space-y-1.5">
            <label className="font-extrabold text-slate-900">1. Match Importance Factor (I):</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { val: 10, label: 'Friendly (I=10)' },
                { val: 25, label: 'Qualifiers (I=25)' },
                { val: 40, label: 'Confed Cup (I=40)' },
                { val: 50, label: 'World Cup (I=50)' },
              ].map((item) => (
                <button
                  key={item.val}
                  onClick={() => setMatchImportance(item.val)}
                  className={`p-2 rounded-xl border text-center transition-all font-bold ${
                    matchImportance === item.val
                      ? 'bg-[#009270] text-white border-[#009270] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Team Ratings Inputs */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Team A Rating (P_before):</label>
              <input
                type="number"
                value={teamRatingA}
                onChange={(e) => setTeamRatingA(parseFloat(e.target.value) || 0)}
                className="w-full p-2 rounded-xl bg-white border border-slate-200 font-mono font-black text-sm text-slate-900"
              />
              <div className="text-[10px] text-slate-500">e.g. Argentina (1889 pts)</div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Team B Rating (P_before):</label>
              <input
                type="number"
                value={teamRatingB}
                onChange={(e) => setTeamRatingB(parseFloat(e.target.value) || 0)}
                className="w-full p-2 rounded-xl bg-white border border-slate-200 font-mono font-black text-sm text-slate-900"
              />
              <div className="text-[10px] text-slate-500">e.g. France (1851 pts)</div>
            </div>
          </div>

          {/* Match Outcome Result */}
          <div className="space-y-1.5">
            <label className="font-extrabold text-slate-900">2. Match Result for Team A:</label>
            <div className="grid grid-cols-3 gap-2">
              {(['WIN', 'DRAW', 'LOSS'] as const).map((res) => (
                <button
                  key={res}
                  onClick={() => setMatchResult(res)}
                  className={`py-2.5 rounded-xl border text-center font-black transition-all ${
                    matchResult === res
                      ? res === 'WIN'
                        ? 'bg-[#009270] text-white border-[#009270] shadow-xs'
                        : res === 'DRAW'
                        ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                        : 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {res === 'WIN' ? '🏆 Team A Win' : res === 'DRAW' ? '🤝 Draw' : '❌ Team A Loss'}
                </button>
              ))}
            </div>
          </div>

          {/* Results Outcome Card */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs text-emerald-950">Calculation Results:</span>
              <span className="font-mono text-[10px] text-emerald-800">
                Expected Win Rate: {(expectedResult * 100).toFixed(1)}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl bg-white border border-emerald-100 shadow-2xs">
                <div className="text-[10px] text-slate-500 font-bold">Team A New Rating</div>
                <div className="text-xl font-black font-mono text-[#009270] mt-0.5">
                  {newRatingA}
                </div>
                <div className="text-[10px] font-mono font-bold text-emerald-700">
                  {pointsDelta >= 0 ? `+${pointsDelta.toFixed(1)}` : `${pointsDelta.toFixed(1)}`} pts
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-emerald-100 shadow-2xs">
                <div className="text-[10px] text-slate-500 font-bold">Team B New Rating</div>
                <div className="text-xl font-black font-mono text-slate-900 mt-0.5">
                  {newRatingB}
                </div>
                <div className="text-[10px] font-mono font-bold text-slate-500">
                  {-pointsDelta >= 0 ? `+${(-pointsDelta).toFixed(1)}` : `${(-pointsDelta).toFixed(1)}`} pts
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <span className="text-[11px] font-mono text-slate-400">FIFA Council Official Elo Engine</span>
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
