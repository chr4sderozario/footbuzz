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
  BarChart3,
  MapPin,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { footballApi } from '../../services/footballApi';
import { useApp } from '../../context/AppContext';
import { ClubCrest } from '../common/ClubCrest';
import { MatchCard } from '../matches/MatchCard';

export const TeamDetailPage: React.FC<{ teamId: string }> = ({ teamId }) => {
  const team = footballApi.getTeamById(teamId);
  const players = footballApi.getTeamPlayers(teamId);
  const matches = footballApi.getTeamMatches(teamId);
  const { navigateTo, isTeamFollowed, toggleFollowTeam } = useApp();

  const [activeTab, setActiveTab] = useState<'squad' | 'matches' | 'trophies' | 'stats'>('squad');

  if (!team) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
        Team not found.{' '}
        <button onClick={() => navigateTo('teams')} className="text-[#009270] font-bold underline">
          Back to Teams
        </button>
      </div>
    );
  }

  const isFollowed = isTeamFollowed(team.id);

  const goalkeepers = players.filter((p) => p.position === 'GK');
  const defenders = players.filter((p) => p.position === 'DF');
  const midfielders = players.filter((p) => p.position === 'MF');
  const forwards = players.filter((p) => p.position === 'FW');

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Breadcrumb Back */}
      <button
        onClick={() => navigateTo('teams')}
        className="flex items-center gap-1.5 text-xs font-bold text-[#009270] hover:underline transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Teams</span>
      </button>

      {/* Team Header Banner */}
      <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-5">
          <ClubCrest
            name={team.name}
            code={team.code}
            primaryColor={team.primaryColor}
            secondaryColor={team.secondaryColor}
            size="xl"
          />
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-extrabold text-[#009270] uppercase tracking-wider">
                {team.leagueName}
              </span>
              <span>·</span>
              <span>{team.country}</span>
              <span>·</span>
              <span>Founded {team.founded}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display mt-1">
              {team.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {team.stadium} (Cap: {team.capacity.toLocaleString()})
              </span>
              <span>·</span>
              <span>Manager: <strong className="text-slate-900">{team.manager}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => toggleFollowTeam(team.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
              isFollowed
                ? 'bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100'
                : 'bg-[#009270] hover:bg-[#028060] text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFollowed ? 'fill-current text-rose-600' : ''}`} />
            <span>{isFollowed ? 'Following Club' : 'Follow Club'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl overflow-x-auto shadow-2xs">
        {(
          [
            { id: 'squad', label: 'Squad & Players' },
            { id: 'matches', label: 'Fixtures & Results' },
            { id: 'trophies', label: 'Trophy Cabinet' },
            { id: 'stats', label: 'Club Statistics' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#009270] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. SQUAD TAB */}
      {activeTab === 'squad' && (
        <div className="space-y-6">
          {[
            { title: 'Forwards & Attackers', list: forwards },
            { title: 'Midfielders & Playmakers', list: midfielders },
            { title: 'Defenders & Fullbacks', list: defenders },
            { title: 'Goalkeepers', list: goalkeepers },
          ].map((cat) => (
            <div key={cat.title} className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                {cat.title} ({cat.list.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {cat.list.map((p) => (
                  <div
                    key={`player-${p.id}`}
                    onClick={() => navigateTo('player-detail', { playerId: p.id })}
                    className="p-3.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/90 hover:border-[#009270] hover:shadow-xs cursor-pointer flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 font-mono font-black text-xs text-slate-800 flex items-center justify-center">
                        #{p.number}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 hover:text-[#009270] transition-colors">
                          {p.name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {p.detailedPosition} · {p.nationality}
                        </div>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <div className="text-xs font-black text-[#009270]">
                        {p.seasonStats.rating.toFixed(1)}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {p.seasonStats.goals}G {p.seasonStats.assists}A
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. MATCHES TAB */}
      {activeTab === 'matches' && (
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900">Recent Results & Upcoming Fixtures</h3>
          {matches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matches.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
              No live or scheduled fixtures reported for {team.name} in current data feed.
            </div>
          )}
        </div>
      )}

      {/* 3. TROPHIES TAB */}
      {activeTab === 'trophies' && (
        <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" /> Major Honours & Trophies
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {team.trophies.map((trophy, idx) => (
              <div
                key={`trophy-${idx}`}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">{trophy.title}</div>
                  <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    Years: {trophy.years.join(', ')}
                  </div>
                </div>
                <div className="font-mono text-base font-black text-amber-700 px-2.5 py-1 rounded-lg bg-amber-100/70 border border-amber-300">
                  {trophy.count}x
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. STATS TAB */}
      {activeTab === 'stats' && (
        <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 p-6 space-y-6 shadow-xs">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#009270]" /> Season Statistical Profile
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-slate-500 text-xs">Matches Played</div>
              <div className="font-mono text-2xl font-black text-slate-900 mt-1">
                {team.stats.matchesPlayed}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-slate-500 text-xs">Wins / Draws / Losses</div>
              <div className="font-mono text-xl font-bold text-[#009270] mt-1">
                {team.stats.wins}W · {team.stats.draws}D · {team.stats.losses}L
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-slate-500 text-xs">Goals For / Against</div>
              <div className="font-mono text-2xl font-black text-slate-900 mt-1">
                {team.stats.goalsFor} : {team.stats.goalsAgainst}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-slate-500 text-xs">Average Possession</div>
              <div className="font-mono text-2xl font-black text-slate-900 mt-1">
                {team.stats.possessionAvg}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
