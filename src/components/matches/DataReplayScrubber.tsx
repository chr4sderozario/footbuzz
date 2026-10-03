/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Play, Pause, RotateCcw, FastForward, Clock } from 'lucide-react';
import { Match, MatchEvent } from '../../types/football';

export const DataReplayScrubber: React.FC<{ match: Match }> = ({ match }) => {
  const [currentMinute, setCurrentMinute] = useState<number>(
    match.status === 'LIVE' ? match.minute || 60 : 90
  );
  const [isPlaying, setIsPlaying] = useState(false);

  const maxMinute = match.events.some((e) => e.minute > 90) ? 120 : 90;

  // Compute active score up to currentMinute
  const activeEvents = match.events.filter((e) => e.minute <= currentMinute);

  let homeScore = 0;
  let awayScore = 0;

  activeEvents.forEach((e) => {
    if (e.type === 'GOAL' || e.type === 'PENALTY_GOAL') {
      if (e.isHomeTeam) homeScore++;
      else awayScore++;
    }
  });

  // Playback timer
  React.useEffect(() => {
    let interval: number | null = null;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setCurrentMinute((prev) => {
          if (prev >= maxMinute) {
            setIsPlaying(false);
            return maxMinute;
          }
          return prev + 1;
        });
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, maxMinute]);

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 sm:p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">Chronological Match Replay</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentMinute(0);
            }}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Reset to kickoff"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Dynamic Scoreboard At Scrubber Minute */}
      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-center">
        <div className="text-left">
          <div className="text-xs font-semibold text-slate-300">{match.homeTeam.name}</div>
          <div className="font-mono text-2xl font-black text-white">{homeScore}</div>
        </div>

        <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-emerald-400 font-mono text-xs font-bold">
          Minute: {currentMinute}'
        </div>

        <div className="text-right">
          <div className="text-xs font-semibold text-slate-300">{match.awayTeam.name}</div>
          <div className="font-mono text-2xl font-black text-white">{awayScore}</div>
        </div>
      </div>

      {/* Interactive Slider */}
      <div className="relative pt-2">
        <input
          type="range"
          min="0"
          max={maxMinute}
          value={currentMinute}
          onChange={(e) => {
            setIsPlaying(false);
            setCurrentMinute(Number(e.target.value));
          }}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
        />

        {/* Event Markers on Timeline */}
        <div className="relative w-full h-4 mt-1">
          {match.events.map((e) => {
            const leftPct = (e.minute / maxMinute) * 100;
            const isGoal = e.type === 'GOAL' || e.type === 'PENALTY_GOAL';
            const isCard = e.type === 'YELLOW_CARD' || e.type === 'RED_CARD';

            return (
              <div
                key={`pip-${e.id}`}
                className="absolute top-0 transform -translate-x-1/2 cursor-pointer group"
                style={{ left: `${leftPct}%` }}
                onClick={() => setCurrentMinute(e.minute)}
                title={`${e.minute}' - ${e.playerName} (${e.type})`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    isGoal
                      ? 'bg-emerald-400 ring-2 ring-emerald-950'
                      : isCard
                      ? 'bg-amber-400 ring-2 ring-amber-950'
                      : 'bg-sky-400'
                  }`}
                />
                <div className="hidden group-hover:block absolute bottom-4 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-[10px] text-white whitespace-nowrap z-30 shadow-lg">
                  {e.minute}' {e.playerName} ({e.type})
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Events Happened By This Minute */}
      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
        {activeEvents.length === 0 ? (
          <div className="text-xs text-slate-500 italic text-center py-2">
            No events before {currentMinute}'
          </div>
        ) : (
          activeEvents.map((e) => (
            <div
              key={`replay-ev-${e.id}`}
              className="flex items-center justify-between text-xs py-1 px-2.5 rounded bg-slate-950/60 border border-slate-800/60"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-emerald-400 text-[11px]">{e.minute}'</span>
                <span className="text-slate-200">{e.playerName}</span>
                <span className="text-[10px] text-slate-400">({e.teamName})</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">{e.type.replace('_', ' ')}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
