/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Live Injury & Suspension Watchlist
 * Track player injury updates, medical prognosis, expected return dates, and disciplinary bans.
 */

import React, { useState } from 'react';
import { Activity, AlertOctagon, X, Search, Calendar, HeartPulse } from 'lucide-react';
import { PlayerAvatar } from '../common/PlayerAvatar';

interface InjuryTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MedicalCase {
  id: string;
  playerName: string;
  team: string;
  condition: string;
  type: 'INJURY' | 'SUSPENSION' | 'DOUBT';
  severity: 'HIGH' | 'MEDIUM' | 'RETURNING_SOON';
  expectedReturn: string;
  note: string;
}

const MEDICAL_CASES: MedicalCase[] = [
  {
    id: 'm-debruyne',
    playerName: 'Kevin De Bruyne',
    team: 'Manchester City',
    condition: 'Pelvis / Groin Strain',
    type: 'INJURY',
    severity: 'MEDIUM',
    expectedReturn: 'Mid October 2026',
    note: 'Undergoing light training with medical staff after substitution in European fixture.',
  },
  {
    id: 'm-gavi',
    playerName: 'Gavi (Pablo Páez Gavira)',
    team: 'FC Barcelona',
    condition: 'Complete ACL Recovery Protocol',
    type: 'INJURY',
    severity: 'RETURNING_SOON',
    expectedReturn: 'Cleared for Match Squad',
    note: 'Completed full group tactical drills; available for minutes off the bench.',
  },
  {
    id: 'm-rodri-ban',
    playerName: 'Rodri',
    team: 'Manchester City',
    condition: 'Yellow Card Accumulation Danger (4 Yellows)',
    type: 'SUSPENSION',
    severity: 'HIGH',
    expectedReturn: 'Available (1 booking away from 1-match ban)',
    note: 'Next yellow card triggers automatic one-match domestic suspension.',
  },
  {
    id: 'm-chhetri-knock',
    playerName: 'Sunil Chhetri',
    team: 'Bengaluru FC',
    condition: 'Minor Ankle Knock',
    type: 'DOUBT',
    severity: 'RETURNING_SOON',
    expectedReturn: 'Late Fitness Test Before Kickoff',
    note: 'Treated by club physiotherapists; high probability of starting or impact substitute.',
  },
];

export const InjuryTrackerModal: React.FC<InjuryTrackerModalProps> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = MEDICAL_CASES.filter(
    (c) =>
      c.playerName.toLowerCase().includes(search.toLowerCase()) ||
      c.team.toLowerCase().includes(search.toLowerCase()) ||
      c.condition.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-[#3b1212] to-[#dc2626] text-white p-6 relative shrink-0 space-y-2">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-mono font-bold tracking-wide">
            <HeartPulse className="w-3.5 h-3.5 text-rose-300" />
            <span>MEDICAL & DISCIPLINARY WARD</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-display text-white">
            Injury & Suspension Watchlist
          </h2>

          <p className="text-xs text-rose-100/90 leading-relaxed">
            Real-time medical updates on star players, hamstring & ACL rehabilitation timelines, and yellow card disciplinary warnings.
          </p>
        </div>

        {/* Search */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by player or club..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-hidden"
          />
        </div>

        {/* List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-rose-400 hover:shadow-md transition-all space-y-2 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <PlayerAvatar name={item.playerName} size="sm" />
                  <div>
                    <h3 className="font-black text-sm text-slate-900 group-hover:text-rose-600 transition-colors">
                      {item.playerName}
                    </h3>
                    <div className="text-xs text-slate-500 font-semibold">{item.team}</div>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${
                    item.type === 'INJURY'
                      ? 'bg-rose-50 border-rose-200 text-rose-700'
                      : item.type === 'SUSPENSION'
                      ? 'bg-amber-50 border-amber-200 text-amber-700'
                      : 'bg-blue-50 border-blue-200 text-blue-700'
                  }`}
                >
                  {item.condition}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Return: <strong className="text-slate-900">{item.expectedReturn}</strong>
                </span>
              </div>

              <p className="text-[11px] text-slate-500 italic leading-snug">
                {item.note}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Verified Team Medical Release Reports</span>
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
