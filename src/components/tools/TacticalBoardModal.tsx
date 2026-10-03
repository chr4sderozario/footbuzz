/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Interactive Tactical Whiteboard & Pitch Board Builder
 * Design custom 11-player formations, tactical playing styles, and team shape.
 */

import React, { useState } from 'react';
import { Sliders, X, RotateCcw, Share2, Sparkles, Check, Shield, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface TacticalBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TacticalNode {
  id: string;
  role: string;
  name: string;
  number: number;
  x: number; // 0 to 100%
  y: number; // 0 to 100%
}

const FORMATIONS: Record<string, TacticalNode[]> = {
  '4-3-3': [
    { id: '1', role: 'GK', name: 'Goalkeeper', number: 1, x: 50, y: 88 },
    { id: '2', role: 'RB', name: 'Right Back', number: 2, x: 82, y: 72 },
    { id: '3', role: 'CB', name: 'Center Back (R)', number: 4, x: 62, y: 74 },
    { id: '4', role: 'CB', name: 'Center Back (L)', number: 5, x: 38, y: 74 },
    { id: '5', role: 'LB', name: 'Left Back', number: 3, x: 18, y: 72 },
    { id: '6', role: 'DM', name: 'Defensive Mid (Pivot)', number: 6, x: 50, y: 56 },
    { id: '7', role: 'CM', name: 'Right Center Mid', number: 8, x: 68, y: 44 },
    { id: '8', role: 'CM', name: 'Left Center Mid', number: 10, x: 32, y: 44 },
    { id: '9', role: 'RW', name: 'Right Winger', number: 7, x: 80, y: 22 },
    { id: '10', role: 'ST', name: 'Striker / No. 9', number: 9, x: 50, y: 16 },
    { id: '11', role: 'LW', name: 'Left Winger', number: 11, x: 20, y: 22 },
  ],
  '4-2-3-1': [
    { id: '1', role: 'GK', name: 'Goalkeeper', number: 1, x: 50, y: 88 },
    { id: '2', role: 'RB', name: 'Right Back', number: 2, x: 82, y: 72 },
    { id: '3', role: 'CB', name: 'Center Back (R)', number: 4, x: 62, y: 74 },
    { id: '4', role: 'CB', name: 'Center Back (L)', number: 5, x: 38, y: 74 },
    { id: '5', role: 'LB', name: 'Left Back', number: 3, x: 18, y: 72 },
    { id: '6', role: 'DM', name: 'Double Pivot (R)', number: 6, x: 62, y: 56 },
    { id: '7', role: 'DM', name: 'Double Pivot (L)', number: 8, x: 38, y: 56 },
    { id: '8', role: 'AM', name: 'Attacking Mid (No. 10)', number: 10, x: 50, y: 38 },
    { id: '9', role: 'RM', name: 'Right Winger', number: 7, x: 82, y: 30 },
    { id: '10', role: 'ST', name: 'Target Forward', number: 9, x: 50, y: 15 },
    { id: '11', role: 'LM', name: 'Left Winger', number: 11, x: 18, y: 30 },
  ],
  '3-5-2': [
    { id: '1', role: 'GK', name: 'Goalkeeper', number: 1, x: 50, y: 88 },
    { id: '2', role: 'CB', name: 'Right Center Back', number: 2, x: 74, y: 74 },
    { id: '3', role: 'CB', name: 'Central Sweeper', number: 4, x: 50, y: 76 },
    { id: '4', role: 'CB', name: 'Left Center Back', number: 5, x: 26, y: 74 },
    { id: '5', role: 'RWB', name: 'Right Wing Back', number: 7, x: 88, y: 50 },
    { id: '6', role: 'CM', name: 'Central Midfielder', number: 6, x: 62, y: 50 },
    { id: '7', role: 'CM', name: 'Playmaker', number: 8, x: 50, y: 40 },
    { id: '8', role: 'CM', name: 'Central Midfielder', number: 10, x: 38, y: 50 },
    { id: '9', role: 'LWB', name: 'Left Wing Back', number: 3, x: 12, y: 50 },
    { id: '10', role: 'ST', name: 'Right Striker', number: 9, x: 62, y: 18 },
    { id: '11', role: 'ST', name: 'Left Striker', number: 11, x: 38, y: 18 },
  ],
};

export const TacticalBoardModal: React.FC<TacticalBoardModalProps> = ({ isOpen, onClose }) => {
  const { addToast } = useApp();
  const [formationKey, setFormationKey] = useState<string>('4-3-3');
  const [tacticalStyle, setTacticalStyle] = useState<'TIKI_TAKA' | 'GEGENPRESS' | 'LOW_BLOCK' | 'DIRECT_COUNTER'>('GEGENPRESS');
  const [selectedPlayer, setSelectedPlayer] = useState<TacticalNode | null>(null);

  if (!isOpen) return null;

  const currentNodes = FORMATIONS[formationKey] || FORMATIONS['4-3-3'];

  const styles = [
    { id: 'GEGENPRESS', name: 'High Gegenpressing', desc: 'Aggressive immediate ball recovery in opponent\'s third within 6 seconds.' },
    { id: 'TIKI_TAKA', name: 'Tiki-Taka Possession', desc: 'Short passing triangles, fluid rotational overloads, high line of engagement.' },
    { id: 'LOW_BLOCK', name: 'Compact Low Block', desc: 'Dense defensive structure with deep defensive line protecting the penalty box.' },
    { id: 'DIRECT_COUNTER', name: 'Direct Vertical Counter', desc: 'Rapid transition into wide channels utilizing pace behind the opposition backline.' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-[#0a2f24] to-[#009270] text-white p-6 relative shrink-0 space-y-2">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-mono font-bold tracking-wide">
            <Layers className="w-3.5 h-3.5" />
            <span>TACTICAL WHITEBOARD BUILDER</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-display text-white">
            Formation & Tactical Pitch Board
          </h2>

          <p className="text-xs text-emerald-100/90 leading-relaxed">
            Select team shape, adjust player positioning nodes, and configure tactical instructions.
          </p>
        </div>

        {/* Formation & Style Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-600">Formation:</span>
            {['4-3-3', '4-2-3-1', '3-5-2'].map((f) => (
              <button
                key={f}
                onClick={() => setFormationKey(f)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  formationKey === f
                    ? 'bg-[#009270] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-600">Style:</span>
            <select
              value={tacticalStyle}
              onChange={(e) => setTacticalStyle(e.target.value as any)}
              className="bg-white border border-slate-200 rounded-lg px-3 py-1 text-xs font-bold text-slate-800 focus:outline-hidden"
            >
              {styles.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pitch Viewport */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pitch */}
          <div className="lg:col-span-2 relative aspect-3/4 rounded-2xl bg-gradient-to-b from-[#1b5e20] via-[#2e7d32] to-[#1b5e20] border-4 border-slate-800 shadow-xl overflow-hidden p-4">
            {/* Pitch Markings */}
            <div className="absolute inset-4 border-2 border-white/60 pointer-events-none" />
            <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-0.5 bg-white/60 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border-2 border-white/60 pointer-events-none" />
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-24 border-b-2 border-x-2 border-white/60 pointer-events-none" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-24 border-t-2 border-x-2 border-white/60 pointer-events-none" />

            {/* Tactical Nodes */}
            {currentNodes.map((node) => (
              <div
                key={node.id}
                onClick={() => setSelectedPlayer(node)}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 cursor-pointer flex flex-col items-center group z-10 ${
                  selectedPlayer?.id === node.id ? 'scale-115' : 'hover:scale-110'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-black font-mono text-xs border-2 shadow-lg ${
                    node.role === 'GK'
                      ? 'bg-amber-400 text-slate-950 border-white'
                      : 'bg-slate-950 text-white border-emerald-400'
                  } ${selectedPlayer?.id === node.id ? 'ring-4 ring-amber-300' : ''}`}
                >
                  {node.number}
                </div>
                <span className="mt-1 px-1.5 py-0.2 rounded bg-black/70 backdrop-blur-2xs text-[9px] font-bold text-white whitespace-nowrap shadow-xs">
                  {node.role}
                </span>
              </div>
            ))}
          </div>

          {/* Tactical Inspector Panel */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                Active Tactical Identity
              </span>
              <h4 className="font-black text-sm text-slate-900">
                {styles.find((s) => s.id === tacticalStyle)?.name}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {styles.find((s) => s.id === tacticalStyle)?.desc}
              </p>
            </div>

            {selectedPlayer ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 animate-in fade-in">
                <div className="text-[10px] font-mono text-[#009270] font-bold uppercase">
                  Player Node Inspector
                </div>
                <div className="font-black text-base text-slate-900">
                  #{selectedPlayer.number} · {selectedPlayer.name}
                </div>
                <div className="text-xs text-slate-600">
                  Role: <strong>{selectedPlayer.role}</strong>
                </div>
                <div className="text-xs text-slate-500 pt-1 border-t border-emerald-200">
                  Coordinates: Pitch X {selectedPlayer.x}%, Pitch Y {selectedPlayer.y}%
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                Click any player node on the pitch to inspect positioning and tactical assignment.
              </div>
            )}

            <button
              onClick={() => {
                addToast('Board Shared', `Exported ${formationKey} ${tacticalStyle} tactical setup!`, 'SUCCESS');
              }}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Tactical Board</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>FootBuzz Tactical Engine 2026/27</span>
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
