/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Match Pulse & Fan Sentiment Voting Gauge
 */

import React, { useState } from 'react';
import { Flame, Check, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface FanSentimentGaugeProps {
  matchId: string;
  homeTeamName: string;
  awayTeamName: string;
}

export const FanSentimentGauge: React.FC<FanSentimentGaugeProps> = ({
  matchId,
  homeTeamName,
  awayTeamName,
}) => {
  const { addToast } = useApp();
  const [votedPick, setVotedPick] = useState<'HOME' | 'DRAW' | 'AWAY' | null>(() => {
    try {
      return (localStorage.getItem(`footbuzz_vote_${matchId}`) as any) || null;
    } catch {
      return null;
    }
  });

  const [votes, setVotes] = useState({ home: 58, draw: 14, away: 28 });

  const handleVote = (pick: 'HOME' | 'DRAW' | 'AWAY') => {
    if (votedPick) return;
    setVotedPick(pick);
    try {
      localStorage.setItem(`footbuzz_vote_${matchId}`, pick);
    } catch {}

    setVotes((prev) => ({
      ...prev,
      [pick === 'HOME' ? 'home' : pick === 'DRAW' ? 'draw' : 'away']:
        prev[pick === 'HOME' ? 'home' : pick === 'DRAW' ? 'draw' : 'away'] + 1,
    }));

    addToast('Vote Cast!', `Your match prediction has been submitted.`, 'SUCCESS');
  };

  const total = votes.home + votes.draw + votes.away;
  const pctHome = Math.round((votes.home / total) * 100);
  const pctDraw = Math.round((votes.draw / total) * 100);
  const pctAway = 100 - pctHome - pctDraw;

  return (
    <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-extrabold text-slate-900 flex items-center gap-1.5 font-display">
          <Flame className="w-4 h-4 text-amber-500 fill-current" />
          <span>Match Pulse · Who Will Win?</span>
        </span>
        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          <span>{total.toLocaleString()} Fan Votes</span>
        </span>
      </div>

      {/* Percentage Bar */}
      <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden flex shadow-inner border border-slate-200">
        <div
          style={{ width: `${pctHome}%` }}
          className="h-full bg-[#009270] transition-all duration-500"
          title={`${homeTeamName}: ${pctHome}%`}
        />
        <div
          style={{ width: `${pctDraw}%` }}
          className="h-full bg-amber-400 transition-all duration-500"
          title={`Draw: ${pctDraw}%`}
        />
        <div
          style={{ width: `${pctAway}%` }}
          className="h-full bg-[#132257] transition-all duration-500"
          title={`${awayTeamName}: ${pctAway}%`}
        />
      </div>

      {/* Percentage Labels & Buttons */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <button
          onClick={() => handleVote('HOME')}
          disabled={Boolean(votedPick)}
          className={`p-2 rounded-xl border text-center transition-all ${
            votedPick === 'HOME'
              ? 'border-[#009270] bg-emerald-50 text-[#009270] font-black'
              : 'border-slate-200 hover:border-[#009270] text-slate-700'
          }`}
        >
          <div className="font-bold truncate text-[11px]">{homeTeamName.split(' ')[0]}</div>
          <div className="font-mono font-black text-xs text-[#009270]">{pctHome}%</div>
        </button>

        <button
          onClick={() => handleVote('DRAW')}
          disabled={Boolean(votedPick)}
          className={`p-2 rounded-xl border text-center transition-all ${
            votedPick === 'DRAW'
              ? 'border-amber-500 bg-amber-50 text-amber-700 font-black'
              : 'border-slate-200 hover:border-amber-400 text-slate-700'
          }`}
        >
          <div className="font-bold text-[11px]">Draw</div>
          <div className="font-mono font-black text-xs text-amber-600">{pctDraw}%</div>
        </button>

        <button
          onClick={() => handleVote('AWAY')}
          disabled={Boolean(votedPick)}
          className={`p-2 rounded-xl border text-center transition-all ${
            votedPick === 'AWAY'
              ? 'border-[#132257] bg-blue-50 text-[#132257] font-black'
              : 'border-slate-200 hover:border-[#132257] text-slate-700'
          }`}
        >
          <div className="font-bold truncate text-[11px]">{awayTeamName.split(' ')[0]}</div>
          <div className="font-mono font-black text-xs text-[#132257]">{pctAway}%</div>
        </button>
      </div>
    </div>
  );
};
