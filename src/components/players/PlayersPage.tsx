/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Star, Heart, ArrowRight } from 'lucide-react';
import { footballApi } from '../../services/footballApi';
import { useApp } from '../../context/AppContext';
import { PlayerAvatar } from '../common/PlayerAvatar';

export const PlayersPage: React.FC = () => {
  const allPlayers = footballApi.getPlayers();
  const { navigateTo, isPlayerFollowed, toggleFollowPlayer } = useApp();

  const [positionFilter, setPositionFilter] = useState<'ALL' | 'FW' | 'MF' | 'DF' | 'LEGENDS'>('ALL');
  const [search, setSearch] = useState('');

  const filtered = allPlayers.filter((p) => {
    if (positionFilter === 'LEGENDS' && !p.isLegend) return false;
    if (positionFilter === 'FW' && p.position !== 'FW') return false;
    if (positionFilter === 'MF' && p.position !== 'MF') return false;
    if (positionFilter === 'DF' && p.position !== 'DF' && p.position !== 'GK') return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const text = `${p.name} ${p.nationality} ${p.currentTeamName} ${p.detailedPosition}`.toLowerCase();
      if (!text.includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-5 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
            Football Players & Icons
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Player performance ratings, goal records, ISL heroes, and world legends.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search player, nation, club..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-[#009270]"
          />
        </div>
      </div>

      {/* Position Filter Pills */}
      <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl overflow-x-auto shadow-2xs">
        {(
          [
            { id: 'ALL', label: 'All Players' },
            { id: 'FW', label: 'Forwards' },
            { id: 'MF', label: 'Midfielders' },
            { id: 'DF', label: 'Defenders & GK' },
            { id: 'LEGENDS', label: '★ Historic Legends' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setPositionFilter(tab.id)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              positionFilter === tab.id
                ? 'bg-[#009270] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Players Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((player) => {
          const isFollowed = isPlayerFollowed(player.id);

          return (
            <div
              key={player.id}
              onClick={() => navigateTo('player-detail', { playerId: player.id })}
              className="group p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 hover:border-[#009270] hover:shadow-md transition-all cursor-pointer space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <PlayerAvatar
                    id={player.id}
                    name={player.name}
                    photoUrl={player.photoUrl}
                    number={player.number}
                    size="md"
                  />
                  <div>
                    <h2 className="text-sm font-black text-slate-900 group-hover:text-[#009270] transition-colors flex items-center gap-1.5">
                      <span>{player.name}</span>
                      {player.isLegend && (
                        <span className="px-1.5 py-0.2 bg-amber-400 text-slate-950 rounded text-[9px] font-black">
                          LEGEND
                        </span>
                      )}
                    </h2>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {player.currentTeamName} · {player.nationality}
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFollowPlayer(player.id);
                  }}
                  className={`p-2 rounded-xl border transition-colors ${
                    isFollowed
                      ? 'bg-rose-50 border-rose-200 text-rose-500'
                      : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700'
                  }`}
                  title={isFollowed ? 'Untrack' : 'Track Player'}
                >
                  <Heart className={`w-3.5 h-3.5 ${isFollowed ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Stats Summary Row */}
              <div className="grid grid-cols-3 gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs">
                <div>
                  <div className="text-[10px] text-slate-400">Rating</div>
                  <div className="font-mono font-black text-[#009270]">
                    {player.seasonStats.rating.toFixed(1)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Goals</div>
                  <div className="font-mono font-black text-slate-900">{player.seasonStats.goals}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Assists</div>
                  <div className="font-mono font-black text-slate-900">{player.seasonStats.assists}</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>{player.detailedPosition}</span>
                <span className="text-[#009270] font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  View Profile <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
