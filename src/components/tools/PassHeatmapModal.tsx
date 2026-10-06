/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Pass Accuracy & Pitch Heatmap Generator Tool
 * Interactive pitch heatmap visualizer for progressive passes, key passes, and defensive recoveries.
 */

import React, { useState } from 'react';
import { Target, Activity, Zap, X, ShieldCheck, Flame, Compass, RefreshCw } from 'lucide-react';
import { Match } from '../../types/football';

interface PassHeatmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  match?: Match | null;
}

export const PassHeatmapModal: React.FC<PassHeatmapModalProps> = ({ isOpen, onClose, match }) => {
  const [selectedView, setSelectedView] = useState<'POSSESSION' | 'PASSES' | 'DEFENSIVE' | 'SHOTS'>('POSSESSION');
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  if (!isOpen) return null;

  const homeName = match?.homeTeam?.name || 'Manchester City';
  const awayName = match?.awayTeam?.name || 'Arsenal';

  // Pitch Zones (3x6 Grid = 18 zones)
  const zones = [
    { id: 'z1', label: 'Defensive Left', homeVal: '78%', awayVal: '65%', density: 'high' },
    { id: 'z2', label: 'Defensive Box', homeVal: '92%', awayVal: '88%', density: 'very-high' },
    { id: 'z3', label: 'Defensive Right', homeVal: '81%', awayVal: '70%', density: 'high' },
    { id: 'z4', label: 'Midfield Left Flank', homeVal: '85%', awayVal: '68%', density: 'medium' },
    { id: 'z5', label: 'Central Midfield Core', homeVal: '89%', awayVal: '76%', density: 'very-high' },
    { id: 'z6', label: 'Midfield Right Flank', homeVal: '83%', awayVal: '72%', density: 'high' },
    { id: 'z7', label: 'Final Third Left Half-space', homeVal: '72%', awayVal: '61%', density: 'high' },
    { id: 'z8', label: 'Central Attacking Zone 14', homeVal: '68%', awayVal: '58%', density: 'very-high' },
    { id: 'z9', label: 'Final Third Right Half-space', homeVal: '75%', awayVal: '64%', density: 'high' },
    { id: 'z10', label: 'Penalty Box Center', homeVal: '54%', awayVal: '48%', density: 'medium' },
    { id: 'z11', label: 'Left Wing Cross Channel', homeVal: '62%', awayVal: '55%', density: 'medium' },
    { id: 'z12', label: 'Right Wing Cross Channel', homeVal: '67%', awayVal: '59%', density: 'medium' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-[#0a2318] to-slate-950 text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold tracking-wide border border-emerald-500/30 mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>ZONAL TACTICAL PASS HEATMAP</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-display text-white">
            Pass Accuracy & Pitch Heatmap Visualizer
          </h2>
          <p className="text-xs text-slate-300">
            Zonal possession intensity, progressive pass completion, and high-turnover defensive territory.
          </p>
        </div>

        {/* Controls */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 overflow-x-auto text-xs shrink-0">
          <div className="flex items-center gap-1.5 font-bold">
            {(['POSSESSION', 'PASSES', 'DEFENSIVE', 'SHOTS'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setSelectedView(view)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  selectedView === view
                    ? 'bg-[#009270] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {view}
              </button>
            ))}
          </div>

          <span className="text-[11px] font-mono text-slate-500 font-bold shrink-0">
            {homeName} vs {awayName}
          </span>
        </div>

        {/* Pitch Heatmap Grid */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Tactical Pitch Canvas */}
          <div className="relative w-full aspect-[16/10] bg-[#1b4332] rounded-2xl border-4 border-white/40 shadow-inner overflow-hidden p-3 flex flex-col justify-between">
            {/* Pitch Lines */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-white/40 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border-2 border-white/40 pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-16 border-b-2 border-x-2 border-white/40 pointer-events-none" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-36 h-16 border-t-2 border-x-2 border-white/40 pointer-events-none" />

            {/* Interactive Zones Grid */}
            <div className="grid grid-cols-3 grid-rows-4 gap-2 h-full z-10">
              {zones.map((z) => (
                <div
                  key={z.id}
                  onClick={() => setSelectedZone(z.label)}
                  className={`rounded-xl p-2 cursor-pointer transition-all border flex flex-col justify-between ${
                    z.density === 'very-high'
                      ? 'bg-rose-500/40 border-rose-400 hover:bg-rose-500/60'
                      : z.density === 'high'
                      ? 'bg-amber-500/35 border-amber-400 hover:bg-amber-500/55'
                      : 'bg-emerald-500/25 border-emerald-300 hover:bg-emerald-500/45'
                  }`}
                >
                  <div className="text-[9px] font-mono font-bold text-white/90 drop-shadow truncate">
                    {z.label}
                  </div>
                  <div className="flex justify-between font-mono font-black text-xs text-white drop-shadow">
                    <span>{z.homeVal}</span>
                    <span className="text-amber-200">{z.awayVal}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Details Bar */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span>Selected Zone Details:</span>
              <span className="text-[#009270] font-mono">{selectedZone || 'Zone 14 (Central Attacking Core)'}</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              High progressive pass density recorded in this zone. {homeName} completed 48 successful line-breaking passes with an 89% accuracy rating.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <span className="text-[11px] font-mono text-slate-400">Tactical Opta-Format Heatmap</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
