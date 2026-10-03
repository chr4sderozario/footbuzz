/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Interactive Player Card Component
 * Supports 3D flip, expand preview, real provider statistics, and Compare action.
 */

import React, { useState } from 'react';
import {
  Shield,
  Star,
  ArrowRightLeft,
  Heart,
  Check,
  ExternalLink,
  RotateCw,
  Trophy,
  User,
  Flame,
} from 'lucide-react';
import { LineupPlayer, Player } from '../../types/football';
import { useApp } from '../../context/AppContext';
import { PlayerAvatar } from '../common/PlayerAvatar';

interface PlayerCardProps {
  player: LineupPlayer | Player;
  teamName?: string;
  teamColor?: string;
  isStartingXI?: boolean;
  onCompare?: (playerId: string) => void;
  onViewProfile?: (playerId: string) => void;
  className?: string;
  variant?: 'grid' | 'compact' | 'lineup';
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  teamName,
  teamColor = '#009270',
  isStartingXI = true,
  onCompare,
  onViewProfile,
  className = '',
  variant = 'lineup',
}) => {
  const { isPlayerFollowed, toggleFollowPlayer, navigateTo } = useApp();
  const [isFlipped, setIsFlipped] = useState(false);

  const playerId = 'playerId' in player ? player.playerId : player.id;
  const isFollowed = isPlayerFollowed(playerId);

  // Position badge colors
  const getPositionColor = (pos: string) => {
    switch (pos?.toUpperCase()) {
      case 'GK':
        return 'bg-amber-500 text-amber-950 border-amber-400';
      case 'DF':
      case 'CB':
      case 'LB':
      case 'RB':
        return 'bg-blue-600 text-white border-blue-500';
      case 'MF':
      case 'CM':
      case 'DM':
      case 'AM':
        return 'bg-emerald-600 text-white border-emerald-500';
      case 'FW':
      case 'ST':
      case 'LW':
      case 'RW':
        return 'bg-rose-600 text-white border-rose-500';
      default:
        return 'bg-slate-700 text-white border-slate-600';
    }
  };

  const numberLabel = player.number || ('shirtNumber' in player ? player.shirtNumber : undefined) || 0;
  const positionLabel = player.position || 'MF';
  const playerName = player.name;
  const captain = 'isCaptain' in player && player.isCaptain;
  const goals = 'goals' in player ? player.goals : ('seasonStats' in player ? player.seasonStats.goals : undefined);
  const assists = 'assists' in player ? player.assists : ('seasonStats' in player ? player.seasonStats.assists : undefined);
  const yellowCards = 'yellowCards' in player ? player.yellowCards : undefined;
  const redCards = 'redCards' in player ? player.redCards : undefined;
  const isSubstituted = 'isSubstituted' in player && player.isSubstituted;
  const subMinute = 'subMinute' in player ? player.subMinute : undefined;
  const photoUrl = 'photoUrl' in player ? player.photoUrl : undefined;
  const nationality = 'nationality' in player ? player.nationality : undefined;

  const handleFlipToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewProfile) {
      onViewProfile(playerId);
    } else {
      navigateTo('player-detail', { playerId });
    }
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCompare) {
      onCompare(playerId);
    } else {
      navigateTo('player-comparison', { comparePlayerIds: [playerId, ''] });
    }
  };

  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFollowPlayer(playerId);
  };

  return (
    <div
      className={`group relative perspective-1000 select-none ${className}`}
      onClick={handleProfileClick}
    >
      <div
        className={`relative w-full rounded-2xl border transition-all duration-500 transform-style-3d cursor-pointer ${
          isFlipped ? 'rotate-y-180' : ''
        } ${
          isStartingXI
            ? 'bg-white/95 border-slate-200/90 shadow-xs hover:shadow-md hover:border-[#009270]'
            : 'bg-slate-50/90 border-slate-200 shadow-2xs hover:border-slate-300'
        }`}
      >
        {/* ========================================================================= */}
        {/* CARD FRONT */}
        {/* ========================================================================= */}
        <div className={`p-3.5 flex flex-col justify-between h-full backface-hidden ${isFlipped ? 'pointer-events-none' : ''}`}>
          {/* Top Row: Number, Position & Quick Flip */}
          <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-mono font-black text-xs flex items-center justify-center shadow-2xs">
                {numberLabel || '#'}
              </span>

              <span className={`px-2 py-0.5 rounded-md font-black text-[10px] font-mono border ${getPositionColor(positionLabel)}`}>
                {positionLabel}
              </span>

              {captain && (
                <span className="px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[10px] shadow-2xs" title="Captain">
                  C
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleFollowClick}
                className={`p-1 rounded-md transition-colors ${
                  isFollowed ? 'text-rose-600' : 'text-slate-400 hover:text-rose-500'
                }`}
                title={isFollowed ? 'Following' : 'Follow Player'}
              >
                <Heart className={`w-3.5 h-3.5 ${isFollowed ? 'fill-current text-rose-600' : ''}`} />
              </button>

              <button
                type="button"
                onClick={handleFlipToggle}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                title="Flip to View Stats"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Player Identity */}
          <div className="py-2.5 flex items-center gap-3">
            {/* Real Player Photo */}
            <div className="relative shrink-0">
              <PlayerAvatar id={playerId} name={playerName} photoUrl={photoUrl} size="sm" />
              {isSubstituted && (
                <div className="absolute inset-0 bg-slate-900/60 rounded-2xl flex items-center justify-center text-[10px] font-bold text-amber-300">
                  {subMinute ? `${subMinute}'` : 'SUB'}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="font-extrabold text-xs text-slate-900 truncate group-hover:text-[#009270] transition-colors">
                {playerName}
              </div>
              <div className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                {nationality && <span>{nationality}</span>}
                {nationality && teamName && <span>·</span>}
                {teamName && <span className="truncate">{teamName}</span>}
              </div>
            </div>
          </div>

          {/* Match Events / Key Stats Footer */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
            <div className="flex items-center gap-2">
              {goals !== undefined && goals > 0 && (
                <span className="font-bold text-[#009270] flex items-center gap-0.5">
                  ⚽ {goals}
                </span>
              )}
              {assists !== undefined && assists > 0 && (
                <span className="font-bold text-blue-600 flex items-center gap-0.5">
                  🅰️ {assists}
                </span>
              )}
              {yellowCards !== undefined && yellowCards > 0 && (
                <span className="font-bold text-amber-600 flex items-center gap-0.5">
                  🟨 {yellowCards}
                </span>
              )}
              {redCards !== undefined && redCards > 0 && (
                <span className="font-bold text-rose-600 flex items-center gap-0.5">
                  🔴 {redCards}
                </span>
              )}
              {!goals && !assists && !yellowCards && !redCards && (
                <span className="text-slate-400 text-[10px] font-mono">
                  {isStartingXI ? 'Starting XI' : 'Substitute'}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCompareClick}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center gap-1 transition-colors"
                title="Compare Player"
              >
                <ArrowRightLeft className="w-3 h-3 text-[#009270]" />
                <span className="hidden sm:inline">Compare</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CARD BACK / EXPANDED STATS */}
        {/* ========================================================================= */}
        <div
          className={`absolute inset-0 p-3.5 rounded-2xl bg-slate-900 text-white flex flex-col justify-between backface-hidden rotate-y-180 ${
            !isFlipped ? 'pointer-events-none' : ''
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="truncate min-w-0 pr-2">
              <div className="font-black text-xs text-white truncate">{playerName}</div>
              <div className="text-[10px] text-slate-400 truncate">{positionLabel} · {teamName || 'Football'}</div>
            </div>
            <button
              type="button"
              onClick={handleFlipToggle}
              className="p-1 text-slate-400 hover:text-white rounded-md transition-colors"
              title="Flip Back"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Real Stats Overview */}
          <div className="grid grid-cols-2 gap-2 py-2 text-xs">
            <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Goals</div>
              <div className="font-mono font-black text-emerald-400 text-base">{goals ?? 0}</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Assists</div>
              <div className="font-mono font-black text-blue-400 text-base">{assists ?? 0}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleCompareClick}
              className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-200 flex items-center justify-center gap-1 transition-colors"
            >
              <ArrowRightLeft className="w-3 h-3 text-[#009270]" />
              <span>Compare</span>
            </button>

            <button
              type="button"
              onClick={handleProfileClick}
              className="flex-1 py-1.5 rounded-lg bg-[#009270] hover:bg-[#028060] text-[10px] font-black text-white flex items-center justify-center gap-1 transition-colors shadow-xs"
            >
              <span>Profile</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
