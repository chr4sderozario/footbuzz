/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Fan Match Predictor League
 * Predict live fixture outcomes, earn leaderboard points, and track prediction streaks.
 */

import React, { useState, useEffect } from 'react';
import { Target, Trophy, Flame, X, Check, Award, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';

interface MatchPredictorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MatchPredictorModal: React.FC<MatchPredictorModalProps> = ({ isOpen, onClose }) => {
  const { addToast } = useApp();
  const [predictions, setPredictions] = useState<Record<string, 'HOME' | 'DRAW' | 'AWAY'>>(() => {
    try {
      const saved = localStorage.getItem('footbuzz_fan_predictions');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [points, setPoints] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('footbuzz_fan_points');
      return saved ? parseInt(saved, 10) : 180;
    } catch {
      return 180;
    }
  });

  if (!isOpen) return null;

  const matchesToPredict = [
    { id: 'p-1', home: 'Mohun Bagan SG', away: 'Mumbai City FC', comp: 'ISL 2026/27', date: 'Tomorrow, 19:30' },
    { id: 'p-2', home: 'Real Madrid', away: 'FC Barcelona', comp: 'El Clásico · La Liga', date: 'Sunday, 20:00' },
    { id: 'p-3', home: 'Arsenal', away: 'Liverpool', comp: 'Premier League', date: 'Saturday, 17:30' },
    { id: 'p-4', home: 'Argentina', away: 'Uruguay', comp: 'FIFA World Cup Qualifier', date: 'Next Tuesday' },
  ];

  const handlePredict = (matchId: string, pick: 'HOME' | 'DRAW' | 'AWAY') => {
    const next = { ...predictions, [matchId]: pick };
    setPredictions(next);
    const newPoints = points + 25;
    setPoints(newPoints);
    try {
      localStorage.setItem('footbuzz_fan_predictions', JSON.stringify(next));
      localStorage.setItem('footbuzz_fan_points', newPoints.toString());
    } catch {}

    confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    addToast('Prediction Locked In!', '+25 Points added to your Fan Predictor rank!', 'SUCCESS');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-[#1c2c5b] to-[#009270] text-white p-6 relative shrink-0 space-y-2">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-mono font-bold tracking-wide">
            <Target className="w-3.5 h-3.5" />
            <span>COMMUNITY FAN LEAGUE</span>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black font-display text-white">
              Matchday Predictor
            </h2>
            <div className="px-3 py-1 rounded-xl bg-amber-400 text-slate-950 font-mono font-black text-xs flex items-center gap-1 shadow-md">
              <Trophy className="w-3.5 h-3.5" />
              <span>{points} Pts</span>
            </div>
          </div>

          <p className="text-xs text-emerald-100/90 leading-relaxed">
            Lock in your outcome predictions before kickoff. Climb the global leaderboard and unlock exclusive club badges!
          </p>
        </div>

        {/* Fixtures List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {matchesToPredict.map((m) => {
            const currentPick = predictions[m.id];
            return (
              <div
                key={m.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
              >
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
                  <span className="font-bold text-[#009270]">{m.comp}</span>
                  <span className="font-mono text-slate-500">{m.date}</span>
                </div>

                <div className="flex items-center justify-between font-extrabold text-sm text-slate-900">
                  <span className="truncate max-w-[140px]">{m.home}</span>
                  <span className="text-xs font-mono text-slate-400">VS</span>
                  <span className="truncate max-w-[140px] text-right">{m.away}</span>
                </div>

                {/* 3 Outcome Buttons */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    onClick={() => handlePredict(m.id, 'HOME')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      currentPick === 'HOME'
                        ? 'bg-[#009270] text-white border-[#009270] shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    1 ({m.home.split(' ')[0]})
                  </button>

                  <button
                    onClick={() => handlePredict(m.id, 'DRAW')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      currentPick === 'DRAW'
                        ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    X (Draw)
                  </button>

                  <button
                    onClick={() => handlePredict(m.id, 'AWAY')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      currentPick === 'AWAY'
                        ? 'bg-[#132257] text-white border-[#132257] shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    2 ({m.away.split(' ')[0]})
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>{Object.keys(predictions).length} predictions locked</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
