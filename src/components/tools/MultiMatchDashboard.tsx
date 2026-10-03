/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Multi-View Live Match Dashboard
 * Track 2 to 4 live fixtures simultaneously on a split-screen command board.
 */

import React, { useState } from 'react';
import { LayoutGrid, X, Radio, ArrowRight, ExternalLink } from 'lucide-react';
import { Match } from '../../types/football';
import { ClubCrest } from '../common/ClubCrest';
import { useApp } from '../../context/AppContext';

interface MultiMatchDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  matches: Match[];
}

export const MultiMatchDashboard: React.FC<MultiMatchDashboardProps> = ({
  isOpen,
  onClose,
  matches,
}) => {
  const { navigateTo } = useApp();
  const [selectedMatchIds, setSelectedMatchIds] = useState<string[]>(() =>
    matches.slice(0, 4).map((m) => m.id)
  );

  if (!isOpen) return null;

  const activeMatches = matches.filter((m) => selectedMatchIds.includes(m.id)).slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-[#0d2818] to-[#009270] text-white p-6 relative shrink-0 space-y-2">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-mono font-bold tracking-wide">
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>SPLIT-SCREEN MULTI-VIEW</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-display text-white">
            Command Centre Multi-Match Dashboard
          </h2>

          <p className="text-xs text-emerald-100/90 leading-relaxed">
            Monitor multiple live and scheduled fixtures simultaneously with synchronized scoreboards.
          </p>
        </div>

        {/* 4-Panel Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          {activeMatches.map((m) => (
            <div
              key={m.id}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#009270] hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
                <span className="font-bold text-[#009270] truncate max-w-[180px]">
                  {m.competitionName}
                </span>
                <span className="font-mono font-bold text-slate-500">
                  {m.status === 'LIVE' ? (
                    <span className="text-rose-600 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                      LIVE
                    </span>
                  ) : (
                    m.time
                  )}
                </span>
              </div>

              {/* Match Teams */}
              <div className="space-y-2 py-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <ClubCrest name={m.homeTeam.name} code={m.homeTeam.code} size="xs" />
                    <span className="font-extrabold text-sm text-slate-900 truncate">
                      {m.homeTeam.name}
                    </span>
                  </div>
                  <span className="font-mono font-black text-base text-slate-900">
                    {m.score.home !== null ? m.score.home : '—'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <ClubCrest name={m.awayTeam.name} code={m.awayTeam.code} size="xs" />
                    <span className="font-extrabold text-sm text-slate-900 truncate">
                      {m.awayTeam.name}
                    </span>
                  </div>
                  <span className="font-mono font-black text-base text-slate-900">
                    {m.score.away !== null ? m.score.away : '—'}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 truncate max-w-[150px]">{m.venue || 'Stadium'}</span>
                <button
                  onClick={() => {
                    onClose();
                    navigateTo('match-centre', { matchId: m.id });
                  }}
                  className="text-[#009270] font-bold hover:underline flex items-center gap-1"
                >
                  <span>Match Centre</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Synchronized Telemetry Dashboard</span>
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
