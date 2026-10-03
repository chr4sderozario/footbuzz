/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ArrowLeft,
  Heart,
  Trophy,
  Calendar,
  ArrowRightLeft,
} from 'lucide-react';
import { footballApi } from '../../services/footballApi';
import { useApp } from '../../context/AppContext';
import { PlayerComparisonModal } from './PlayerComparisonModal';
import { PlayerAvatar } from '../common/PlayerAvatar';

export const PlayerDetailPage: React.FC<{ playerId: string }> = ({ playerId }) => {
  const player = footballApi.getPlayerById(playerId);
  const { navigateTo, isPlayerFollowed, toggleFollowPlayer } = useApp();
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  if (!player) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
        Player not found.{' '}
        <button onClick={() => navigateTo('players')} className="text-[#009270] font-bold underline">
          Back to Players
        </button>
      </div>
    );
  }

  const isFollowed = isPlayerFollowed(player.id);

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Back Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo('players')}
          className="flex items-center gap-1.5 text-xs font-bold text-[#009270] hover:underline transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Players</span>
        </button>

        <button
          onClick={() => setCompareModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-[#009270] text-xs font-bold text-slate-700 transition-colors shadow-2xs"
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-[#009270]" />
          <span>Compare Player</span>
        </button>
      </div>

      {/* Header Profile Banner */}
      <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-5">
          <PlayerAvatar
            id={player.id}
            name={player.name}
            photoUrl={player.photoUrl}
            number={player.number}
            size="2xl"
            className="border-2 border-[#009270] shadow-md"
          />

          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <button
                onClick={() => navigateTo('team-detail', { teamId: player.currentTeamId })}
                className="font-extrabold text-[#009270] hover:underline"
              >
                {player.currentTeamName}
              </button>
              <span>·</span>
              <span>{player.nationality}</span>
              <span>·</span>
              <span>Age {player.age}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display mt-0.5">
              {player.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-2">
              <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200">
                Position: <strong>{player.detailedPosition}</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200">
                Preferred Foot: <strong>{player.preferredFoot}</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200">
                Height: <strong>{player.height}</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => toggleFollowPlayer(player.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
              isFollowed
                ? 'bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100'
                : 'bg-[#009270] hover:bg-[#028060] text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFollowed ? 'fill-current text-rose-600' : ''}`} />
            <span>{isFollowed ? 'Tracked Player' : 'Track Player'}</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 text-center shadow-xs">
          <div className="text-[11px] text-slate-500 uppercase font-bold">Form Rating</div>
          <div className="font-mono text-3xl font-black text-[#009270] mt-1">
            {player.seasonStats.rating.toFixed(1)}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 text-center shadow-xs">
          <div className="text-[11px] text-slate-500 uppercase font-bold">Goals Scored</div>
          <div className="font-mono text-3xl font-black text-slate-900 mt-1">
            {player.seasonStats.goals}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 text-center shadow-xs">
          <div className="text-[11px] text-slate-500 uppercase font-bold">Assists</div>
          <div className="font-mono text-3xl font-black text-slate-900 mt-1">
            {player.seasonStats.assists}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 text-center shadow-xs">
          <div className="text-[11px] text-slate-500 uppercase font-bold">Pass Accuracy</div>
          <div className="font-mono text-3xl font-black text-slate-900 mt-1">
            {player.seasonStats.passAccuracy}%
          </div>
        </div>
      </div>

      {/* Career History & Achievements Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Achievements */}
        <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" /> Career Honours & Verified Records
          </h3>
          <div className="space-y-2.5">
            {(player.achievements || []).map((ach: string, idx: number) => (
              <div
                key={`ach-${idx}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>{ach}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Club Career Record Timeline */}
        <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#009270]" /> Career Log & Appearances
          </h3>
          <div className="space-y-2.5">
            {(player.careerStats || []).map((c: any, idx: number) => (
              <div
                key={`cs-${idx}`}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900">{c.club}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{c.season}</div>
                </div>
                <div className="text-right font-mono">
                  <div className="font-bold text-slate-900">{c.appearances} Apps · {c.goals} Goals</div>
                  <div className="text-[10px] text-slate-500">{c.assists} Assists</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Modal */}
      {compareModalOpen && (
        <PlayerComparisonModal
          initialPlayerIdA={player.id}
          onClose={() => setCompareModalOpen(false)}
        />
      )}
    </div>
  );
};
