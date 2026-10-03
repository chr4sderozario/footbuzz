/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Interactive Penalty Shootout Mini-Game
 * Live penalty shootout simulation: Choose shot zone & power to beat the goalkeeper.
 */

import React, { useState } from 'react';
import { X, RotateCcw, Trophy, Award, Sparkles, Target, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';

interface PenaltyShootoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ShotZone = 'TL' | 'TC' | 'TR' | 'BL' | 'BC' | 'BR';

export const PenaltyShootoutModal: React.FC<PenaltyShootoutModalProps> = ({ isOpen, onClose }) => {
  const { addToast } = useApp();
  const [userScore, setUserScore] = useState(0);
  const [cpuScore, setCpuScore] = useState(0);
  const [round, setRound] = useState(1);
  const [history, setHistory] = useState<('GOAL' | 'SAVED' | 'POST')[]>([]);
  const [lastShotResult, setLastShotResult] = useState<string | null>(null);
  const [keeperDive, setKeeperDive] = useState<ShotZone | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  if (!isOpen) return null;

  const handleShoot = (zone: ShotZone) => {
    if (isGameOver) return;

    // Keeper dives to a zone randomly
    const zones: ShotZone[] = ['TL', 'TC', 'TR', 'BL', 'BC', 'BR'];
    const keeperChoice = zones[Math.floor(Math.random() * zones.length)];
    setKeeperDive(keeperChoice);

    let result: 'GOAL' | 'SAVED' | 'POST' = 'GOAL';
    let outcomeText = '';

    if (keeperChoice === zone) {
      result = 'SAVED';
      outcomeText = '🧤 SAVED! The goalkeeper guessed right!';
    } else if (Math.random() < 0.1) {
      result = 'POST';
      outcomeText = '💥 OFF THE POST! Inches away!';
    } else {
      result = 'GOAL';
      outcomeText = '⚽ GOAL! Clean in the back of the net!';
      setUserScore((prev) => prev + 1);
    }

    // CPU also takes a kick
    const cpuScored = Math.random() > 0.35;
    if (cpuScored) {
      setCpuScore((prev) => prev + 1);
    }

    setLastShotResult(outcomeText);
    const newHistory = [...history, result];
    setHistory(newHistory);

    if (round >= 5) {
      setIsGameOver(true);
      if (userScore + (result === 'GOAL' ? 1 : 0) > cpuScore + (cpuScored ? 1 : 0)) {
        confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
        addToast('Shootout Champions!', 'You won the penalty shootout!', 'SUCCESS');
      }
    } else {
      setRound((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setUserScore(0);
    setCpuScore(0);
    setRound(1);
    setHistory([]);
    setLastShotResult(null);
    setKeeperDive(null);
    setIsGameOver(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-[#004e38] to-[#009270] text-white p-6 relative shrink-0 space-y-2">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-mono font-bold tracking-wide">
            <Target className="w-3.5 h-3.5" />
            <span>PENALTY SHOOTOUT ARENA</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-display text-white">
            Sudden Death Penalty Simulator
          </h2>

          <p className="text-xs text-emerald-100/90 leading-relaxed">
            Pick your target zone inside the goal frame. Beat the goalkeeper to win the championship!
          </p>
        </div>

        {/* Scoreboard Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">You (Striker)</span>
              <div className="text-xl font-black text-[#009270] font-mono">{userScore}</div>
            </div>
            <span className="font-mono text-slate-400 font-black text-base">:</span>
            <div className="text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Opponent</span>
              <div className="text-xl font-black text-slate-900 font-mono">{cpuScore}</div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Kick {Math.min(round, 5)} of 5</span>
            <div className="flex items-center gap-1 mt-0.5">
              {[0, 1, 2, 3, 4].map((i) => {
                const res = history[i];
                return (
                  <span
                    key={i}
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold ${
                      res === 'GOAL'
                        ? 'bg-[#009270] text-white'
                        : res === 'SAVED'
                        ? 'bg-rose-600 text-white'
                        : res === 'POST'
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {res === 'GOAL' ? '✓' : res ? '✗' : ''}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Interactive Goal Net UI */}
        <div className="p-6 space-y-4">
          <div className="relative aspect-16/9 w-full rounded-2xl bg-gradient-to-b from-sky-400 to-emerald-600 p-4 flex flex-col justify-end overflow-hidden border-4 border-slate-800 shadow-inner">
            {/* Goal Posts & Net Pattern */}
            <div className="absolute inset-x-8 top-6 bottom-4 border-t-8 border-x-8 border-white bg-[radial-gradient(white_1px,transparent_1px)] [background-size:12px_12px] bg-black/40 rounded-t-lg shadow-2xl flex flex-col justify-between p-2">
              {/* Goalkeeper Silhouette */}
              <div
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 pointer-events-none ${
                  keeperDive === 'TL'
                    ? '-translate-x-32 -translate-y-16 rotate-[-25deg]'
                    : keeperDive === 'TR'
                    ? 'translate-x-20 -translate-y-16 rotate-[25deg]'
                    : keeperDive === 'BL'
                    ? '-translate-x-28 translate-y-8'
                    : keeperDive === 'BR'
                    ? 'translate-x-16 translate-y-8'
                    : ''
                }`}
              >
                <div className="w-12 h-14 bg-amber-400 border-2 border-slate-950 rounded-xl flex items-center justify-center font-black text-xs text-slate-950 shadow-md">
                  GK
                </div>
              </div>

              {/* 6 Clickable Zones */}
              <div className="grid grid-cols-3 gap-2 h-full z-10">
                {(['TL', 'TC', 'TR', 'BL', 'BC', 'BR'] as ShotZone[]).map((zone) => (
                  <button
                    key={zone}
                    disabled={isGameOver}
                    onClick={() => handleShoot(zone)}
                    className="rounded-xl border border-white/40 hover:border-amber-400 hover:bg-amber-400/20 active:scale-95 transition-all flex items-center justify-center text-xs font-mono font-black text-white hover:text-amber-300 backdrop-blur-2xs"
                  >
                    <span>{zone}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Outcome Headline */}
          {lastShotResult && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center font-bold text-xs text-slate-800 animate-in fade-in">
              {lastShotResult}
            </div>
          )}

          {isGameOver && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <div className="font-extrabold text-sm text-slate-900">
                {userScore > cpuScore
                  ? '🏆 VICTORY! YOU WON THE SHOOTOUT!'
                  : userScore === cpuScore
                  ? '🤝 IT\'S A DRAW! Sudden death awaits!'
                  : '💔 DEFEAT! The goalkeeper outsmarted you!'}
              </div>
              <button
                onClick={handleReset}
                className="px-5 py-2 rounded-xl bg-[#009270] hover:bg-[#028060] text-white text-xs font-black transition-all shadow-xs inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Play Again</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Aim top corners for maximum precision</span>
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
