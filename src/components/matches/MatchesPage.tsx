/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Comprehensive Real Football Matches & Fixtures Hub
 * Directly fetches and renders genuine provider schedule with date navigation, competition grouping, and table views.
 */

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  List,
  Grid,
  Ticket,
  MapPin,
  CalendarDays,
  Layers,
  Search,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { Match, MatchStatus } from '../../types/football';
import { footballApi } from '../../services/footballApi';
import { MatchCard } from './MatchCard';
import { ClubCrest, CompetitionBadge } from '../common/ClubCrest';
import { TicketModal } from '../common/TicketModal';
import { useApp } from '../../context/AppContext';

export const MatchesPage: React.FC = () => {
  const { navigateTo, isMatchFollowed } = useApp();

  // Dynamic Today's Date (YYYY-MM-DD)
  const getTodayStr = () => new Date().toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState<string>(getTodayStr());
  const [dateHorizon, setDateHorizon] = useState<'SELECTED_DATE' | 'TOMORROW' | 'NEXT_7' | 'NEXT_30'>('SELECTED_DATE');
  const [selectedCompId, setSelectedCompId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'LIVE' | 'SCHEDULED' | 'FINISHED' | 'POSTPONED' | 'FOLLOWED'>('ALL');
  const [viewMode, setViewMode] = useState<'TABLE' | 'CARDS'>('TABLE');
  const [groupByCompetition, setGroupByCompetition] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [matches, setMatches] = useState<Match[]>(() => footballApi.getAllMatches());
  const [isLoading, setIsLoading] = useState<boolean>(() => footballApi.getIsLoading());
  const [errorMessage, setErrorMessage] = useState<string | null>(() => footballApi.getErrorMessage());
  const [lastUpdated, setLastUpdated] = useState<string | null>(() => footballApi.getLastUpdated());

  // Ticket modal state
  const [ticketModalMatch, setTicketModalMatch] = useState<Match | null>(null);

  // Subscribe to service updates
  useEffect(() => {
    const unsubscribe = footballApi.subscribe(() => {
      setMatches([...footballApi.getAllMatches()]);
      setIsLoading(footballApi.getIsLoading());
      setErrorMessage(footballApi.getErrorMessage());
      setLastUpdated(footballApi.getLastUpdated());
    });
    return unsubscribe;
  }, []);

  // Fetch when selected date or horizon changes
  useEffect(() => {
    let horizonParam = 'today';
    if (dateHorizon === 'TOMORROW') horizonParam = 'tomorrow';
    else if (dateHorizon === 'NEXT_7') horizonParam = '7days';
    else if (dateHorizon === 'NEXT_30') horizonParam = '30days';

    footballApi.fetchMatches(selectedDate, horizonParam);
  }, [selectedDate, dateHorizon]);

  // Date formatters
  const formatDateFull = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return d.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });
      }
    } catch (e) {
      // fallback
    }
    return dateStr;
  };

  const shiftDate = (days: number) => {
    try {
      const parts = selectedDate.split('-');
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      d.setDate(d.getDate() + days);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      setSelectedDate(`${yyyy}-${mm}-${dd}`);
      setDateHorizon('SELECTED_DATE');
    } catch (e) {
      // fallback
    }
  };

  // Filter matches based on search query, competition, status
  const filteredMatches = matches.filter((match) => {
    // Competition filter
    if (selectedCompId !== 'all' && match.competitionId !== selectedCompId) return false;

    // Status filter
    if (statusFilter === 'LIVE' && match.status !== 'LIVE' && match.status !== 'HT') return false;
    if (statusFilter === 'SCHEDULED' && match.status !== 'SCHEDULED') return false;
    if (statusFilter === 'FINISHED' && match.status !== 'FINISHED') return false;
    if (statusFilter === 'POSTPONED' && match.status !== 'POSTPONED' && match.status !== 'CANCELLED') return false;
    if (statusFilter === 'FOLLOWED' && !isMatchFollowed(match.id)) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = `${match.homeTeam.name} ${match.homeTeam.shortName} ${match.awayTeam.name} ${match.awayTeam.shortName} ${match.competitionName} ${match.venue} ${match.city}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }

    return true;
  });

  const liveMatches = filteredMatches.filter((m) => m.status === 'LIVE' || m.status === 'HT');
  const scheduledMatches = filteredMatches.filter((m) => m.status === 'SCHEDULED');
  const finishedMatches = filteredMatches.filter((m) => m.status === 'FINISHED');
  const postponedMatches = filteredMatches.filter((m) => m.status === 'POSTPONED' || m.status === 'CANCELLED');

  // Extract distinct competitions from fetched matches
  const dynamicCompetitions = Array.from(
    new Map(
      matches.map((m) => [m.competitionId, { id: m.competitionId, name: m.competitionName, category: m.competitionCategory, emblem: m.competitionEmblem }])
    ).values()
  );

  // Table row renderer
  const renderTableRow = (match: Match) => {
    const isLive = match.status === 'LIVE' || match.status === 'HT';
    const isFinished = match.status === 'FINISHED';
    const isScheduled = match.status === 'SCHEDULED';
    const isPostponed = match.status === 'POSTPONED' || match.status === 'CANCELLED';

    return (
      <tr
        key={`row-${match.id}`}
        onClick={() => {
          footballApi.cacheMatch(match);
          navigateTo('match-centre', { matchId: match.id });
        }}
        className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors cursor-pointer group text-xs text-slate-800"
      >
        {/* Time / Minute */}
        <td className="py-3 px-3 sm:px-4 font-mono whitespace-nowrap">
          {isLive ? (
            <span className="inline-flex items-center gap-1 font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-live" />
              {match.minute ? `${match.minute}'` : 'LIVE'}
            </span>
          ) : isFinished ? (
            <span className="font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">FT</span>
          ) : isPostponed ? (
            <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">P-P</span>
          ) : (
            <span className="font-semibold text-slate-700">{match.time}</span>
          )}
        </td>

        {/* Status */}
        <td className="py-3 px-2 sm:px-3 whitespace-nowrap">
          {isLive ? (
            <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-black text-[10px] tracking-wider uppercase">
              LIVE
            </span>
          ) : isFinished ? (
            <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px]">
              Finished
            </span>
          ) : isPostponed ? (
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
              Postponed
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#009270] font-bold text-[10px]">
              Scheduled
            </span>
          )}
        </td>

        {/* Home Team */}
        <td className="py-3 px-3 sm:px-4 text-right">
          <div className="flex items-center justify-end gap-2 font-bold text-slate-900 group-hover:text-[#009270] transition-colors">
            <span className="truncate">{match.homeTeam.shortName}</span>
            <ClubCrest name={match.homeTeam.name} code={match.homeTeam.code} crestUrl={match.homeTeam.crestUrl} size="xs" />
          </div>
        </td>

        {/* Score / Divider (Displays '—' for scheduled matches!) */}
        <td className="py-3 px-2 text-center whitespace-nowrap">
          {match.score.home !== null && match.score.away !== null ? (
            <div className="inline-flex items-center gap-1 font-mono font-black text-sm px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-900 border border-slate-200">
              <span>{match.score.home}</span>
              <span className="text-slate-400">–</span>
              <span>{match.score.away}</span>
            </div>
          ) : (
            <span className="text-slate-400 font-mono font-semibold text-xs">—</span>
          )}
        </td>

        {/* Away Team */}
        <td className="py-3 px-3 sm:px-4 text-left">
          <div className="flex items-center justify-start gap-2 font-bold text-slate-900 group-hover:text-[#009270] transition-colors">
            <ClubCrest name={match.awayTeam.name} code={match.awayTeam.code} crestUrl={match.awayTeam.crestUrl} size="xs" />
            <span className="truncate">{match.awayTeam.shortName}</span>
          </div>
        </td>

        {/* Competition */}
        <td className="py-3 px-3 text-slate-600 hidden md:table-cell">
          <div className="flex items-center gap-1.5 truncate max-w-[160px]">
            <span className="truncate text-[11px] font-medium">{match.competitionName}</span>
          </div>
        </td>

        {/* Venue */}
        <td className="py-3 px-3 hidden lg:table-cell text-[11px] text-slate-500 truncate max-w-[180px]">
          <div className="flex items-center gap-1 truncate">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{match.venue || match.city || 'Stadium'}</span>
          </div>
        </td>

        {/* Action Button */}
        <td className="py-3 px-3 sm:px-4 text-right whitespace-nowrap">
          {match.ticketInfo && match.ticketInfo.available && isScheduled ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setTicketModalMatch(match);
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#009270] font-bold text-[11px] border border-emerald-200 transition-colors"
            >
              <Ticket className="w-3 h-3" />
              <span>Tickets</span>
            </button>
          ) : (
            <span className="text-[11px] font-bold text-[#009270] group-hover:underline">
              Match Centre →
            </span>
          )}
        </td>
      </tr>
    );
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* 1. HEADER & DATE BANNER */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-[#009270] text-xs font-bold font-mono uppercase tracking-wider mb-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Official Football Fixtures & Results Hub
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
              {dateHorizon === 'SELECTED_DATE'
                ? formatDateFull(selectedDate)
                : dateHorizon === 'TOMORROW'
                ? 'Tomorrow · Scheduled Matches'
                : dateHorizon === 'NEXT_7'
                ? 'Next 7 Days Schedule'
                : 'Next 30 Days Fixtures'}
            </h1>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local'}</span>
              {lastUpdated && (
                <span className="text-slate-400">· Last verified: {new Date(lastUpdated).toLocaleTimeString()}</span>
              )}
            </p>
          </div>

          {/* Table / Cards and Grouping Toggles */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => footballApi.fetchMatches(selectedDate, dateHorizon === 'SELECTED_DATE' ? 'today' : '7days')}
              disabled={isLoading}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Refresh Provider Matches"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#009270]' : ''}`} />
            </button>

            <button
              onClick={() => setGroupByCompetition(!groupByCompetition)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                groupByCompetition
                  ? 'bg-emerald-50 border-emerald-200 text-[#009270]'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title="Group by Competition"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Group by League</span>
            </button>

            <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs">
              <button
                onClick={() => setViewMode('TABLE')}
                className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                  viewMode === 'TABLE'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
              <button
                onClick={() => setViewMode('CARDS')}
                className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                  viewMode === 'CARDS'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Cards</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. DATE NAVIGATION BAR */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          {/* Day Stepper */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => shiftDate(-1)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1 transition-colors"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Prev Day</span>
            </button>

            <button
              onClick={() => {
                setSelectedDate(getTodayStr());
                setDateHorizon('SELECTED_DATE');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedDate === getTodayStr() && dateHorizon === 'SELECTED_DATE'
                  ? 'bg-[#009270] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Today
            </button>

            <button
              onClick={() => shiftDate(1)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1 transition-colors"
              title="Next Day"
            >
              <span className="hidden sm:inline">Next Day</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Calendar Picker + Horizon Quick Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
              <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline text-slate-500">Pick Date:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  if (e.target.value) {
                    setSelectedDate(e.target.value);
                    setDateHorizon('SELECTED_DATE');
                  }
                }}
                className="bg-transparent text-xs font-bold text-slate-900 focus:outline-hidden cursor-pointer"
              />
            </div>

            <button
              onClick={() => setDateHorizon('TOMORROW')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                dateHorizon === 'TOMORROW'
                  ? 'bg-[#009270] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Tomorrow
            </button>

            <button
              onClick={() => setDateHorizon('NEXT_7')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                dateHorizon === 'NEXT_7'
                  ? 'bg-[#009270] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Next 7 Days
            </button>

            <button
              onClick={() => setDateHorizon('NEXT_30')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                dateHorizon === 'NEXT_30'
                  ? 'bg-[#009270] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Next 30 Days
            </button>
          </div>
        </div>

        {/* 3. FILTER TABS & SEARCH */}
        <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'ALL', label: `All (${filteredMatches.length})` },
              { id: 'FOLLOWED', label: `Your Matches ♡ (${matches.filter((m) => isMatchFollowed(m.id)).length})` },
              { id: 'LIVE', label: `Live (${liveMatches.length})` },
              { id: 'SCHEDULED', label: `Scheduled (${scheduledMatches.length})` },
              { id: 'FINISHED', label: `Finished (${finishedMatches.length})` },
              { id: 'POSTPONED', label: `Postponed (${postponedMatches.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  statusFilter === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {dynamicCompetitions.length > 0 && (
              <select
                value={selectedCompId}
                onChange={(e) => setSelectedCompId(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-[#009270]"
              >
                <option value="all">All Leagues ({dynamicCompetitions.length})</option>
                {dynamicCompetitions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter matches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-[#009270]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. MATCH LIST OR EMPTY STATE */}
      {isLoading ? (
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-12 text-center shadow-xs space-y-3">
          <RefreshCw className="w-8 h-8 text-[#009270] animate-spin mx-auto" />
          <div className="text-sm font-bold text-slate-800">Retrieving official matches from data provider...</div>
        </div>
      ) : filteredMatches.length === 0 ? (
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-12 text-center shadow-xs space-y-4">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900">No matches found for this date</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              There are no matches scheduled or reported by the official football provider for {formatDateFull(selectedDate)}.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSelectedDate(getTodayStr());
                setDateHorizon('SELECTED_DATE');
                setSelectedCompId('all');
                setStatusFilter('ALL');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-[#009270] hover:bg-[#028060] text-white text-xs font-bold shadow-xs transition-colors"
            >
              View Today's Fixtures
            </button>
            <button
              onClick={() => setDateHorizon('NEXT_7')}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
            >
              View Next 7 Days
            </button>
          </div>
        </div>
      ) : groupByCompetition ? (
        // COMPETITION GROUPED VIEW
        <div className="space-y-6">
          {dynamicCompetitions.map((comp) => {
            const compMatches = filteredMatches.filter((m) => m.competitionId === comp.id);
            if (compMatches.length === 0) return null;

            return (
              <div key={`comp-group-${comp.id}`} className="space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-black text-slate-900 font-display">{comp.name}</h2>
                    <span className="text-[11px] text-slate-500 font-mono">({compMatches.length} matches)</span>
                  </div>
                </div>

                {viewMode === 'TABLE' ? (
                  <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            <th className="py-2.5 px-3 sm:px-4">Time</th>
                            <th className="py-2.5 px-2 sm:px-3">Status</th>
                            <th className="py-2.5 px-3 sm:px-4 text-right">Home</th>
                            <th className="py-2.5 px-2 text-center">Score</th>
                            <th className="py-2.5 px-3 sm:px-4 text-left">Away</th>
                            <th className="py-2.5 px-3 hidden md:table-cell">Venue</th>
                            <th className="py-2.5 px-3 sm:px-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody>{compMatches.map((m) => renderTableRow(m))}</tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {compMatches.map((m) => (
                      <MatchCard key={`grid-${m.id}`} match={m} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        // TABLE OR CARDS (UNGROUPED)
        viewMode === 'TABLE' ? (
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-2.5 px-3 sm:px-4">Time</th>
                    <th className="py-2.5 px-2 sm:px-3">Status</th>
                    <th className="py-2.5 px-3 sm:px-4 text-right">Home</th>
                    <th className="py-2.5 px-2 text-center">Score</th>
                    <th className="py-2.5 px-3 sm:px-4 text-left">Away</th>
                    <th className="py-2.5 px-3 hidden md:table-cell">Competition</th>
                    <th className="py-2.5 px-3 hidden lg:table-cell">Venue</th>
                    <th className="py-2.5 px-3 sm:px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>{filteredMatches.map((m) => renderTableRow(m))}</tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMatches.map((m) => (
              <MatchCard key={`grid-${m.id}`} match={m} />
            ))}
          </div>
        )
      )}

      {/* Ticket Modal */}
      <TicketModal
        match={ticketModalMatch}
        isOpen={Boolean(ticketModalMatch)}
        onClose={() => setTicketModalMatch(null)}
      />
    </div>
  );
};
