/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Global Live Score Ticker Component
 * Compact marquee ticker surfacing real provider-confirmed live matches.
 */

import React from 'react';
import { Radio, ChevronRight, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { footballApi } from '../../services/footballApi';

export const LiveScoreTicker: React.FC = () => {
  const { navigateTo, elapsedFreshnessSeconds } = useApp();
  const liveMatches = footballApi.getLiveMatches();

  if (liveMatches.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-950 text-white border-b border-emerald-500/20 text-xs py-1.5 px-4 select-none relative z-30 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
          </span>
          <span className="font-mono font-black text-[11px] uppercase tracking-wider text-rose-400 flex items-center gap-1">
            <Zap className="w-3 h-3 fill-current" />
            LIVE
          </span>
          <span className="text-slate-500 text-[10px]">|</span>
        </div>

        {/* Scrollable Live Match pills */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar flex-1 py-0.5">
          {liveMatches.map((m) => (
            <button
              key={`ticker-${m.id}`}
              onClick={() => navigateTo('match-centre', { matchId: m.id })}
              className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors shrink-0 group text-left"
            >
              <span className="font-bold text-white text-xs">
                {m.homeTeam.code || m.homeTeam.shortName}{' '}
                <span className="text-emerald-400 font-mono font-black">
                  {m.score.home ?? 0}–{m.score.away ?? 0}
                </span>{' '}
                {m.awayTeam.code || m.awayTeam.shortName}
              </span>
              <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold">
                {m.status === 'HT' ? 'HT' : `${m.minute || 45}'`}
              </span>
              <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-white transition-colors" />
            </button>
          ))}
        </div>

        {/* Freshness Badge (Feature 32: Lightning Speed Results) */}
        <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-emerald-400/90 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>⚡ Updated {elapsedFreshnessSeconds}s ago</span>
        </div>
      </div>
    </div>
  );
};
