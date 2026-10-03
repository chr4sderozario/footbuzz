/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Smooth Animated Player Head-to-Head Comparison
 * Slide-in entrance, central VS animation, and staggered metric reveals.
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowRightLeft,
  Activity,
  Heart,
  ExternalLink,
  Shield,
  Trophy,
} from 'lucide-react';
import { Player } from '../../types/football';
import { footballApi } from '../../services/footballApi';
import { useApp } from '../../context/AppContext';
import { PlayerAvatar } from '../common/PlayerAvatar';

interface PlayerComparisonModalProps {
  initialPlayerIdA: string;
  initialPlayerIdB?: string;
  isOpen?: boolean;
  onClose: () => void;
}

export const PlayerComparisonModal: React.FC<PlayerComparisonModalProps> = ({
  initialPlayerIdA,
  initialPlayerIdB,
  isOpen = true,
  onClose,
}) => {
  if (!isOpen) return null;

  const { isPlayerFollowed, toggleFollowPlayer, navigateTo } = useApp();
  const allPlayers = footballApi.getPlayers();

  const [playerIdA, setPlayerIdA] = useState<string>(initialPlayerIdA || (allPlayers[0] ? allPlayers[0].id : ''));
  const [playerIdB, setPlayerIdB] = useState<string>(
    initialPlayerIdB ||
      allPlayers.find((p) => p.id !== initialPlayerIdA)?.id ||
      (allPlayers[1] ? allPlayers[1].id : allPlayers[0]?.id || '')
  );

  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    setIsRevealed(false);
    const timer = setTimeout(() => {
      setIsRevealed(true);
    }, 150);
    return () => clearTimeout(timer);
  }, [playerIdA, playerIdB]);

  const playerA = footballApi.getPlayerById(playerIdA);
  const playerB = footballApi.getPlayerById(playerIdB);

  if (!playerA || !playerB) return null;

  const statsA = playerA.seasonStats;
  const statsB = playerB.seasonStats;

  const renderComparisonRow = (
    label: string,
    valA: number,
    valB: number,
    isPercentage: boolean = false,
    delayMs: number = 0
  ) => {
    const total = valA + valB === 0 ? 1 : valA + valB;
    const pctA = Math.round((valA / total) * 100);
    const pctB = 100 - pctA;

    const isAHigher = valA > valB;
    const isBHigher = valB > valA;

    return (
      <div
        className={`py-3 border-b border-slate-100 transition-all duration-500 transform ${
          isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
        style={{ transitionDelay: `${delayMs}ms` }}
      >
        <div className="flex items-center justify-between text-xs pb-1.5 font-bold">
          <span className={`font-mono ${isAHigher ? 'text-[#009270] font-black' : 'text-slate-800'}`}>
            {valA}
            {isPercentage ? '%' : ''}
          </span>
          <span className="text-slate-500 uppercase tracking-wider text-[11px] font-sans font-medium">
            {label}
          </span>
          <span className={`font-mono ${isBHigher ? 'text-[#132257] font-black' : 'text-slate-800'}`}>
            {valB}
            {isPercentage ? '%' : ''}
          </span>
        </div>

        {/* Dual Progress Bar */}
        <div className="flex h-2 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200">
          <div
            className="h-full bg-[#009270] transition-all duration-700 rounded-l-full"
            style={{ width: `${pctA}%` }}
          />
          <div
            className="h-full bg-[#132257] transition-all duration-700 rounded-r-full"
            style={{ width: `${pctB}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden text-slate-800 my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-[#009270]">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black font-display text-white">
                Player Head-to-Head Comparison
              </h2>
              <p className="text-xs text-slate-400">
                Verified 2026/27 season statistics · Neutral user comparison
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Player Selector Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 shrink-0">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Select Player A
            </label>
            <select
              value={playerIdA}
              onChange={(e) => setPlayerIdA(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-[#009270]"
            >
              {allPlayers.map((p) => (
                <option key={`pa-${p.id}`} value={p.id}>
                  {p.name} ({p.currentTeamName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Select Player B
            </label>
            <select
              value={playerIdB}
              onChange={(e) => setPlayerIdB(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-[#132257]"
            >
              {allPlayers.map((p) => (
                <option key={`pb-${p.id}`} value={p.id}>
                  {p.name} ({p.currentTeamName})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dual Card Showcase with Central Animated VS */}
        <div className="p-6 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200 grid grid-cols-3 items-center gap-4 text-center shrink-0">
          {/* Player A Card */}
          <div className="flex flex-col items-center space-y-2 animate-in slide-in-from-left duration-300">
            <PlayerAvatar
              id={playerA.id}
              name={playerA.name}
              photoUrl={playerA.photoUrl}
              number={playerA.shirtNumber}
              size="lg"
              className="border-2 border-[#009270] shadow-md"
            />
            <div>
              <div className="font-black text-sm sm:text-base text-slate-900 truncate max-w-[140px]">
                {playerA.name}
              </div>
              <div className="text-[11px] font-bold text-[#009270]">{playerA.position} · #{playerA.shirtNumber}</div>
              <div className="text-[10px] text-slate-500 truncate max-w-[140px]">{playerA.currentTeamName}</div>
            </div>
          </div>

          {/* Central Animated VS Emblem */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900 text-white font-black font-mono text-sm sm:text-base flex items-center justify-center shadow-lg animate-pulse ring-4 ring-slate-100">
              VS
            </div>
            <span className="text-[10px] text-slate-400 font-mono mt-1">2026/27</span>
          </div>

          {/* Player B Card */}
          <div className="flex flex-col items-center space-y-2 animate-in slide-in-from-right duration-300">
            <PlayerAvatar
              id={playerB.id}
              name={playerB.name}
              photoUrl={playerB.photoUrl}
              number={playerB.shirtNumber}
              size="lg"
              className="border-2 border-[#132257] shadow-md"
            />
            <div>
              <div className="font-black text-sm sm:text-base text-slate-900 truncate max-w-[140px]">
                {playerB.name}
              </div>
              <div className="text-[11px] font-bold text-[#132257]">{playerB.position} · #{playerB.shirtNumber}</div>
              <div className="text-[10px] text-slate-500 truncate max-w-[140px]">{playerB.currentTeamName}</div>
            </div>
          </div>
        </div>

        {/* Comparison Metrics List */}
        <div className="p-6 overflow-y-auto space-y-1 flex-1">
          {renderComparisonRow('Appearances', statsA.appearances, statsB.appearances, false, 50)}
          {renderComparisonRow('Minutes Played', statsA.minutesPlayed, statsB.minutesPlayed, false, 100)}
          {renderComparisonRow('Goals', statsA.goals, statsB.goals, false, 150)}
          {renderComparisonRow('Assists', statsA.assists, statsB.assists, false, 200)}
          {renderComparisonRow('Shots on Target', statsA.shotsOnTarget, statsB.shotsOnTarget, false, 250)}
          {renderComparisonRow('Total Shots', statsA.shotsTotal, statsB.shotsTotal, false, 300)}
          {renderComparisonRow('Pass Accuracy', statsA.passAccuracy, statsB.passAccuracy, true, 350)}
          {renderComparisonRow('Key Passes', statsA.keyPasses, statsB.keyPasses, false, 400)}
          {renderComparisonRow('Tackles Won', statsA.tacklesWon, statsB.tacklesWon, false, 450)}
          {renderComparisonRow('Interceptions', statsA.interceptions, statsB.interceptions, false, 500)}
          {renderComparisonRow('Yellow Cards', statsA.yellowCards, statsB.yellowCards, false, 550)}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => {
              onClose();
              navigateTo('player-detail', { playerId: playerIdA });
            }}
            className="text-xs font-bold text-[#009270] hover:underline flex items-center gap-1"
          >
            <span>View {playerA.shortName}</span>
            <ExternalLink className="w-3 h-3" />
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors"
          >
            Close Comparison
          </button>

          <button
            onClick={() => {
              onClose();
              navigateTo('player-detail', { playerId: playerIdB });
            }}
            className="text-xs font-bold text-[#132257] hover:underline flex items-center gap-1"
          >
            <span>View {playerB.shortName}</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
