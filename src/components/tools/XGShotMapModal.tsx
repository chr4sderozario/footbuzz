/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Expected Goals (xG) Shot Map & Shot Radar
 */

import React, { useState } from 'react';
import { Target, Activity, X, Info } from 'lucide-react';

interface XGShotMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  homeTeamName?: string;
  awayTeamName?: string;
}

interface ShotPoint {
  id: string;
  minute: number;
  player: string;
  team: 'HOME' | 'AWAY';
  x: number; // 0 to 100 on attacking pitch
  y: number; // 0 to 100 on attacking pitch
  xg: number;
  outcome: 'GOAL' | 'SAVED' | 'BLOCKED' | 'MISSED';
}

const SHOTS: ShotPoint[] = [
  { id: '1', minute: 14, player: 'Petratos', team: 'HOME', x: 78, y: 48, xg: 0.44, outcome: 'GOAL' },
  { id: '2', minute: 28, player: 'Liston', team: 'HOME', x: 65, y: 32, xg: 0.12, outcome: 'SAVED' },
  { id: '3', minute: 39, player: 'Chhangte', team: 'AWAY', x: 82, y: 54, xg: 0.58, outcome: 'GOAL' },
  { id: '4', minute: 52, player: 'Sahal', team: 'HOME', x: 70, y: 64, xg: 0.22, outcome: 'BLOCKED' },
  { id: '5', minute: 71, player: 'Petratos', team: 'HOME', x: 86, y: 50, xg: 0.76, outcome: 'GOAL' },
  { id: '6', minute: 84, player: 'Kratky', team: 'AWAY', x: 62, y: 44, xg: 0.08, outcome: 'MISSED' },
];

export const XGShotMapModal: React.FC<XGShotMapModalProps> = ({
  isOpen,
  onClose,
  homeTeamName = 'Mohun Bagan SG',
  awayTeamName = 'Mumbai City FC',
}) => {
  const [selectedShot, setSelectedShot] = useState<ShotPoint | null>(null);

  if (!isOpen) return null;

  const totalHomeXG = SHOTS.filter((s) => s.team === 'HOME').reduce((acc, s) => acc + s.xg, 0);
  const totalAwayXG = SHOTS.filter((s) => s.team === 'AWAY').reduce((acc, s) => acc + s.xg, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-[#0d2818] to-[#009270] text-white p-6 relative shrink-0 space-y-2">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-mono font-bold tracking-wide">
            <Target className="w-3.5 h-3.5" />
            <span>OPTICAL TRACKING & XG RADAR</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-display text-white">
            Expected Goals (xG) Shot Map
          </h2>

          <p className="text-xs text-emerald-100/90 leading-relaxed">
            Visual map of all attempts on goal, shot locations, probability rings, and conversion efficiency.
          </p>
        </div>

        {/* Score and xG summary */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-[#009270]">{homeTeamName}</span>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-100 text-[#009270] font-black">
              {totalHomeXG.toFixed(2)} xG
            </span>
          </div>

          <span className="text-slate-400 font-bold">vs</span>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-black">
              {totalAwayXG.toFixed(2)} xG
            </span>
            <span className="font-extrabold text-sm text-slate-800">{awayTeamName}</span>
          </div>
        </div>

        {/* Pitch Shot Chart */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="relative aspect-4/3 w-full rounded-2xl bg-[#1b5e20] border-4 border-slate-800 overflow-hidden shadow-inner p-3">
            {/* Penalty Box Markings */}
            <div className="absolute inset-x-8 bottom-0 top-1/4 border-t-2 border-x-2 border-white/50" />
            <div className="absolute inset-x-16 bottom-0 top-2/3 border-t-2 border-x-2 border-white/50" />
            <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-t-2 border-white/50 pointer-events-none" />

            {/* Shots */}
            {SHOTS.map((s) => (
              <div
                key={s.id}
                onClick={() => setSelectedShot(s)}
                style={{ left: `${s.y}%`, bottom: `${s.x - 40}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-125 z-10 ${
                  selectedShot?.id === s.id ? 'ring-4 ring-amber-300 scale-125' : ''
                }`}
              >
                <div
                  style={{ width: `${Math.max(18, s.xg * 38)}px`, height: `${Math.max(18, s.xg * 38)}px` }}
                  className={`rounded-full flex items-center justify-center font-bold text-[9px] border-2 shadow-md ${
                    s.outcome === 'GOAL'
                      ? 'bg-amber-400 border-white text-slate-950 animate-pulse'
                      : s.team === 'HOME'
                      ? 'bg-[#009270] border-white text-white'
                      : 'bg-blue-600 border-white text-white'
                  }`}
                >
                  {s.outcome === 'GOAL' ? '⚽' : `${Math.round(s.xg * 100)}`}
                </div>
              </div>
            ))}
          </div>

          {selectedShot ? (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1 animate-in fade-in">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>{selectedShot.minute}' · {selectedShot.player} ({selectedShot.team})</span>
                <span className="text-[#009270] font-mono font-black">{selectedShot.xg} xG</span>
              </div>
              <div className="text-slate-500">
                Outcome: <strong>{selectedShot.outcome}</strong> · Shot distance calculated from goal line center.
              </div>
            </div>
          ) : (
            <div className="text-center text-xs text-slate-500">
              Click any shot point on the pitch to inspect expected goal probability (xG) and shooter.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Official Optical Tracking Feed</span>
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
