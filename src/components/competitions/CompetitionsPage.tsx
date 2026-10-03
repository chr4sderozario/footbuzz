/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Trophy, Globe, Shield, ArrowRight } from 'lucide-react';
import { footballApi } from '../../services/footballApi';
import { useApp } from '../../context/AppContext';
import { CompetitionBadge } from '../common/CompetitionBadge';

export const CompetitionsPage: React.FC = () => {
  const competitions = footballApi.getCompetitions();
  const { navigateTo } = useApp();

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-5 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
          Football Competitions, Leagues & Global Cups
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Explore points tables, top scorers, championship rolls, and schedules from ISL, Premier League, La Liga, UCL, and international tournaments.
        </p>
      </div>

      {/* Grid of competitions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {competitions.map((comp) => (
          <div
            key={comp.id}
            onClick={() => navigateTo('competition-detail', { competitionId: comp.id })}
            className="group p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 hover:border-[#009270] hover:shadow-md transition-all cursor-pointer space-y-3"
          >
            <div className="flex items-center justify-between">
              <CompetitionBadge
                id={comp.id}
                name={comp.name}
                emblemUrl={comp.emblem}
                size="md"
              />
              <span className="text-[10px] uppercase font-bold text-slate-600 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                {comp.country}
              </span>
            </div>

            <div>
              <h2 className="text-base font-black text-slate-900 group-hover:text-[#009270] transition-colors">
                {comp.name}
              </h2>
              <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                {comp.historySummary}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>{comp.teamsCount} Teams · {comp.season}</span>
              <span className="text-[#009270] font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                View Points Table <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
