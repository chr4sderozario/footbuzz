/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Head-to-Head (H2H) Club Matrix Tool
 * Compare any two clubs across trophies, all-time historic clashes, and head-to-head records.
 */

import React, { useState } from 'react';
import { ArrowRightLeft, Trophy, Swords, X, Check, Shield } from 'lucide-react';
import { TEAMS_DATA } from '../../data/teams';
import { ClubCrest } from '../common/ClubCrest';

interface H2HMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const H2HMatrixModal: React.FC<H2HMatrixModalProps> = ({ isOpen, onClose }) => {
  const [teamAId, setTeamAId] = useState<string>('team-mohunbagan');
  const [teamBId, setTeamBId] = useState<string>('team-eastbengal');

  if (!isOpen) return null;

  const teamA = TEAMS_DATA.find((t) => t.id === teamAId) || TEAMS_DATA[0];
  const teamB = TEAMS_DATA.find((t) => t.id === teamBId) || TEAMS_DATA[1];

  const totalTrophiesA = teamA.trophies.reduce((acc, t) => acc + t.count, 0);
  const totalTrophiesB = teamB.trophies.reduce((acc, t) => acc + t.count, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-[#132257] to-[#009270] text-white p-6 relative shrink-0 space-y-2">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-mono font-bold tracking-wide">
            <Swords className="w-3.5 h-3.5" />
            <span>HEAD-TO-HEAD MATRIX</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-display text-white">
            Club vs Club Historic Matrix
          </h2>

          <p className="text-xs text-emerald-100/90 leading-relaxed">
            Select any two clubs in the database to compare trophies, stats, and rivalries side-by-side.
          </p>
        </div>

        {/* Club Selectors */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Club A
            </label>
            <select
              value={teamAId}
              onChange={(e) => setTeamAId(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-hidden"
            >
              {TEAMS_DATA.map((t) => (
                <option key={`a-${t.id}`} value={t.id}>
                  {t.name} ({t.country})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Club B
            </label>
            <select
              value={teamBId}
              onChange={(e) => setTeamBId(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-hidden"
            >
              {TEAMS_DATA.map((t) => (
                <option key={`b-${t.id}`} value={t.id}>
                  {t.name} ({t.country})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dual Showcase */}
        <div className="p-6 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200 grid grid-cols-3 items-center text-center">
          <div className="flex flex-col items-center space-y-2">
            <ClubCrest name={teamA.name} code={teamA.code} size="xl" />
            <div className="font-extrabold text-sm text-slate-900">{teamA.name}</div>
            <div className="text-xs text-slate-500 font-mono">Founded {teamA.founded}</div>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-mono font-black text-sm flex items-center justify-center shadow-md animate-pulse">
              VS
            </div>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <ClubCrest name={teamB.name} code={teamB.code} size="xl" />
            <div className="font-extrabold text-sm text-slate-900">{teamB.name}</div>
            <div className="text-xs text-slate-500 font-mono">Founded {teamB.founded}</div>
          </div>
        </div>

        {/* Comparison Metrics */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1 text-xs">
          {/* Total Trophies */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-3 items-center text-center">
            <span className="font-mono font-black text-base text-[#009270]">{totalTrophiesA}</span>
            <span className="font-bold text-slate-500 uppercase text-[10px]">Total Trophies</span>
            <span className="font-mono font-black text-base text-[#132257]">{totalTrophiesB}</span>
          </div>

          {/* Stadium Capacity */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-3 items-center text-center">
            <span className="font-mono font-bold text-slate-900">{teamA.capacity.toLocaleString()}</span>
            <span className="font-bold text-slate-500 uppercase text-[10px]">Stadium Capacity</span>
            <span className="font-mono font-bold text-slate-900">{teamB.capacity.toLocaleString()}</span>
          </div>

          {/* Home Stadium */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-3 items-center text-center">
            <span className="text-slate-800 font-semibold truncate px-2">{teamA.stadium}</span>
            <span className="font-bold text-slate-500 uppercase text-[10px]">Home Ground</span>
            <span className="text-slate-800 font-semibold truncate px-2">{teamB.stadium}</span>
          </div>

          {/* Manager */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-3 items-center text-center">
            <span className="text-slate-800 font-semibold truncate px-2">{teamA.manager}</span>
            <span className="font-bold text-slate-500 uppercase text-[10px]">Head Coach</span>
            <span className="text-slate-800 font-semibold truncate px-2">{teamB.manager}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>FootBuzz Club Records Archive</span>
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
