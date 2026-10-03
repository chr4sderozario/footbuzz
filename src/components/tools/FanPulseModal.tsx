/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Fan Pulse & Global Crowd Sentiment Modal
 */

import React, { useState } from 'react';
import { Flame, Users, Check, X, Sparkles, Trophy } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { footballApi } from '../../services/footballApi';
import { Match } from '../../types/football';
import { ClubCrest } from '../common/ClubCrest';

export const FanPulseModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { addToast } = useApp();
  const [matches] = useState<Match[]>(() => footballApi.getAllMatches());

  const [votes, setVotes] = useState<Record<string, 'HOME' | 'DRAW' | 'AWAY'>>(() => {
    try {
      const saved = localStorage.getItem('footbuzz_fan_pulse_votes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  if (!isOpen) return null;

  const handleVote = (matchId: string, pick: 'HOME' | 'DRAW' | 'AWAY') => {
    const updated = { ...votes, [matchId]: pick };
    setVotes(updated);
    try {
      localStorage.setItem('footbuzz_fan_pulse_votes', JSON.stringify(updated));
    } catch {}
    addToast('Sentiment Recorded', 'Your match prediction vote has been added to the pulse tally.', 'SUCCESS');
  };

  const sampleFixtures = matches.slice(0, 6);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-mono font-bold tracking-wide">
            <Flame className="w-3.5 h-3.5 fill-current text-yellow-300" />
            <span>GLOBAL FAN SENTIMENT PULSE</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-display mt-2 text-white">
            Fan Pulse & Crowd Sentiment Radar
          </h2>
          <p className="text-xs text-amber-100 mt-1">
            Cast your vote on upcoming match outcomes and witness real-time global consensus.
          </p>
        </div>

        {/* Matches Voting List */}
        <div className="p-4 overflow-y-auto space-y-3 max-h-[60vh]">
          {sampleFixtures.map((m) => {
            const userPick = votes[m.id];
            return (
              <div
                key={m.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-orange-400 transition-all space-y-3"
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold text-[#009270]">{m.competitionName}</span>
                  <span className="font-mono">{m.time}</span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <ClubCrest name={m.homeTeam.name} code={m.homeTeam.code} crestUrl={m.homeTeam.crestUrl} size="sm" />
                    <span className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                      {m.homeTeam.name}
                    </span>
                  </div>

                  <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-xs font-mono font-bold">
                    VS
                  </span>

                  <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                    <span className="font-bold text-xs sm:text-sm text-slate-900 truncate text-right">
                      {m.awayTeam.name}
                    </span>
                    <ClubCrest name={m.awayTeam.name} code={m.awayTeam.code} crestUrl={m.awayTeam.crestUrl} size="sm" />
                  </div>
                </div>

                {/* Vote Buttons */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    onClick={() => handleVote(m.id, 'HOME')}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all border ${
                      userPick === 'HOME'
                        ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                        : 'bg-white hover:bg-orange-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    1 (Home Win)
                  </button>
                  <button
                    onClick={() => handleVote(m.id, 'DRAW')}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all border ${
                      userPick === 'DRAW'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-white hover:bg-amber-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    X (Draw)
                  </button>
                  <button
                    onClick={() => handleVote(m.id, 'AWAY')}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all border ${
                      userPick === 'AWAY'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'bg-white hover:bg-rose-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    2 (Away Win)
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>{Object.keys(votes).length} match votes cast this session</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
