/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Smart Football Search Engine
 * Order-independent matching, normalized queries, and fuzzy suggestions based on real provider data.
 */

import React, { useState, useEffect } from 'react';
import {
  Search,
  Shield,
  Calendar,
  Sparkles,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  Trophy,
  Users,
} from 'lucide-react';
import { footballApi, SearchResults } from '../../services/footballApi';
import { useApp } from '../../context/AppContext';
import { ClubCrest } from '../common/ClubCrest';
import { MatchCard } from '../matches/MatchCard';
import { PlayerAvatar } from '../common/PlayerAvatar';
import { CompetitionBadge } from '../common/CompetitionBadge';

export const SearchPage: React.FC = () => {
  const { globalSearchQuery, setGlobalSearchQuery, navigateTo } = useApp();
  const [results, setResults] = useState<SearchResults>(() => footballApi.search(globalSearchQuery));
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsSearching(true);
    footballApi.searchAsync(globalSearchQuery).then((res) => {
      if (isMounted) {
        setResults(res);
        setIsSearching(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [globalSearchQuery]);

  const hasResults =
    results.matches.length > 0 ||
    results.teams.length > 0 ||
    results.players.length > 0 ||
    results.competitions.length > 0;

  const popularSearches = [
    'Premier League',
    'La Liga',
    'Champions League',
    'Arsenal',
    'Real Madrid',
    'Barcelona',
    'Manchester City',
  ];

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200 max-w-5xl mx-auto">
      {/* Search Input Card */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-[#009270] text-xs font-bold font-mono uppercase tracking-wider mb-1.5">
            <Search className="w-3.5 h-3.5" />
            Smart Football Search Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
            Search Real Football Fixtures & Clubs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Order-independent match query resolution (e.g. "Arsenal Chelsea" or "Chelsea vs Arsenal"), club profiles, and verified schedules.
          </p>
        </div>

        {/* Main Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            autoFocus
            placeholder="Search teams or fixture pairs (e.g. Arsenal vs Chelsea, Barcelona, Real Madrid)..."
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-[#009270] focus:bg-white transition-all shadow-xs font-medium"
          />
          {isSearching && (
            <RefreshCw className="w-4 h-4 text-[#009270] animate-spin absolute right-4 top-1/2 -translate-y-1/2" />
          )}
        </div>

        {/* Popular Quick Suggestions */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Try:</span>
          {popularSearches.map((s) => (
            <button
              key={s}
              onClick={() => setGlobalSearchQuery(s)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-[#009270] hover:border-emerald-200 border border-transparent transition-all text-xs font-semibold"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Fuzzy Typo Suggestion Banner */}
      {results.suggestion && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Did you mean:{' '}
              <button
                onClick={() => setGlobalSearchQuery(results.suggestion!)}
                className="font-black text-[#009270] underline underline-offset-2 hover:opacity-80"
              >
                {results.suggestion}
              </button>
              ?
            </span>
          </div>
          <button
            onClick={() => setGlobalSearchQuery(results.suggestion!)}
            className="px-3 py-1 rounded-lg bg-white border border-amber-300 font-bold text-amber-900 text-xs hover:bg-amber-100 transition-colors"
          >
            Search this instead
          </button>
        </div>
      )}

      {/* SEARCH RESULTS CONTAINER */}
      {globalSearchQuery.trim() === '' ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
          <Search className="w-10 h-10 text-slate-300 mx-auto" />
          <div className="text-sm font-bold text-slate-800">
            Search real matches across all leagues
          </div>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            You can type club names, tournament names, or fixture pairs in any order (e.g. "Arsenal Chelsea" or "Chelsea vs Arsenal").
          </p>
        </div>
      ) : !hasResults ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
          <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
          <div className="text-sm font-bold text-slate-800">No results found for "{globalSearchQuery}"</div>
          <p className="text-xs text-slate-500">
            Check your spelling or try searching for a club or competition.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Matches */}
          {results.matches.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 font-display flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#009270]" /> Matches ({results.matches.length})
                </h2>
                <span className="text-[11px] text-slate-400 font-mono">Order-independent matches</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.matches.map((m) => (
                  <MatchCard key={`res-m-${m.id}`} match={m} />
                ))}
              </div>
            </section>
          )}

          {/* Teams */}
          {results.teams.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 font-display flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#009270]" /> Clubs ({results.teams.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.teams.map((t) => (
                  <div
                    key={`res-t-${t.id}`}
                    onClick={() => navigateTo('team-detail', { teamId: t.id })}
                    className="p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 hover:border-[#009270] hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <ClubCrest name={t.name} code={t.code} crestUrl={t.crestUrl} primaryColor={t.primaryColor} size="md" />
                      <div className="min-w-0">
                        <div className="font-bold text-sm text-slate-900 truncate">{t.name}</div>
                        <div className="text-xs text-slate-500 truncate">{t.country || 'Club'}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#009270] shrink-0" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Players */}
          {results.players && results.players.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 font-display flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-600" /> Players ({results.players.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.players.map((p) => (
                  <div
                    key={`res-p-${p.id}`}
                    onClick={() => navigateTo('player-detail', { playerId: p.id })}
                    className="p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 hover:border-[#009270] hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <PlayerAvatar
                        id={p.id}
                        name={p.name}
                        photoUrl={p.photoUrl}
                        number={p.shirtNumber}
                        size="md"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-sm text-slate-900 truncate">{p.name}</div>
                        <div className="text-xs text-slate-500 truncate">
                          {p.currentTeamName} · #{p.shirtNumber} ({p.position})
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#009270] shrink-0" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Competitions */}
          {results.competitions && results.competitions.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 font-display flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" /> Competitions ({results.competitions.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.competitions.map((c) => (
                  <div
                    key={`res-c-${c.id}`}
                    onClick={() => navigateTo('competition-detail', { competitionId: c.id })}
                    className="p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 hover:border-[#009270] hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <CompetitionBadge id={c.id} name={c.name} emblemUrl={c.emblem} size="md" />
                      <div className="min-w-0">
                        <div className="font-bold text-sm text-slate-900 truncate">{c.name}</div>
                        <div className="text-xs text-slate-500 truncate">{c.country} · {c.season}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#009270] shrink-0" />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};
