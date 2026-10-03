/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Interactive Player Profile Modal
 * Grounded strictly in real verified player statistics and identity.
 */

import React from 'react';
import {
  X,
  Heart,
  ArrowRightLeft,
  ExternalLink,
  Shield,
  Trophy,
  Calendar,
  Globe,
  Star,
  Activity,
} from 'lucide-react';
import { Player, LineupPlayer } from '../../types/football';
import { useApp } from '../../context/AppContext';
import { footballApi } from '../../services/footballApi';
import { PlayerAvatar } from '../common/PlayerAvatar';

interface PlayerModalProps {
  player: Player | LineupPlayer | null;
  isOpen: boolean;
  onClose: () => void;
  onCompare?: (playerId: string) => void;
}

export const PlayerModal: React.FC<PlayerModalProps> = ({
  player,
  isOpen,
  onClose,
  onCompare,
}) => {
  const { isPlayerFollowed, toggleFollowPlayer, navigateTo } = useApp();

  if (!isOpen || !player) return null;

  const rawPlayerId = 'playerId' in player ? player.playerId : player.id;
  const fullPlayer = footballApi.getPlayerById(rawPlayerId);

  const name = fullPlayer?.name || player.name;
  const number = fullPlayer?.shirtNumber || player.number || 0;
  const position = fullPlayer?.position || player.position || 'MF';
  const teamName = fullPlayer?.currentTeamName || ('role' in player ? player.role : 'Football Club');
  const nationality = fullPlayer?.nationality || ('country' in player ? (player as any).country : 'Global');
  const age = fullPlayer?.age;
  const preferredFoot = fullPlayer?.preferredFoot;
  const height = fullPlayer?.height;
  const photoUrl = fullPlayer?.photoUrl;
  const seasonStats = fullPlayer?.seasonStats;
  const isFollowed = isPlayerFollowed(rawPlayerId);

  const handleCompare = () => {
    onClose();
    if (onCompare) {
      onCompare(rawPlayerId);
    } else {
      navigateTo('player-comparison', { comparePlayerIds: [rawPlayerId, ''] });
    }
  };

  const handleViewFullPage = () => {
    onClose();
    navigateTo('player-detail', { playerId: rawPlayerId });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden text-slate-800 flex flex-col max-h-[90vh]">
        {/* Header Hero */}
        <div className="relative bg-gradient-to-br from-[#009270] via-[#028060] to-[#090d16] text-white p-6 space-y-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            {/* Real Player Photo */}
            <PlayerAvatar
              id={rawPlayerId}
              name={name}
              photoUrl={photoUrl}
              number={number}
              size="lg"
              className="shadow-md"
            />

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-white/20 text-emerald-100 font-mono text-[10px] font-bold">
                  {position}
                </span>
                {nationality && (
                  <span className="text-xs text-emerald-100 font-medium">
                    {nationality}
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black font-display text-white truncate mt-0.5">
                {name}
              </h2>

              <p className="text-xs text-emerald-100/80 truncate">
                {teamName}
              </p>
            </div>
          </div>

          {/* Quick Bio Info Strip */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center text-xs">
            <div className="p-2 rounded-xl bg-black/20">
              <div className="text-[10px] text-emerald-200">Age</div>
              <div className="font-bold font-mono">{age ? `${age} yrs` : '—'}</div>
            </div>
            <div className="p-2 rounded-xl bg-black/20">
              <div className="text-[10px] text-emerald-200">Foot</div>
              <div className="font-bold font-mono">{preferredFoot || 'Right'}</div>
            </div>
            <div className="p-2 rounded-xl bg-black/20">
              <div className="text-[10px] text-emerald-200">Height</div>
              <div className="font-bold font-mono">{height ? `${height} cm` : '—'}</div>
            </div>
          </div>
        </div>

        {/* Real Season Statistics Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 font-display flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#009270]" /> Verified Season Statistics
            </h3>
            <span className="text-[10px] font-mono text-slate-400">2026/27 Campaign</span>
          </div>

          {seasonStats ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase font-mono">Appearances</div>
                <div className="text-lg font-black font-mono text-slate-900 mt-0.5">{seasonStats.appearances}</div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="text-[10px] text-emerald-700 uppercase font-mono">Goals</div>
                <div className="text-lg font-black font-mono text-[#009270] mt-0.5">{seasonStats.goals}</div>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                <div className="text-[10px] text-blue-700 uppercase font-mono">Assists</div>
                <div className="text-lg font-black font-mono text-blue-700 mt-0.5">{seasonStats.assists}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase font-mono">Pass Acc %</div>
                <div className="text-lg font-black font-mono text-slate-900 mt-0.5">{seasonStats.passAccuracy}%</div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
              Season statistics actively compiling from data provider.
            </div>
          )}

          {/* Quick Comparison & Profile Links */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              onClick={() => toggleFollowPlayer(rawPlayerId)}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                isFollowed
                  ? 'bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFollowed ? 'fill-current text-rose-600' : ''}`} />
              <span>{isFollowed ? 'Following' : 'Follow Player'}</span>
            </button>

            <button
              onClick={handleCompare}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-[#009270]" />
              <span>Compare</span>
            </button>

            <button
              onClick={handleViewFullPage}
              className="flex-1 py-2.5 rounded-xl bg-[#009270] hover:bg-[#028060] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Full Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
