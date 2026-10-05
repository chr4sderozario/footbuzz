/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Provider-Verified Global Football Competitions Directory
 */

import React, { useState } from 'react';
import { Trophy, Globe, Search, Filter, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OFFICIAL_PROVIDER_COMPETITIONS, ProviderCompetition } from '../../services/espnCompetitionService';

export const CompetitionsPage: React.FC = () => {
  const { navigateTo, setSelectedLeagueFilter } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');

  const regions = ['all', 'Asia', 'Europe', 'South America', 'North America', 'Africa', 'International'];

  const filteredCompetitions = OFFICIAL_PROVIDER_COMPETITIONS.filter((comp) => {
    if (selectedRegion !== 'all' && comp.region.toLowerCase() !== selectedRegion.toLowerCase()) {
      return false;
    }
    if (selectedGender !== 'all' && comp.gender.toLowerCase() !== selectedGender.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        comp.name.toLowerCase().includes(q) ||
        comp.shortName.toLowerCase().includes(q) ||
        comp.country.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200 max-w-6xl mx-auto">
      {/* Directory Banner */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-[#009270] text-xs font-bold font-mono uppercase tracking-wider mb-2">
              <Globe className="w-3.5 h-3.5" />
              Global Football Directory
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
              Global Football Competitions & Leagues
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Discover verified leagues, cups, and continental tournaments from India, Asia, Europe, the Americas, and international federations directly from ESPN global data feeds.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 shrink-0">
            <ShieldCheck className="w-4 h-4 text-[#009270]" />
            <span>{OFFICIAL_PROVIDER_COMPETITIONS.length} Provider Leagues Supported</span>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="pt-2 flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search leagues by name or country (e.g. Indian Super League, Premier League, La Liga)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#009270] focus:bg-white transition-all shadow-xs"
            />
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedRegion === reg
                    ? 'bg-[#009270] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {reg === 'all' ? '🌍 All Continents' : reg}
              </button>
            ))}
          </div>

          {/* Gender Filter */}
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer shrink-0"
          >
            <option value="all">All Genders</option>
            <option value="Men">Men's Competitions</option>
            <option value="Women">Women's Competitions</option>
          </select>
        </div>
      </div>

      {/* Tournament Countdowns & World Cup 2026 Radar Option Banner */}
      <div
        onClick={() => navigateTo('tournament-countdowns')}
        className="bg-gradient-to-r from-slate-950 via-[#06241a] to-slate-900 border border-emerald-500/40 rounded-2xl p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:border-emerald-400 transition-all shadow-md group"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-2xl font-black shrink-0 shadow-md group-hover:scale-105 transition-transform">
            ⏳
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Verified Radar
              </span>
              <span className="text-xs font-bold text-amber-300">
                World Cup 2026 · UCL Final · ISL · 20+ Tournaments
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black font-display text-white">
              Global Tournament Countdowns & World Cup Radar
            </h2>
            <p className="text-xs text-slate-300">
              See exact dates, years, and real ticking countdowns to the next World Cup, Champions League, Indian Super League, and 20 other premier tournaments.
            </p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigateTo('tournament-countdowns');
          }}
          className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-[#009270] hover:bg-[#028060] text-white text-xs font-black shrink-0 transition-colors shadow-sm flex items-center gap-1.5"
        >
          <span>Open Countdown Radar</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid of Competitions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCompetitions.map((comp) => (
          <div
            key={comp.id}
            onClick={() => {
              setSelectedLeagueFilter(comp.id);
              navigateTo('home');
            }}
            className="group p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 hover:border-[#009270] hover:shadow-md transition-all cursor-pointer space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/80 p-1.5 flex items-center justify-center shrink-0">
                  {comp.logoUrl ? (
                    <img src={comp.logoUrl} alt={comp.name} className="max-w-full max-h-full object-contain" />
                  ) : (
                    <Trophy className="w-6 h-6 text-[#009270]" />
                  )}
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded uppercase">
                    {comp.country}
                  </span>
                  <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {comp.category}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900 group-hover:text-[#009270] transition-colors leading-snug">
                  {comp.name}
                </h3>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  Region: <span className="font-semibold text-slate-700">{comp.region}</span> · {comp.gender}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
              <span className="font-mono text-[11px] text-slate-400">Provider Slug: {comp.slug}</span>
              <span className="text-[#009270] font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                <span>View Fixtures</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredCompetitions.length === 0 && (
        <div className="bg-white/95 rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-2">
          <Trophy className="w-8 h-8 text-slate-300 mx-auto" />
          <div className="font-bold text-slate-700 text-sm">No provider competitions matched your filter.</div>
          <p className="text-xs text-slate-400">Try adjusting your continent or search query above.</p>
        </div>
      )}
    </div>
  );
};
