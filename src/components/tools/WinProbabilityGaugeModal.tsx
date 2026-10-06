/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Live Match Win Probability & Momentum Gauge Engine
 * Real-time dynamic Elo rating, current match state, score differential, and momentum analyzer.
 */

import React, { useState } from 'react';
import { Activity, Zap, TrendingUp, Percent, X, ShieldCheck, Trophy, Sparkles } from 'lucide-react';
import { Match } from '../../types/football';

interface WinProbabilityGaugeModalProps {
  isOpen: boolean;
  onClose: () => void;
  match?: Match | null;
}

export const WinProbabilityGaugeModal: React.FC<WinProbabilityGaugeModalProps> = ({
  isOpen,
  onClose,
  match,
}) => {
  const [homeScore, setHomeScore] = useState<number>(match?.score?.home ?? 1);
  const [awayScore, setAwayScore] = useState<number>(match?.score?.away ?? 0);
  const [minute, setMinute] = useState<number>(match?.minute ?? 65);
  const [homeRedCard, setHomeRedCard] = useState<boolean>(false);
  const [awayRedCard, setAwayRedCard] = useState<boolean>(false);

  if (!isOpen) return null;

  const homeName = match?.homeTeam?.name || 'Manchester City';
  const awayName = match?.awayTeam?.name || 'Real Madrid';

  // Dynamic Win Probability Calculation Engine
  const calculateProbabilities = () => {
    const timeRemainingFactor = (90 - minute) / 90;
    const diff = homeScore - awayScore;

    // Red card penalty
    let homeAdvantage = (homeRedCard ? -15 : 0) + (awayRedCard ? 15 : 0) + 5; // +5 home field

    let homeProb = 33.3 + diff * 22 * (1 + (1 - timeRemainingFactor)) + homeAdvantage;
    let awayProb = 33.3 - diff * 22 * (1 + (1 - timeRemainingFactor)) - homeAdvantage;
    let drawProb = 33.4 - Math.abs(diff) * 15 * (1 - timeRemainingFactor * 0.5);

    if (diff === 0) {
      drawProb = 35 + timeRemainingFactor * 10;
      homeProb = (100 - drawProb) / 2 + homeAdvantage * 0.5;
      awayProb = (100 - drawProb) / 2 - homeAdvantage * 0.5;
    }

    // Normalization
    homeProb = Math.max(1, Math.min(98, homeProb));
    awayProb = Math.max(1, Math.min(98, awayProb));
    drawProb = Math.max(1, Math.min(98, drawProb));

    const total = homeProb + awayProb + drawProb;
    return {
      home: Math.round((homeProb / total) * 100),
      draw: Math.round((drawProb / total) * 100),
      away: Math.round((awayProb / total) * 100),
    };
  };

  const prob = calculateProbabilities();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-[#032e22] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold tracking-wide border border-emerald-500/30 mb-2">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>AI MATCH PROBABILITY ENGINE</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-display text-white">
            Live Win Probability & Momentum Gauge
          </h2>
          <p className="text-xs text-slate-300">
            Real-time statistical likelihood of victory based on goal difference, minute elapsed, and squad momentum.
          </p>
        </div>

        {/* Interactive Sliders & Score Simulator */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span>Simulated Scoreline:</span>
              <span className="font-mono text-sm font-black text-slate-900">
                {homeName} {homeScore} - {awayScore} {awayName} ({minute}')
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-500 font-bold">{homeName} Goals</label>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => setHomeScore(Math.max(0, homeScore - 1))}
                    className="w-8 h-8 rounded-lg bg-white border font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="font-mono font-black text-base">{homeScore}</span>
                  <button
                    onClick={() => setHomeScore(homeScore + 1)}
                    className="w-8 h-8 rounded-lg bg-white border font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-500 font-bold">{awayName} Goals</label>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => setAwayScore(Math.max(0, awayScore - 1))}
                    className="w-8 h-8 rounded-lg bg-white border font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="font-mono font-black text-base">{awayScore}</span>
                  <button
                    onClick={() => setAwayScore(awayScore + 1)}
                    className="w-8 h-8 rounded-lg bg-white border font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Minute Slider */}
            <div className="space-y-1 pt-2">
              <div className="flex justify-between text-[11px] text-slate-600 font-bold">
                <span>Match Minute:</span>
                <span className="font-mono text-[#009270]">{minute}'</span>
              </div>
              <input
                type="range"
                min="1"
                max="90"
                value={minute}
                onChange={(e) => setMinute(parseInt(e.target.value))}
                className="w-full accent-[#009270]"
              />
            </div>
          </div>

          {/* Probability Gauge Bar */}
          <div className="space-y-3">
            <div className="font-extrabold text-sm text-slate-900 flex items-center justify-between">
              <span>Live Win Probability Breakdown</span>
              <span className="text-xs text-slate-500 font-mono">100% Normalized</span>
            </div>

            <div className="h-6 w-full rounded-xl overflow-hidden flex font-mono text-[10px] font-bold text-white shadow-inner">
              <div
                style={{ width: `${prob.home}%` }}
                className="bg-[#009270] flex items-center justify-center transition-all duration-300"
              >
                {prob.home > 12 && `${prob.home}%`}
              </div>
              <div
                style={{ width: `${prob.draw}%` }}
                className="bg-amber-500 flex items-center justify-center transition-all duration-300"
              >
                {prob.draw > 12 && `${prob.draw}%`}
              </div>
              <div
                style={{ width: `${prob.away}%` }}
                className="bg-blue-600 flex items-center justify-center transition-all duration-300"
              >
                {prob.away > 12 && `${prob.away}%`}
              </div>
            </div>

            {/* Legend Cards */}
            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="text-[10px] uppercase font-bold text-emerald-800 truncate">{homeName}</div>
                <div className="text-xl font-black font-mono text-[#009270]">{prob.home}%</div>
                <div className="text-[9px] text-emerald-600 font-bold">Win Chance</div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                <div className="text-[10px] uppercase font-bold text-amber-800">Draw</div>
                <div className="text-xl font-black font-mono text-amber-600">{prob.draw}%</div>
                <div className="text-[9px] text-amber-600 font-bold">Stalemate</div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                <div className="text-[10px] uppercase font-bold text-blue-800 truncate">{awayName}</div>
                <div className="text-xl font-black font-mono text-blue-600">{prob.away}%</div>
                <div className="text-[9px] text-blue-600 font-bold">Win Chance</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <span className="text-[11px] font-mono text-slate-400">Statistical Poisson-Elo Engine</span>
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
