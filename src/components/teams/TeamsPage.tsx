/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Heart, ArrowRight } from 'lucide-react';
import { footballApi } from '../../services/footballApi';
import { useApp } from '../../context/AppContext';
import { ClubCrest } from '../common/ClubCrest';

export const TeamsPage: React.FC = () => {
  const teams = footballApi.getTeams();
  const { navigateTo, isTeamFollowed, toggleFollowTeam } = useApp();
  const [search, setSearch] = useState('');

  const filtered = teams.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.country.toLowerCase().includes(search.toLowerCase()) ||
      t.leagueName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-5 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
            Football Clubs & National Teams
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Explore ISL squads, Premier League giants, La Liga titans, and legendary national teams.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search teams or country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-[#009270]"
          />
        </div>
      </div>

      {/* Grid of Teams */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((team) => {
          const isFollowed = isTeamFollowed(team.id);

          return (
            <div
              key={team.id}
              onClick={() => navigateTo('team-detail', { teamId: team.id })}
              className="group p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 hover:border-[#009270] hover:shadow-md transition-all cursor-pointer space-y-3"
            >
              <div className="flex items-center justify-between">
                <ClubCrest
                  name={team.name}
                  code={team.code}
                  primaryColor={team.primaryColor}
                  secondaryColor={team.secondaryColor}
                  size="lg"
                />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFollowTeam(team.id);
                  }}
                  className={`p-2 rounded-xl border transition-colors ${
                    isFollowed
                      ? 'bg-rose-50 border-rose-200 text-rose-500'
                      : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700'
                  }`}
                  title={isFollowed ? 'Unfollow' : 'Follow Club'}
                >
                  <Heart className={`w-4 h-4 ${isFollowed ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div>
                <h2 className="text-base font-black text-slate-900 group-hover:text-[#009270] transition-colors">
                  {team.name}
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span>{team.leagueName}</span>
                  <span>·</span>
                  <span>{team.country}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Manager: <strong className="text-slate-800">{team.manager}</strong></span>
                <span className="text-[#009270] font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Squad & Profile <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
