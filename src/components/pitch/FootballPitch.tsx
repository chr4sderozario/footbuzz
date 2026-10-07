/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Football Pitch Tactical & Lineup Visualization Component
 */

import React, { useState } from 'react';
import { LineupPlayer, TacticalPhase } from '../../types/football';
import { Shield, Star } from 'lucide-react';

interface FootballPitchProps {
  homePlayers?: LineupPlayer[];
  awayPlayers?: LineupPlayer[];
  homeColor?: string;
  awayColor?: string;
  homeTeamName?: string;
  awayTeamName?: string;
  tacticalPhase?: TacticalPhase;
  showPassingLines?: boolean;
  showPossessionZones?: boolean;
  onPlayerClick?: (player: LineupPlayer) => void;
  selectedPlayerId?: string | null;
  interactive?: boolean;
  viewMode?: 'both' | 'home' | 'away';
}

export const FootballPitch: React.FC<FootballPitchProps> = ({
  homePlayers = [],
  awayPlayers = [],
  homeColor = '#38bdf8',
  awayColor = '#f43f5e',
  homeTeamName = 'Home Team',
  awayTeamName = 'Away Team',
  tacticalPhase,
  showPassingLines = true,
  showPossessionZones = false,
  onPlayerClick,
  selectedPlayerId,
  viewMode = 'both',
}) => {
  const [hoveredPlayer, setHoveredPlayer] = useState<LineupPlayer | null>(null);

  // If tactical phase nodes are provided, use them for positions
  const displayHomePlayers = tacticalPhase
    ? tacticalPhase.homeNodes.map((n) => {
        const matchingLineup = homePlayers.find((p) => p.playerId === n.playerId);
        const rawName = matchingLineup?.name || n.name || '';
        const cleanName = rawName.replace(/^Player\s+\d+$/i, '').trim() || matchingLineup?.name || (homeTeamName ? `${homeTeamName} #${n.number}` : `#${n.number}`);
        return {
          playerId: n.playerId,
          name: cleanName,
          number: n.number,
          position: (matchingLineup?.position || 'MF') as LineupPlayer['position'],
          role: matchingLineup?.role || 'Midfielder',
          gridPos: { x: n.x, y: n.y },
          rating: matchingLineup?.rating,
          isCaptain: matchingLineup?.isCaptain,
          yellowCards: matchingLineup?.yellowCards,
          goals: matchingLineup?.goals,
        };
      })
    : homePlayers;

  const displayAwayPlayers = tacticalPhase
    ? tacticalPhase.awayNodes.map((n) => {
        const matchingLineup = awayPlayers.find((p) => p.playerId === n.playerId);
        const rawName = matchingLineup?.name || n.name || '';
        const cleanName = rawName.replace(/^Player\s+\d+$/i, '').trim() || matchingLineup?.name || (awayTeamName ? `${awayTeamName} #${n.number}` : `#${n.number}`);
        return {
          playerId: n.playerId,
          name: cleanName,
          number: n.number,
          position: (matchingLineup?.position || 'MF') as LineupPlayer['position'],
          role: matchingLineup?.role || 'Midfielder',
          gridPos: { x: n.x, y: n.y },
          rating: matchingLineup?.rating,
          isCaptain: matchingLineup?.isCaptain,
          yellowCards: matchingLineup?.yellowCards,
          goals: matchingLineup?.goals,
        };
      })
    : awayPlayers;

  return (
    <div className="relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-emerald-900/60 bg-slate-950 select-none">
      {/* Pitch Header / Team Shapes Info */}
      {tacticalPhase && (
        <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: homeColor }} />
            <span className="font-semibold text-white">{homeTeamName}</span>
            <span className="text-slate-400 font-mono text-[11px]">{tacticalPhase.homeShape}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono text-[11px]">{tacticalPhase.awayShape}</span>
            <span className="font-semibold text-white">{awayTeamName}</span>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: awayColor }} />
          </div>
        </div>
      )}

      {/* SVG Grass Pitch */}
      <div className="relative w-full aspect-[68/105] max-h-[640px] pitch-pattern">
        <svg
          viewBox="0 0 680 1050"
          className="absolute inset-0 w-full h-full"
          style={{ stroke: 'rgba(255, 255, 255, 0.45)', strokeWidth: 4, fill: 'none' }}
        >
          {/* Pitch Outer Boundary */}
          <rect x="30" y="30" width="620" height="990" rx="4" />

          {/* Halfway Line */}
          <line x1="30" y1="525" x2="650" y2="525" />

          {/* Center Circle & Spot */}
          <circle cx="340" cy="525" r="91.5" />
          <circle cx="340" cy="525" r="4" fill="rgba(255, 255, 255, 0.7)" />

          {/* Top Penalty Area (Away Goal) */}
          <rect x="139" y="30" width="402" height="165" />
          <rect x="238" y="30" width="204" height="55" />
          <circle cx="340" cy="140" r="4" fill="rgba(255, 255, 255, 0.7)" />
          {/* Penalty Arc Top */}
          <path d="M 268,195 A 91.5 91.5 0 0 0 412,195" />
          {/* Goal Box Top */}
          <rect x="280" y="10" width="120" height="20" stroke="rgba(255, 255, 255, 0.6)" fill="rgba(255,255,255,0.08)" />

          {/* Bottom Penalty Area (Home Goal) */}
          <rect x="139" y="855" width="402" height="165" />
          <rect x="238" y="965" width="204" height="55" />
          <circle cx="340" cy="910" r="4" fill="rgba(255, 255, 255, 0.7)" />
          {/* Penalty Arc Bottom */}
          <path d="M 268,855 A 91.5 91.5 0 0 1 412,855" />
          {/* Goal Box Bottom */}
          <rect x="280" y="1020" width="120" height="20" stroke="rgba(255, 255, 255, 0.6)" fill="rgba(255,255,255,0.08)" />

          {/* Corner Arcs */}
          <path d="M 30,50 A 20 20 0 0 0 50,30" />
          <path d="M 630,30 A 20 20 0 0 0 650,50" />
          <path d="M 30,1000 A 20 20 0 0 1 50,1020" />
          <path d="M 630,1020 A 20 20 0 0 1 650,1000" />

          {/* Possession Zone Lines & Overlays */}
          {showPossessionZones && tacticalPhase && tacticalPhase.possessionZones && (
            <g className="transition-opacity duration-300">
              <rect x="30" y="30" width="620" height="330" fill="rgba(244, 63, 94, 0.12)" />
              <rect x="30" y="360" width="620" height="330" fill="rgba(234, 179, 8, 0.08)" />
              <rect x="30" y="690" width="620" height="330" fill="rgba(56, 189, 248, 0.12)" />

              <text x="50" y="195" fill="rgba(255, 255, 255, 0.85)" fontSize="20" fontFamily="sans-serif" fontWeight="bold">
                Attacking Third: {tacticalPhase.possessionZones.attThird}%
              </text>
              <text x="50" y="525" fill="rgba(255, 255, 255, 0.85)" fontSize="20" fontFamily="sans-serif" fontWeight="bold">
                Midfield Third: {tacticalPhase.possessionZones.midThird}%
              </text>
              <text x="50" y="855" fill="rgba(255, 255, 255, 0.85)" fontSize="20" fontFamily="sans-serif" fontWeight="bold">
                Defensive Third: {tacticalPhase.possessionZones.defThird}%
              </text>
            </g>
          )}

          {/* Passing Network Lines */}
          {showPassingLines &&
            displayHomePlayers.length > 2 &&
            displayHomePlayers.slice(0, 7).map((p1, idx) => {
              const p2 = displayHomePlayers[(idx + 1) % displayHomePlayers.length];
              const p1Pos = p1.gridPos || { x: 50, y: 50 };
              const p2Pos = p2.gridPos || { x: 50, y: 50 };
              const x1 = (p1Pos.x / 100) * 620 + 30;
              const y1 = (p1Pos.y / 100) * 990 + 30;
              const x2 = (p2Pos.x / 100) * 620 + 30;
              const y2 = (p2Pos.y / 100) * 990 + 30;

              return (
                <line
                  key={`pass-line-${idx}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={homeColor}
                  strokeWidth="2.5"
                  strokeOpacity="0.35"
                  strokeDasharray="4 3"
                />
              );
            })}
        </svg>

        {/* Home Players Nodes */}
        {(viewMode === 'both' || viewMode === 'home') &&
          displayHomePlayers.map((player) => {
            const isSelected = selectedPlayerId === player.playerId;
            const pos = player.gridPos || { x: 50, y: 50 };
            return (
              <div
                key={`home-player-${player.playerId}`}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 group z-20"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                }}
                onClick={() => onPlayerClick && onPlayerClick(player)}
                onMouseEnter={() => setHoveredPlayer(player)}
                onMouseLeave={() => setHoveredPlayer(null)}
              >
                <div
                  className={`relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full font-bold text-white shadow-lg transition-transform ${
                    isSelected ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-emerald-950' : 'group-hover:scale-110'
                  }`}
                  style={{
                    backgroundColor: homeColor,
                    border: '1.5px solid #ffffff',
                  }}
                >
                  <span className="text-[11px] sm:text-xs font-mono font-black drop-shadow-md">
                    {player.number}
                  </span>

                  {/* Captain Armband */}
                  {player.isCaptain && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 text-slate-950 rounded-full flex items-center justify-center text-[8px] font-black shadow-sm">
                      C
                    </span>
                  )}

                  {/* Card indicator */}
                  {(player.yellowCards ?? 0) > 0 && (
                    <span className="absolute -bottom-1 -right-1 w-2.5 h-3.5 bg-amber-400 rounded-xs shadow-sm border border-slate-900" />
                  )}

                  {/* Goal star */}
                  {(player.goals ?? 0) > 0 && (
                    <span className="absolute -top-1 -left-1 w-3.5 h-3.5 bg-emerald-400 text-slate-950 rounded-full flex items-center justify-center text-[8px] shadow-sm">
                      ⚽
                    </span>
                  )}
                </div>

                {/* Player Name Pill */}
                <div className="mt-1 px-1.5 py-0.5 rounded bg-slate-950/90 border border-slate-700/80 text-[10px] sm:text-[11px] text-slate-100 font-medium whitespace-nowrap shadow-md text-center max-w-[80px] truncate">
                  {player.name}
                  {player.rating && (
                    <span className="ml-1 text-[9px] font-mono text-emerald-400 font-bold">
                      {player.rating.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

        {/* Away Players Nodes */}
        {(viewMode === 'both' || viewMode === 'away') &&
          displayAwayPlayers.map((player) => {
            const isSelected = selectedPlayerId === player.playerId;
            const pos = player.gridPos || { x: 50, y: 50 };
            return (
              <div
                key={`away-player-${player.playerId}`}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 group z-20"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                }}
                onClick={() => onPlayerClick && onPlayerClick(player)}
                onMouseEnter={() => setHoveredPlayer(player)}
                onMouseLeave={() => setHoveredPlayer(null)}
              >
                <div
                  className={`relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full font-bold text-white shadow-lg transition-transform ${
                    isSelected ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-emerald-950' : 'group-hover:scale-110'
                  }`}
                  style={{
                    backgroundColor: awayColor,
                    border: '1.5px solid #ffffff',
                  }}
                >
                  <span className="text-[11px] sm:text-xs font-mono font-black drop-shadow-md">
                    {player.number}
                  </span>

                  {player.isCaptain && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 text-slate-950 rounded-full flex items-center justify-center text-[8px] font-black shadow-sm">
                      C
                    </span>
                  )}

                  {(player.yellowCards ?? 0) > 0 && (
                    <span className="absolute -bottom-1 -right-1 w-2.5 h-3.5 bg-amber-400 rounded-xs shadow-sm border border-slate-900" />
                  )}
                </div>

                <div className="mt-1 px-1.5 py-0.5 rounded bg-slate-950/90 border border-slate-700/80 text-[10px] sm:text-[11px] text-slate-100 font-medium whitespace-nowrap shadow-md text-center max-w-[80px] truncate">
                  {player.name}
                  {player.rating && (
                    <span className="ml-1 text-[9px] font-mono text-rose-400 font-bold">
                      {player.rating.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* Tactical Phase Commentary Note */}
      {tacticalPhase?.description && (
        <div className="p-3 bg-slate-900/90 border-t border-slate-800 text-xs text-slate-300 leading-relaxed">
          <span className="text-emerald-400 font-semibold mr-1.5">Tactical Analysis:</span>
          {tacticalPhase.description}
        </div>
      )}
    </div>
  );
};
