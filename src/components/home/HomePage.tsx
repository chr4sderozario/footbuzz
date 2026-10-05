/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Authentic Cricbuzz-style Football Command Centre HomePage
 * Personalized "Your Football", "Pick Your 5", Marquee Matches Spotlight, and Interactive League Filters.
 */

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Trophy,
  ArrowRight,
  Shield,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  Ticket,
  Flame,
  Globe,
  Sparkles,
  Layers,
  Heart,
  Pin,
  Star,
  Activity,
  Target,
  Volume2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { footballApi } from '../../services/footballApi';
import { MatchCard } from '../matches/MatchCard';
import { ClubCrest } from '../common/ClubCrest';
import { CompetitionBadge } from '../common/CompetitionBadge';
import { PlayerAvatar } from '../common/PlayerAvatar';
import { Match, Player } from '../../types/football';
import { PlayerModal } from '../players/PlayerModal';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { FootballToolHubModal } from '../tools/FootballToolHubModal';
import { LightningFootyNewsBanner } from '../news/LightningFootyNewsBanner';

export const HomePage: React.FC = () => {
  const {
    user,
    navigateTo,
    selectedLeagueFilter,
    setSelectedLeagueFilter,
    setIntroModalOpen,
    picked5MatchIds,
    togglePick5Match,
  } = useApp();

  const [matches, setMatches] = useState<Match[]>(() => footballApi.getAllMatches());
  const [allPlayers, setAllPlayers] = useState<Player[]>(() => footballApi.getPlayers());
  const [isLoading, setIsLoading] = useState<boolean>(() => footballApi.getIsLoading());
  const [errorMessage, setErrorMessage] = useState<string | null>(() => footballApi.getErrorMessage());
  const [lastUpdated, setLastUpdated] = useState<string | null>(() => footballApi.getLastUpdated());
  const [stripFilter, setStripFilter] = useState<string>('ALL');

  const [selectedPlayerForModal, setSelectedPlayerForModal] = useState<Player | null>(null);

  useEffect(() => {
    const unsubscribe = footballApi.subscribe(() => {
      setMatches([...footballApi.getAllMatches()]);
      setAllPlayers([...footballApi.getPlayers()]);
      setIsLoading(footballApi.getIsLoading());
      setErrorMessage(footballApi.getErrorMessage());
      setLastUpdated(footballApi.getLastUpdated());
    });
    return unsubscribe;
  }, []);

  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Filter matches based on selected league preference
  const filteredMatchesByLeague = matches.filter((m) => {
    if (selectedLeagueFilter === 'all') return true;
    if (selectedLeagueFilter === 'comp-isl') {
      return (
        m.competitionId.includes('isl') ||
        m.competitionName.toLowerCase().includes('indian') ||
        m.homeTeam.country?.toLowerCase().includes('india') ||
        m.awayTeam.country?.toLowerCase().includes('india')
      );
    }
    if (selectedLeagueFilter === 'fifa-friendly') {
      return (
        m.competitionId.includes('friendly') ||
        m.competitionName.toLowerCase().includes('friendly') ||
        m.competitionName.toLowerCase().includes('international') ||
        m.competitionCategory === 'international'
      );
    }
    if (selectedLeagueFilter === 'comp-ucl') {
      return m.competitionId.includes('champions') || m.competitionName.toLowerCase().includes('champions');
    }
    if (selectedLeagueFilter === 'comp-copa-america') {
      return m.competitionId.includes('copa') || m.competitionName.toLowerCase().includes('copa');
    }
    if (selectedLeagueFilter === 'comp-euro') {
      return m.competitionId.includes('euro') || m.competitionName.toLowerCase().includes('euro');
    }
    if (selectedLeagueFilter === 'comp-fifa-worldcup') {
      return m.competitionId.includes('worldcup') || m.competitionName.toLowerCase().includes('world cup');
    }
    if (selectedLeagueFilter === 'comp-pl') {
      return m.competitionId.includes('eng.1') || m.competitionName.toLowerCase().includes('premier');
    }
    if (selectedLeagueFilter === 'comp-bundesliga') {
      return m.competitionId.includes('ger.1') || m.competitionName.toLowerCase().includes('bundesliga');
    }
    if (selectedLeagueFilter === 'comp-laliga') {
      return m.competitionId.includes('esp.1') || m.competitionName.toLowerCase().includes('la liga') || m.competitionName.toLowerCase().includes('laliga');
    }
    if (selectedLeagueFilter === 'comp-seriea') {
      return m.competitionId.includes('ita.1') || m.competitionName.toLowerCase().includes('serie a');
    }
    if (selectedLeagueFilter === 'comp-facup') {
      return m.competitionId.includes('facup') || m.competitionName.toLowerCase().includes('fa cup');
    }
    return m.competitionId === selectedLeagueFilter;
  });

  const liveMatches = filteredMatchesByLeague.filter((m) => m.status === 'LIVE' || m.status === 'HT');
  const scheduledMatches = filteredMatchesByLeague.filter((m) => m.status === 'SCHEDULED');
  const recentMatches = filteredMatchesByLeague.filter((m) => m.status === 'FINISHED');

  // Strip filter
  const filteredStripMatches = filteredMatchesByLeague.filter((m) => {
    if (stripFilter === 'LIVE') return m.status === 'LIVE' || m.status === 'HT';
    if (stripFilter === 'SCHEDULED') return m.status === 'SCHEDULED';
    if (stripFilter === 'FINISHED') return m.status === 'FINISHED';
    return true;
  });

  // Marquee Spotlight Matches (ISL, Friendlies, UCL)
  const interestingMatches = matches.filter((m) => {
    const name = (m.competitionName + ' ' + m.homeTeam.name + ' ' + m.awayTeam.name).toLowerCase();
    const isISL = name.includes('indian') || name.includes('isl') || m.competitionId.includes('isl') || m.homeTeam.country === 'India';
    const isFriendly = name.includes('friendly') || name.includes('international') || m.competitionCategory === 'international';
    const isUCL = name.includes('champions') || m.competitionId.includes('champions');
    const isTournament = name.includes('copa') || name.includes('euro') || name.includes('world cup');
    const isLive = m.status === 'LIVE' || m.status === 'HT';
    return isISL || isFriendly || isUCL || isTournament || isLive;
  });

  // Pick 5 matches list
  const picked5Matches = matches.filter((m) => picked5MatchIds.includes(m.id));

  // Followed Players
  const followedPlayers = allPlayers.filter((p) => user?.favoritePlayerIds.includes(p.id));

  const [toolHubModalOpen, setToolHubModalOpen] = useState(false);

  const leagueOptions = [
    { id: 'all', label: 'All Matches', flag: '⚽' },
    { id: 'comp-isl', label: 'Indian Super League (ISL)', flag: '🇮🇳' },
    { id: 'comp-copa-america', label: 'Copa América', flag: '🌎' },
    { id: 'comp-euro', label: 'UEFA Euro', flag: '🇪🇺' },
    { id: 'comp-fifa-worldcup', label: 'FIFA World Cup', flag: '🏆' },
    { id: 'comp-ucl', label: 'Champions League', flag: '⭐' },
    { id: 'comp-pl', label: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    { id: 'comp-bundesliga', label: 'Bundesliga', flag: '🇩🇪' },
    { id: 'comp-laliga', label: 'La Liga', flag: '🇪🇸' },
    { id: 'comp-seriea', label: 'Serie A', flag: '🇮🇹' },
    { id: 'comp-facup', label: 'FA Cup', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    { id: 'fifa-friendly', label: 'Intl Friendlies', flag: '🌍' },
  ];

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* 0. LIGHTNING FOOTY NEWS: TOP FOOTBALLER VERIFIED LIVE NEWS BANNER (10-SEC AUTO-POPUP) */}
      <LightningFootyNewsBanner />

      {/* 1. TOP PROMOTED SPOTLIGHT: MARQUEE MATCHES FIRST */}
      <section className="bg-gradient-to-br from-[#009270] via-[#028060] to-[#090d16] text-white rounded-3xl p-5 sm:p-6 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs font-mono uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 fill-current" />
                Marquee & Spotlight Matches
              </span>
              <span className="text-xs font-mono text-emerald-100 hidden sm:inline">
                · ISL, International Friendlies & Continental Heavyweights
              </span>
            </div>

            <button
              onClick={() => setIntroModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors border border-white/20"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>FootBuzz Intro & League Guide</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white">
                Featured Football Spotlight
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl">
                Promoting verified Indian Super League clashes, FIFA international friendlies, and UEFA Champions League fixtures with genuine live data.
              </p>
            </div>

            <button
              onClick={() => navigateTo('matches')}
              className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white text-slate-950 hover:bg-emerald-50 text-xs font-black transition-all shadow-md flex items-center gap-1.5 shrink-0"
            >
              <span>Full Matchday Schedule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interesting Matches Scroller */}
          {interestingMatches.length > 0 ? (
            <div className="pt-2">
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
                {interestingMatches.map((m) => {
                  const isPinned = picked5MatchIds.includes(m.id);
                  return (
                    <div
                      key={`spotlight-${m.id}`}
                      onClick={() => {
                        footballApi.cacheMatch(m);
                        navigateTo('match-centre', { matchId: m.id });
                      }}
                      className="w-[295px] shrink-0 bg-white/95 backdrop-blur-md text-slate-900 rounded-2xl p-3.5 border border-white/30 shadow-md hover:scale-[1.02] transition-transform cursor-pointer space-y-2 select-none"
                    >
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 pb-1.5 border-b border-slate-100">
                        <span className="truncate text-[#009270] max-w-[170px]">
                          {m.competitionName}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePick5Match(m.id);
                            }}
                            className={`p-1 rounded-md transition-colors ${
                              isPinned ? 'text-amber-500' : 'text-slate-400 hover:text-amber-500'
                            }`}
                            title={isPinned ? 'Pinned in Pick 5' : 'Pin to Pick 5 Watchlist'}
                          >
                            <Pin className={`w-3 h-3 ${isPinned ? 'fill-current' : ''}`} />
                          </button>

                          {m.status === 'LIVE' || m.status === 'HT' ? (
                            <span className="flex items-center gap-1 text-rose-600 font-mono text-[10px] font-black">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-live" />
                              {m.status === 'HT' ? 'HT' : `${m.minute}'`}
                            </span>
                          ) : (
                            <span className="text-slate-600 font-mono text-[10px] font-bold">{m.time}</span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1.5 py-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 min-w-0">
                            <ClubCrest name={m.homeTeam.name} code={m.homeTeam.code} crestUrl={m.homeTeam.crestUrl} size="xs" />
                            <span className="text-xs font-bold text-slate-900 truncate">{m.homeTeam.name}</span>
                          </div>
                          <span className="font-mono text-sm font-black text-slate-900">
                            {m.score.home !== null ? m.score.home : '—'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 min-w-0">
                            <ClubCrest name={m.awayTeam.name} code={m.awayTeam.code} crestUrl={m.awayTeam.crestUrl} size="xs" />
                            <span className="text-xs font-bold text-slate-900 truncate">{m.awayTeam.name}</span>
                          </div>
                          <span className="font-mono text-sm font-black text-slate-900">
                            {m.score.away !== null ? m.score.away : '—'}
                          </span>
                        </div>
                      </div>

                      <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-semibold text-slate-500">
                        <span className="truncate max-w-[180px]">{m.venue || m.city || 'Stadium'}</span>
                        <span className="text-[#009270] font-black shrink-0">Match Centre →</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="py-2 text-xs text-emerald-100">
              No marquee spotlight matches found in current feed.
            </div>
          )}
        </div>
      </section>

      {/* 2. "YOUR FOOTBALL" PERSONALIZED WATCHLIST & TRACKED PLAYERS */}
      {(picked5Matches.length > 0 || followedPlayers.length > 0) && (
        <section className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-current" />
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 font-display">
                Your Football · Personalized Watchlist
              </h2>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {picked5Matches.length} Pinned Fixtures · {followedPlayers.length} Tracked Players
            </span>
          </div>

          {/* Followed Players Live Status */}
          {followedPlayers.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Followed Players in Action
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {followedPlayers.map((player) => (
                  <div
                    key={`fav-p-${player.id}`}
                    onClick={() => setSelectedPlayerForModal(player)}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between gap-3 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <PlayerAvatar
                        id={player.id}
                        name={player.name}
                        photoUrl={player.photoUrl}
                        number={player.shirtNumber}
                        size="sm"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-slate-900 truncate">{player.name}</div>
                        <div className="text-[10px] text-slate-500 truncate">{player.currentTeamName} · {player.position}</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#009270] text-[10px] font-bold shrink-0">
                      Match Today
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pick 5 Pinned Matches */}
          {picked5Matches.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Your Pick 5 Pinned Matches ({picked5Matches.length}/5)
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {picked5Matches.map((match) => (
                  <MatchCard key={`picked5-${match.id}`} match={match} />
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* 3. CHOOSE YOUR LEAGUE BAR */}
      <section className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xs p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#009270]" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 font-display">
              Choose What League You Want to Watch
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Filter by Competition</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {leagueOptions.map((lg) => {
            const isSelected = selectedLeagueFilter === lg.id;
            return (
              <button
                key={lg.id}
                onClick={() => setSelectedLeagueFilter(lg.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 shrink-0 ${
                  isSelected
                    ? 'bg-[#009270] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {lg.id !== 'all' ? (
                  <CompetitionBadge id={lg.id} name={lg.label} size="xs" />
                ) : (
                  <span className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px]">⚽</span>
                )}
                <span>{lg.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. TODAY'S LIVE / MATCHES STRIP */}
      <section className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xs p-3 space-y-3">
        <div className="flex items-center justify-between gap-3 overflow-x-auto no-scrollbar border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-black text-[#009270] uppercase tracking-wider flex items-center gap-1.5 font-display">
              {liveMatches.length > 0 && <span className="w-2 h-2 rounded-full bg-rose-600 animate-live" />}
              Live & Today's Fixtures ({filteredMatchesByLeague.length})
            </span>
            <span className="text-[11px] font-mono text-slate-400">· {todayLabel}</span>
          </div>

          <div className="flex items-center gap-1">
            {[
              { id: 'ALL', label: 'All' },
              { id: 'LIVE', label: `Live (${liveMatches.length})` },
              { id: 'SCHEDULED', label: `Scheduled (${scheduledMatches.length})` },
              { id: 'FINISHED', label: `Finished (${recentMatches.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStripFilter(tab.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  stripFilter === tab.id
                    ? 'bg-[#009270] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => footballApi.fetchMatches(new Date().toISOString().split('T')[0], 'today')}
              disabled={isLoading}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
              title="Refresh Live Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#009270]' : ''}`} />
            </button>

            <button
              onClick={() => navigateTo('matches')}
              className="text-xs font-bold text-[#009270] hover:underline whitespace-nowrap shrink-0 flex items-center gap-0.5 ml-1"
            >
              <span>Full Schedule</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Horizontal Match Cards Scroller */}
        {filteredStripMatches.length > 0 ? (
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1 pt-0.5">
            {filteredStripMatches.map((match) => (
              <MatchCard key={`strip-${match.id}`} match={match} variant="strip" />
            ))}
          </div>
        ) : (
          <div className="py-4 text-center text-xs text-slate-500 font-medium">
            {isLoading ? 'Checking live fixtures...' : 'No matches matching current filter for this league.'}
          </div>
        )}
      </section>

      {/* 5. MAIN PORTAL LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Live Section, Scheduled Matches, and Results */}
        <div className="lg:col-span-8 space-y-6">
          {/* Live Matches Section */}
          {liveMatches.length > 0 ? (
            <section className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="bg-[#009270] text-white px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-live" />
                  <h2 className="text-sm font-black uppercase tracking-wider font-display">
                    Featured Live Match Centre ({liveMatches.length})
                  </h2>
                </div>
                <span className="text-xs font-mono text-emerald-100">Live Coverage</span>
              </div>

              <div className="p-5 space-y-4">
                {liveMatches.map((m) => (
                  <MatchCard key={`live-${m.id}`} match={m} variant="featured" />
                ))}
              </div>
            </section>
          ) : (
            <div className="p-5 rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 text-xs text-slate-700 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <span>No matches are live right now.</span>
              </div>
              <button
                onClick={() => navigateTo('matches')}
                className="text-xs font-bold text-[#009270] hover:underline flex items-center gap-1"
              >
                <span>View Scheduled Matches</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Scheduled Upcoming Matches */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div>
                <h2 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#009270]" /> Next Up · Scheduled Matches
                </h2>
                <p className="text-xs text-slate-500">Official scheduled fixtures from data provider</p>
              </div>
              <button
                onClick={() => navigateTo('matches')}
                className="text-xs font-bold text-[#009270] hover:underline flex items-center gap-1"
              >
                <span>View Full Calendar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {scheduledMatches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scheduledMatches.slice(0, 6).map((m) => (
                  <MatchCard key={`home-sched-${m.id}`} match={m} />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-xs text-slate-500">
                No upcoming matches found for the selected filter today.
              </div>
            )}
          </section>

          {/* Today's Completed Results */}
          {recentMatches.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div>
                  <h2 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500" /> Completed Matches & Official Scores
                  </h2>
                  <p className="text-xs text-slate-500">Verified full-time results</p>
                </div>
                <button
                  onClick={() => navigateTo('matches')}
                  className="text-xs font-bold text-[#009270] hover:underline"
                >
                  All Results →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentMatches.slice(0, 4).map((m) => (
                  <MatchCard key={`home-recent-${m.id}`} match={m} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* RIGHT COLUMN: Quick Match Finder & Schedule Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-black uppercase tracking-wider text-slate-900 font-display flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#009270]" /> Football Feed Info
              </span>
              <span className="text-[10px] font-mono text-slate-400">Live API</span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span>Data Source:</span>
                <span className="font-semibold text-slate-900">Official Football Provider</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Selected Period:</span>
                <span className="font-semibold text-slate-900">{todayLabel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Active League:</span>
                <span className="font-bold text-[#009270]">
                  {leagueOptions.find((l) => l.id === selectedLeagueFilter)?.label || 'All Leagues'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Live Matches:</span>
                <span className="font-bold text-rose-600">{liveMatches.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Scheduled Fixtures:</span>
                <span className="font-semibold text-slate-900">{scheduledMatches.length}</span>
              </div>
              {lastUpdated && (
                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 font-mono">
                  Last verified: {new Date(lastUpdated).toLocaleTimeString()}
                </div>
              )}
            </div>

            <button
              onClick={() => navigateTo('matches')}
              className="w-full py-2.5 rounded-xl bg-[#009270] hover:bg-[#028060] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1"
            >
              <span>Explore All Fixtures</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Download App Banner */}
          <PWAInstallButton variant="banner" />
        </div>
      </div>

      {/* Quick Player Profile Modal */}
      <PlayerModal
        player={selectedPlayerForModal}
        isOpen={Boolean(selectedPlayerForModal)}
        onClose={() => setSelectedPlayerForModal(null)}
      />
    </div>
  );
};
