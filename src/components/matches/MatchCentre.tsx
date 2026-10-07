/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Authentic Cricbuzz-style Match Centre Component
 * Interactive Lineups (Pitch & Card Grid), Substitution Animations, Moment of the Match, and Player Cards.
 */

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Share2,
  Bookmark,
  BarChart2,
  Radio,
  Sliders,
  ArrowRightLeft,
  Info,
  Ticket,
  Flame,
  LayoutGrid,
  Map,
  Repeat,
  Trophy,
  Activity,
  Video,
  Heart,
  Bell,
  Zap,
  Star,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Match, LineupPlayer } from '../../types/football';
import { useApp } from '../../context/AppContext';
import { ClubCrest } from '../common/ClubCrest';
import { FootballPitch } from '../pitch/FootballPitch';
import { MatchComparisonModal } from './MatchComparisonModal';
import { PlayerComparisonModal } from '../players/PlayerComparisonModal';
import { PlayerCard } from '../players/PlayerCard';
import { PlayerModal } from '../players/PlayerModal';
import { TicketModal } from '../common/TicketModal';
import { MatchShareModal } from './MatchShareModal';
import { MatchVideosSection } from './MatchVideosSection';
import { ComingSoonModal, ComingSoonFeatureType } from '../common/ComingSoonModal';
import { PlayerAvatar } from '../common/PlayerAvatar';
import { footballApi } from '../../services/footballApi';
import { getMatchMood, getMatchCountdown } from '../../utils/footballUtils';

type MatchTab =
  | 'overview'
  | 'videos'
  | 'commentary'
  | 'lineups'
  | 'stats'
  | 'h2h'
  | 'tactics';

const MatchCentreContent: React.FC<{ match: Match }> = ({ match }) => {
  const {
    navigateTo,
    isMatchBookmarked,
    toggleBookmarkMatch,
    isMatchFollowed,
    toggleFollowMatch,
    remindedMatchIds,
    toggleMatchReminder,
    setLiveModeMatchId,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<MatchTab>(match.status === 'SCHEDULED' ? 'overview' : 'commentary');
  const [lineupViewMode, setLineupViewMode] = useState<'CARDS' | 'PITCH'>('CARDS');

  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [playerCompareIds, setPlayerCompareIds] = useState<[string, string] | null>(null);
  const [selectedPlayerForModal, setSelectedPlayerForModal] = useState<LineupPlayer | null>(null);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [comingSoonFeature, setComingSoonFeature] = useState<ComingSoonFeatureType | null>(null);
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  const [summaryData, setSummaryData] = useState<any>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  const bookmarked = isMatchBookmarked(match.id);
  const isFollowed = isMatchFollowed(match.id);
  const isReminded = remindedMatchIds.includes(match.id);
  const isLive = match.status === 'LIVE' || match.status === 'HT';
  const isScheduled = match.status === 'SCHEDULED';

  const mood = getMatchMood(match);
  const countdown = getMatchCountdown(match.date, match.time);
  const playerInFocus = footballApi.getPlayerInFocus(match);
  const homeForm = footballApi.getTeamRecentForm(match.homeTeam.id || match.homeTeam.name);
  const awayForm = footballApi.getTeamRecentForm(match.awayTeam.id || match.awayTeam.name);
  const h2hMatches = footballApi.getHeadToHead(match.homeTeam.name, match.awayTeam.name);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingSummary(true);
    footballApi.fetchMatchSummary(match.providerMatchId || match.id).then((data) => {
      if (isMounted && data) {
        setSummaryData(data);
      }
      if (isMounted) setIsLoadingSummary(false);
    });
    return () => {
      isMounted = false;
    };
  }, [match.id, match.providerMatchId]);

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Link Copied', 'Match link copied to clipboard.', 'SUCCESS');
    }
  };

  // Helper to extract full boxscore statistics from real provider summary
  const extractStatisticsFromSummary = (summary: any): any => {
    const boxTeams = summary?.boxscore?.teams || summary?.statistics?.teams;
    if (!Array.isArray(boxTeams) || boxTeams.length < 2) return null;
    const homeBox = boxTeams[0];
    const awayBox = boxTeams[1];
    const getStat = (box: any, name: string): number => {
      const s = (box?.statistics || []).find(
        (item: any) => item.name === name || item.label?.toLowerCase() === name.toLowerCase()
      );
      if (!s) return 0;
      const num = parseFloat(String(s.displayValue || s.value || '0').replace('%', ''));
      return isNaN(num) ? 0 : num;
    };
    const homePoss = getStat(homeBox, 'possessionPct');
    const awayPoss = getStat(awayBox, 'possessionPct');
    return {
      possession: [homePoss || (awayPoss ? 100 - awayPoss : 50), awayPoss || (homePoss ? 100 - homePoss : 50)],
      shotsTotal: [getStat(homeBox, 'totalShots') || getStat(homeBox, 'shots'), getStat(awayBox, 'totalShots') || getStat(awayBox, 'shots')],
      shotsOnTarget: [getStat(homeBox, 'shotsOnTarget'), getStat(awayBox, 'shotsOnTarget')],
      fouls: [getStat(homeBox, 'foulsCommitted'), getStat(awayBox, 'foulsCommitted')],
      corners: [getStat(homeBox, 'wonCorners'), getStat(awayBox, 'wonCorners')],
      yellowCards: [getStat(homeBox, 'yellowCards'), getStat(awayBox, 'yellowCards')],
      redCards: [getStat(homeBox, 'redCards'), getStat(awayBox, 'redCards')],
      offsides: [getStat(homeBox, 'offsides'), getStat(awayBox, 'offsides')],
      saves: [getStat(homeBox, 'saves'), getStat(awayBox, 'saves')],
    };
  };

  // Helper to extract events/goals from real provider summary
  const extractEventsFromSummary = (summary: any): any[] => {
    const rawDetails = summary?.header?.competitions?.[0]?.details || summary?.details || summary?.keyEvents || summary?.events || [];
    const events: any[] = [];
    if (Array.isArray(rawDetails)) {
      for (const d of rawDetails) {
        const isGoal = d.type?.text === 'Goal' || d.type?.id === '70' || d.scoringPlay === true;
        const isCard = d.type?.text?.includes('Card') || d.type?.name?.includes('Card');
        const isYellow = isCard && (d.type?.text?.includes('Yellow') || d.type?.id === '51');
        const isRed = isCard && (d.type?.text?.includes('Red') || d.type?.id === '52');
        const isSub = d.type?.text === 'Substitution' || d.type?.id === '11';

        let type: any = 'GOAL';
        if (isYellow) type = 'YELLOW_CARD';
        else if (isRed) type = 'RED_CARD';
        else if (isSub) type = 'SUBSTITUTION';
        else if (isGoal) type = 'GOAL';
        else continue;

        const teamId = String(d.team?.id || '');
        const athlete = d.athletesInvolved?.[0] || d.athlete || {};
        const rawClock = d.clock?.displayValue || d.clock?.value || '0';
        const eventMin = parseInt(String(rawClock).replace("'", ''), 10) || 0;

        events.push({
          id: `ev-${d.id || eventMin || Math.random()}`,
          minute: eventMin,
          type,
          teamId: `team-${teamId}`,
          teamName: d.team?.displayName || (teamId.includes(match.homeTeam.id.replace('team-', '')) ? match.homeTeam.name : match.awayTeam.name),
          playerId: athlete.id ? `p-${athlete.id}` : undefined,
          playerName: athlete.fullName || athlete.displayName || athlete.name || athlete.shortName || (d.team?.displayName || match.homeTeam.name),
          detail: d.text || d.description || d.type?.text,
          isHomeTeam: teamId.includes(match.homeTeam.id.replace('team-', '')),
        });
      }
    }
    return events;
  };

  // Helper to extract confirmed lineups from real provider rosters
  const extractLineupsFromSummary = (summary: any): any => {
    const rosters = summary?.rosters;
    if (!Array.isArray(rosters) || rosters.length < 2) return null;
    const parseLineup = (roster: any, isHome: boolean) => {
      const starting = (roster.roster || []).filter((p: any) => p.starter === true);
      const bench = (roster.roster || []).filter((p: any) => p.starter === false);
      const coach = roster.coach?.[0]?.displayName || (isHome ? 'Manager' : 'Head Coach');
      const teamLabel = isHome ? match.homeTeam.name : match.awayTeam.name;
      const formatPlayer = (p: any) => {
        const jerseyNum = parseInt(String(p.jersey || p.athlete?.jersey || '0'), 10) || 1;
        const athleteName =
          p.athlete?.fullName ||
          p.athlete?.displayName ||
          p.athlete?.name ||
          p.athlete?.shortName ||
          p.displayName ||
          p.name ||
          `${teamLabel} #${jerseyNum}`;
        return {
          playerId: `p-${p.athlete?.id || jerseyNum || Math.random()}`,
          name: athleteName,
          shirtNumber: jerseyNum,
          position: p.position?.abbreviation || p.athlete?.position?.abbreviation || 'MF',
          gridPosition: { x: 50, y: 50 },
          isCaptain: p.captain || false,
        };
      };
      return {
        formation: roster.formation || '4-3-3',
        coach,
        startingXI: starting.map(formatPlayer),
        bench: bench.map(formatPlayer),
      };
    };
    return {
      home: parseLineup(rosters[0], true),
      away: parseLineup(rosters[1], false),
    };
  };

  // Combined Active Verified Match Data
  const activeStats = match.statistics || (summaryData ? extractStatisticsFromSummary(summaryData) : undefined);
  const activeEvents = match.events && match.events.length > 0 ? match.events : (summaryData ? extractEventsFromSummary(summaryData) : []);
  const activeLineups = match.lineups || (summaryData ? extractLineupsFromSummary(summaryData) : undefined);

  // Real match events
  const goalEvents = Array.isArray(activeEvents)
    ? activeEvents.filter((e) => e.type === 'GOAL' || e.type === 'PENALTY_GOAL')
    : [];

  const subEvents = Array.isArray(activeEvents)
    ? activeEvents.filter((e) => e.type === 'SUBSTITUTION')
    : [];

  const cardEvents = Array.isArray(activeEvents)
    ? activeEvents.filter((e) => e.type === 'YELLOW_CARD' || e.type === 'RED_CARD')
    : [];

  // Moment of the Match (latest decisive goal or card)
  const keyMoment = goalEvents.length > 0
    ? goalEvents[goalEvents.length - 1]
    : cardEvents.length > 0
    ? cardEvents[cardEvents.length - 1]
    : null;

  const statBar = (
    label: string,
    valA: number,
    valB: number,
    isPercentage: boolean = false,
    formatFixed: boolean = false
  ) => {
    const total = valA + valB === 0 ? 1 : valA + valB;
    const pctA = Math.round((valA / total) * 100);
    const pctB = 100 - pctA;

    return (
      <div className="py-2.5 space-y-1 text-xs">
        <div className="flex items-center justify-between text-slate-700 font-semibold">
          <span className="font-mono font-bold text-slate-900">
            {formatFixed ? valA.toFixed(2) : valA}
            {isPercentage ? '%' : ''}
          </span>
          <span className="text-slate-500 font-sans text-[11px] uppercase tracking-wider">{label}</span>
          <span className="font-mono font-bold text-slate-900">
            {formatFixed ? valB.toFixed(2) : valB}
            {isPercentage ? '%' : ''}
          </span>
        </div>
        <div className="flex h-2 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200">
          <div
            className="h-full transition-all duration-500 rounded-l-full bg-[#009270]"
            style={{ width: `${pctA}%` }}
          />
          <div
            className="h-full transition-all duration-500 rounded-r-full bg-[#132257]"
            style={{ width: `${pctB}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => navigateTo('matches')}
          className="flex items-center gap-1.5 text-xs font-bold text-[#009270] hover:underline transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Match Schedule</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* Follow Match CTA (Feature 12) */}
          <button
            onClick={() => toggleFollowMatch(match.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-2xs active:scale-98 ${
              isFollowed
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
            title={isFollowed ? 'Following match (In Your Matches)' : 'Follow this match'}
          >
            <Heart className={`w-3.5 h-3.5 ${isFollowed ? 'fill-current text-rose-500' : 'text-slate-400'}`} />
            <span>{isFollowed ? 'Following' : 'Follow'}</span>
          </button>

          {/* Match Reminder CTA (Feature 13) */}
          {isScheduled && (
            <button
              onClick={() => toggleMatchReminder(match.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-2xs active:scale-98 ${
                isReminded
                  ? 'bg-amber-50 border-amber-200 text-amber-700'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
              title="Get in-app kickoff reminder alert"
            >
              <Bell className={`w-3.5 h-3.5 ${isReminded ? 'fill-current text-amber-500' : 'text-slate-400'}`} />
              <span>{isReminded ? 'Reminded' : 'Remind me'}</span>
            </button>
          )}

          {/* FootBuzz Live Mode CTA (Feature 31) */}
          {isLive && (
            <button
              onClick={() => setLiveModeMatchId(match.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 text-emerald-400 border border-emerald-500/40 text-xs font-black shadow-xs hover:bg-black transition-all active:scale-98"
              title="Switch to immersive FootBuzz Live Mode"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>⚡ Live Mode</span>
            </button>
          )}

          {/* Live AI Commentary CTA */}
          <button
            onClick={() => setComingSoonFeature('ai-commentary')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-black transition-all shadow-xs hover:scale-[1.02] active:scale-98 relative"
            title="Listen to Live AI Audio & Tactical Commentary"
          >
            <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping" />
            <span>AI Commentary</span>
            <span className="px-1 py-0.2 rounded bg-amber-400 text-slate-950 text-[9px] font-black uppercase tracking-wider ml-0.5">
              Live
            </span>
          </button>

          {/* Live Chat CTA */}
          <button
            onClick={() => setComingSoonFeature('live-chat')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition-all shadow-xs hover:scale-[1.02] active:scale-98"
            title="Join Live Fan Match Chat"
          >
            <span>💬 Live Chat</span>
          </button>

          {isScheduled && (
            <button
              onClick={() => setTicketModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-xs font-black text-[#009270] transition-all shadow-2xs hover:scale-[1.02] active:scale-98"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Buy Tickets</span>
            </button>
          )}

          <button
            onClick={() => setCompareModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-emerald-500 text-xs font-bold text-slate-700 transition-colors shadow-2xs"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-[#009270]" />
            <span className="hidden sm:inline">Compare</span>
          </button>

          {/* Match Share Card (Feature 28) */}
          <button
            onClick={() => setShareModalOpen(true)}
            className="p-2 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 transition-colors shadow-2xs"
            title="Share Match Scorecard Summary"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => toggleBookmarkMatch(match.id)}
            className={`p-2 rounded-lg bg-white border border-slate-200 hover:border-slate-300 transition-colors shadow-2xs ${
              bookmarked ? 'text-amber-500' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Bookmark Match"
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Signature Scorecard Header */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => navigateTo('competition-detail', { competitionId: match.competitionId })}
              className="font-black text-[#009270] hover:underline"
            >
              {match.competitionName}
            </button>
            {match.round && <span className="font-semibold text-slate-700">· {match.round}</span>}
            {match.season && <span>· {match.season}</span>}

            {/* Match Mood Visual Identity (Feature 9) */}
            <span className={`ml-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${mood.badgeStyle}`}>
              {mood.emoji} {mood.label}
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{match.date}</span>
            {match.venue && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {match.venue}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Scoreboard Area */}
        <div className="py-4 grid grid-cols-3 items-center gap-4 text-center">
          {/* Home Team */}
          <div
            onClick={() => navigateTo('team-detail', { teamId: match.homeTeam.id })}
            className="flex flex-col items-center gap-2.5 cursor-pointer group"
          >
            <ClubCrest
              name={match.homeTeam.name}
              code={match.homeTeam.code}
              country={match.homeTeam.country}
              crestUrl={match.homeTeam.crestUrl}
              size="xl"
            />
            <div>
              <div className="text-base sm:text-lg font-black text-slate-900 group-hover:text-[#009270] transition-colors">
                {match.homeTeam.name}
              </div>
              <div className="text-xs text-slate-500">{match.homeTeam.country}</div>
            </div>
          </div>

          {/* Central Score and Status */}
          <div className="flex flex-col items-center justify-center space-y-2.5">
            {isLive ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 font-black font-mono text-xs shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-live" />
                <span>{match.status === 'HT' ? 'HALF TIME' : match.minute ? `LIVE ${match.minute}'` : 'LIVE'}</span>
              </div>
            ) : match.status === 'FINISHED' ? (
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Full Time {match.score.penalties ? '(Pens)' : ''}
              </div>
            ) : match.status === 'POSTPONED' ? (
              <div className="px-3 py-1 rounded-xl bg-amber-100 text-amber-900 font-bold text-xs">
                {match.postponedReason || 'Match Postponed'}
              </div>
            ) : (
              /* Match Countdown (Feature 10) */
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>{countdown.text}</span>
              </div>
            )}

            {isLive || match.status === 'FINISHED' || match.score.home !== null ? (
              <div className="flex items-center justify-center gap-3">
                <span className="font-mono text-4xl sm:text-5xl font-black text-slate-900 tabular-nums">
                  {match.score.home !== null && !isNaN(match.score.home) ? match.score.home : 0}
                </span>
                <span className="text-slate-300 font-mono text-2xl font-light">–</span>
                <span className="font-mono text-4xl sm:text-5xl font-black text-slate-900 tabular-nums">
                  {match.score.away !== null && !isNaN(match.score.away) ? match.score.away : 0}
                </span>
              </div>
            ) : (
              <div className="font-mono text-3xl text-slate-400 font-bold">VS</div>
            )}

            {/* Goalscorers Live / Finished Panel */}
            {(isLive || match.status === 'FINISHED') && goalEvents.length > 0 && (
              <div className="w-full max-w-md mx-auto pt-2 grid grid-cols-2 gap-2 text-[11px] border-t border-slate-100 font-medium">
                <div className="text-right space-y-0.5 pr-2 border-r border-slate-200">
                  {goalEvents
                    .filter((g) => g.isHomeTeam || g.teamId === match.homeTeam.id)
                    .map((g, idx) => (
                      <div key={idx} className="flex items-center justify-end gap-1 text-slate-800">
                        <span className="font-bold">{g.playerName}</span>
                        <span className="font-mono text-slate-500">{g.minute}'</span>
                        <span className="text-amber-500 animate-pulse">⚽</span>
                      </div>
                    ))}
                </div>
                <div className="text-left space-y-0.5 pl-2">
                  {goalEvents
                    .filter((g) => !g.isHomeTeam && g.teamId !== match.homeTeam.id)
                    .map((g, idx) => (
                      <div key={idx} className="flex items-center justify-start gap-1 text-slate-800">
                        <span className="text-amber-500 animate-pulse">⚽</span>
                        <span className="font-mono text-slate-500">{g.minute}'</span>
                        <span className="font-bold">{g.playerName}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {match.score.penalties && (
              <div className="text-xs font-mono text-[#009270] font-bold">
                Penalties: {match.score.penalties.home} – {match.score.penalties.away}
              </div>
            )}

            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-[#009270]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#009270]" />
              <span>Provider ID: {match.providerMatchId || match.id}</span>
            </div>

            {/* Quick Actions (PART A: 1. Watch Videos, Feature 29: Tickets) */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <button
                onClick={() => setActiveTab('videos')}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black transition-all shadow-xs flex items-center gap-1.5 active:scale-98"
                title="Watch verified match highlights and videos"
              >
                <Video className="w-3.5 h-3.5" />
                <span>🎥 Watch Videos</span>
              </button>

              {isScheduled && (
                <button
                  onClick={() => setTicketModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition-all shadow-xs flex items-center gap-1.5 active:scale-98"
                >
                  <Ticket className="w-3.5 h-3.5 text-amber-300" />
                  <span>🎟️ Tickets</span>
                </button>
              )}
            </div>
          </div>

          {/* Away Team */}
          <div
            onClick={() => navigateTo('team-detail', { teamId: match.awayTeam.id })}
            className="flex flex-col items-center gap-2.5 cursor-pointer group"
          >
            <ClubCrest
              name={match.awayTeam.name}
              code={match.awayTeam.code}
              country={match.awayTeam.country}
              crestUrl={match.awayTeam.crestUrl}
              size="xl"
            />
            <div>
              <div className="text-base sm:text-lg font-black text-slate-900 group-hover:text-[#009270] transition-colors">
                {match.awayTeam.name}
              </div>
              <div className="text-xs text-slate-500">{match.awayTeam.country}</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-slate-100">
          {[
            { id: 'overview', label: 'Match Info' },
            { id: 'videos', label: '🎥 Match Videos' },
            { id: 'commentary', label: 'Key Events & Moments' },
            { id: 'lineups', label: 'Interactive Lineups' },
            { id: 'stats', label: 'Match Statistics' },
            { id: 'h2h', label: 'Head-to-Head & Form' },
            { id: 'tactics', label: 'Tactical Analysis' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as MatchTab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#009270] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOMENT OF THE MATCH (WHERE REAL DATA SUPPORTS IT) */}
      {/* ========================================================================= */}
      {keyMoment && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-blue-500/10 border border-amber-200/80 flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="text-[11px] font-black uppercase tracking-wider text-amber-900 font-mono">
                Moment of the Match · {keyMoment.minute}'
              </div>
              <div className="font-extrabold text-sm text-slate-900">
                {keyMoment.playerName} ({keyMoment.teamName}) — {keyMoment.detail || 'Decisive Goal'}
              </div>
            </div>
          </div>

          <span className="text-[11px] font-mono text-slate-500 font-bold shrink-0">
            Verified Event
          </span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider font-display">Match Overview</h3>
            {(isLive || match.status === 'FINISHED') && (
              <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-slate-900 text-white shadow-2xs">
                {match.score.home ?? 0} – {match.score.away ?? 0}
              </span>
            )}
          </div>

          {/* Goal Scorers Showcase (Feature: Detailed Player Goal Stats) */}
          {(isLive || match.status === 'FINISHED') && goalEvents.length > 0 && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-emerald-500/5 to-slate-50 border border-amber-200/80 space-y-3">
              <div className="flex items-center justify-between text-xs font-black text-slate-900 pb-2 border-b border-amber-200/60">
                <span className="flex items-center gap-1.5 uppercase tracking-wider">
                  <span className="text-amber-500">⚽</span> Match Goalscorers
                </span>
                <span className="text-slate-500 font-mono text-[11px] font-bold">
                  {goalEvents.length} Total {goalEvents.length === 1 ? 'Goal' : 'Goals'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {goalEvents.map((g, idx) => (
                  <div
                    key={`ov-goal-${idx}-${g.playerName}`}
                    onClick={() => {
                      if (g.playerId) {
                        navigateTo('player-detail', { playerId: g.playerId });
                      }
                    }}
                    className={`p-2.5 rounded-xl bg-white border border-slate-200/90 flex items-center justify-between gap-2.5 shadow-2xs hover:border-[#009270] transition-all ${
                      g.playerId ? 'cursor-pointer hover:scale-[1.01]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <PlayerAvatar
                        id={g.playerId}
                        name={g.playerName}
                        size="sm"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-black text-slate-900 truncate hover:text-[#009270]">
                          {g.playerName}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {g.teamName || (g.isHomeTeam ? match.homeTeam.name : match.awayTeam.name)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-mono text-xs font-bold">
                        ⚽ {g.minute}'
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="font-bold text-slate-900 text-sm">Fixture Information</div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Date:</span>
                <span className="font-semibold">{match.date}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Kickoff Time:</span>
                <span className="font-semibold">{match.time} ({match.timezone || 'Local'})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Competition:</span>
                <span className="font-semibold">{match.competitionName}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-[#009270]">{match.status}</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="font-bold text-slate-900 text-sm">Venue & Officials</div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Stadium:</span>
                <span className="font-semibold">{match.venue || match.city || 'Stadium'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">City / Location:</span>
                <span className="font-semibold">{match.city || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Referee:</span>
                <span className="font-semibold">{match.referee || 'Official data not reported'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Attendance:</span>
                <span className="font-semibold">{match.attendance ? match.attendance.toLocaleString() : 'N/A'}</span>
              </div>
            </div>
          </div>

          {isScheduled && (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-black text-emerald-950 font-display">
                  <Ticket className="w-4 h-4 text-[#009270]" />
                  <span>Looking to Attend in Person?</span>
                </div>
                <p className="text-xs text-emerald-900/80">
                  Book verified official tickets, stadium seats, and hospitality passes for this fixture.
                </p>
              </div>

              <button
                onClick={() => setTicketModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-[#009270] hover:bg-[#028060] text-white text-xs font-black transition-all shadow-xs flex items-center justify-center gap-2 shrink-0 active:scale-98"
              >
                <Ticket className="w-4 h-4" />
                <span>Buy Official Tickets</span>
              </button>
            </div>
          )}

          {/* PART A: Watch the Match / Official Match Videos Section */}
          <div className="pt-2">
            <MatchVideosSection match={match} />
          </div>

          {/* Feature 18: PLAYER IN FOCUS */}
          {playerInFocus && (
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white border border-emerald-500/30 space-y-4 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                  <span className="text-xs font-black uppercase tracking-wider font-mono text-emerald-300">
                    PLAYER IN FOCUS
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Verified Provider Matchday Profile</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <PlayerAvatar
                    id={playerInFocus.id}
                    name={playerInFocus.name}
                    photoUrl={playerInFocus.photoUrl}
                    number={playerInFocus.shirtNumber}
                    size="lg"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-lg font-black text-white font-display">
                        {playerInFocus.name}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md bg-white/10 text-emerald-300 font-mono text-xs font-bold">
                        #{playerInFocus.shirtNumber}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 mt-0.5">
                      {playerInFocus.currentTeamName} · {playerInFocus.detailedPosition || playerInFocus.position} · {playerInFocus.nationality}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => navigateTo('player-detail', { playerId: playerInFocus.id })}
                    className="px-3.5 py-1.5 rounded-xl bg-white text-slate-950 text-xs font-bold hover:bg-emerald-50 transition-all shadow-xs"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => setPlayerCompareIds([playerInFocus.id, ''])}
                    className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-1"
                  >
                    <ArrowRightLeft className="w-3 h-3 text-emerald-300" />
                    <span>Compare</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/10 text-center">
                <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <div className="text-xs text-slate-400">Goals</div>
                  <div className="text-lg font-black font-mono text-white mt-0.5">{playerInFocus.seasonStats.goals}</div>
                </div>
                <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <div className="text-xs text-slate-400">Assists</div>
                  <div className="text-lg font-black font-mono text-white mt-0.5">{playerInFocus.seasonStats.assists}</div>
                </div>
                <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <div className="text-xs text-slate-400">Pass Accuracy</div>
                  <div className="text-lg font-black font-mono text-white mt-0.5">{playerInFocus.seasonStats.passAccuracy}%</div>
                </div>
                <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <div className="text-xs text-slate-400">Rating</div>
                  <div className="text-lg font-black font-mono text-emerald-400 mt-0.5">
                    {playerInFocus.seasonStats.rating ? `${playerInFocus.seasonStats.rating} (Opta)` : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Features 14 & 15: FORM GUIDE & HEAD-TO-HEAD */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#009270]" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 font-display">
                  Recent Form Guide (Last 5)
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Real Provider Match Results</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-slate-700">{match.homeTeam.name}</div>
                <div className="flex items-center gap-1.5">
                  {homeForm.map((f, i) => (
                    <span
                      key={`hf-${i}`}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shadow-2xs ${
                        f === 'W' ? 'bg-[#009270] text-white' : f === 'D' ? 'bg-amber-500 text-white' : 'bg-rose-600 text-white'
                      }`}
                      title={`Match result: ${f === 'W' ? 'Win' : f === 'D' ? 'Draw' : 'Loss'}`}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-bold text-slate-700">{match.awayTeam.name}</div>
                <div className="flex items-center gap-1.5">
                  {awayForm.map((f, i) => (
                    <span
                      key={`af-${i}`}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shadow-2xs ${
                        f === 'W' ? 'bg-[#009270] text-white' : f === 'D' ? 'bg-amber-500 text-white' : 'bg-rose-600 text-white'
                      }`}
                      title={`Match result: ${f === 'W' ? 'Win' : f === 'D' ? 'Draw' : 'Loss'}`}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Previous Meetings */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Previous Meetings</div>
              {h2hMatches.length > 0 ? (
                <div className="space-y-2">
                  {h2hMatches.slice(0, 3).map((hm) => (
                    <div
                      key={`h2h-m-${hm.id}`}
                      onClick={() => navigateTo('match-centre', { matchId: hm.id })}
                      className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-[#009270] flex items-center justify-between text-xs cursor-pointer transition-colors"
                    >
                      <span className="text-slate-500 font-mono text-[11px]">{hm.date}</span>
                      <span className="font-bold text-slate-900">
                        {hm.homeTeam.shortName} {hm.score.home ?? 0} – {hm.score.away ?? 0} {hm.awayTeam.shortName}
                      </span>
                      <span className="text-slate-400 text-[11px] truncate max-w-[120px]">{hm.competitionName}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic">
                  First recorded encounter between these two sides in the current season data feed.
                </div>
              )}
            </div>
          </div>

          {/* Feature 30: FOOTBALL KNOWLEDGE */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 space-y-1.5">
            <div className="font-black flex items-center gap-1.5 uppercase tracking-wider text-[11px] text-blue-900 font-mono">
              <Info className="w-3.5 h-3.5 text-blue-700" />
              <span>Football Knowledge & Context</span>
            </div>
            <p className="text-blue-900/90 leading-relaxed">
              {match.competitionName} {match.round ? `(${match.round})` : ''} fixture hosted at {match.venue || 'Stadium'} in {match.city || match.homeTeam.country}.
              {match.competitionCategory === 'cup'
                ? ' Single-leg knockout rules apply with extra time and penalty shootouts if level.'
                : ' Standard 3 points awarded for a win and 1 point for a draw in league standings.'}
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: MATCH VIDEOS (PART A: 1-8) */}
      {/* ========================================================================= */}
      {activeTab === 'videos' && (
        <div className="space-y-4">
          <MatchVideosSection match={match} />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: HEAD-TO-HEAD & FORM (Features 14 & 15) */}
      {/* ========================================================================= */}
      {activeTab === 'h2h' && (
        <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-black text-slate-900 font-display">Head-to-Head Matrix & Recent Form</h3>
              <p className="text-xs text-slate-500">Historical encounters and last 5 match trajectory</p>
            </div>
          </div>

          {/* Form Guide */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <ClubCrest name={match.homeTeam.name} code={match.homeTeam.code} crestUrl={match.homeTeam.crestUrl} size="sm" />
                <span className="font-bold text-sm text-slate-900">{match.homeTeam.name}</span>
              </div>
              <div className="text-xs text-slate-500 font-semibold">Last 5 Matches Form:</div>
              <div className="flex items-center gap-2">
                {homeForm.map((f, i) => (
                  <span
                    key={`hf2-${i}`}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shadow-xs ${
                      f === 'W' ? 'bg-[#009270] text-white' : f === 'D' ? 'bg-amber-500 text-white' : 'bg-rose-600 text-white'
                    }`}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <ClubCrest name={match.awayTeam.name} code={match.awayTeam.code} crestUrl={match.awayTeam.crestUrl} size="sm" />
                <span className="font-bold text-sm text-slate-900">{match.awayTeam.name}</span>
              </div>
              <div className="text-xs text-slate-500 font-semibold">Last 5 Matches Form:</div>
              <div className="flex items-center gap-2">
                {awayForm.map((f, i) => (
                  <span
                    key={`af2-${i}`}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shadow-xs ${
                      f === 'W' ? 'bg-[#009270] text-white' : f === 'D' ? 'bg-amber-500 text-white' : 'bg-rose-600 text-white'
                    }`}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Previous Meetings List */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Historical Encounters & Meetings
            </h4>
            {h2hMatches.length > 0 ? (
              <div className="space-y-2">
                {h2hMatches.map((m) => (
                  <div
                    key={`h2h-row-${m.id}`}
                    onClick={() => navigateTo('match-centre', { matchId: m.id })}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between gap-3 text-xs cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-500">{m.date}</span>
                      <span className="text-slate-400">·</span>
                      <span className="font-bold text-slate-700">{m.competitionName}</span>
                    </div>

                    <div className="font-mono font-bold text-sm text-slate-900">
                      {m.homeTeam.shortName} {m.score.home ?? 0} – {m.score.away ?? 0} {m.awayTeam.shortName}
                    </div>

                    <span className="text-[#009270] font-bold text-xs">Match Center →</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
                No past clashes recorded between these clubs in the current sports provider schedule.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: KEY EVENTS & MOMENTS */}
      {/* ========================================================================= */}
      {activeTab === 'commentary' && (
        <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-6">
          {/* Live AI Commentary & Live Fan Chat Interactive Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-[#090d16] text-white border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-mono font-black uppercase tracking-wider text-emerald-300">
                  Live Match Experience
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                  AI Beta
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-black font-display text-white">
                Live AI Commentary & Interactive Fan Chat Lounge
              </h4>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                Tune into real-time multilingual AI voice commentary or chat live with fellow supporters during the match.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => setComingSoonFeature('ai-commentary')}
                className="px-4 py-2 rounded-xl bg-[#009270] hover:bg-[#028060] text-white text-xs font-black transition-all shadow-xs flex items-center gap-1.5 active:scale-98"
              >
                <span>🎙️ Live AI Voice</span>
              </button>

              <button
                onClick={() => setComingSoonFeature('live-chat')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-black transition-all border border-slate-700 shadow-xs flex items-center gap-1.5 active:scale-98"
              >
                <span>💬 Join Live Chat</span>
              </button>
            </div>
          </div>

          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider font-display">Match Events & Timeline</h3>

          {/* Sub Events Animations Indicator */}
          {subEvents.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Repeat className="w-3.5 h-3.5 text-blue-600" />
                Verified Substitutions
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {subEvents.map((sub) => (
                  <div key={sub.id} className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200 flex items-center justify-between gap-3 text-xs">
                    <span className="font-mono font-bold text-blue-800">{sub.minute}'</span>
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-rose-600 font-bold truncate">OUT: {sub.playerOutName || sub.detail || 'Outgoing'}</span>
                      <span>⇄</span>
                      <span className="text-emerald-700 font-bold truncate">IN: {sub.playerInName || sub.playerName || 'Incoming'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeEvents && activeEvents.length > 0 ? (
            <div className="space-y-3">
              {activeEvents.map((ev) => {
                const isExpanded = expandedEventId === ev.id;
                return (
                  <div
                    key={ev.id}
                    onClick={() => setExpandedEventId(isExpanded ? null : ev.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isExpanded
                        ? 'bg-emerald-50/50 border-[#009270] shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
                    }`}
                  >
                    <div className="text-xs flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-mono font-black text-sm text-[#009270] bg-emerald-100/80 px-2 py-1 rounded-lg border border-emerald-200 shrink-0">
                          {ev.minute}'
                        </span>
                        <div className="min-w-0">
                          <div className="font-extrabold text-sm text-slate-900 truncate">{ev.playerName}</div>
                          <div className="text-slate-500 truncate">{ev.detail || 'Match Event'} · {ev.teamName}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-bold text-slate-700">
                          {ev.type === 'GOAL' ? '⚽ Goal' : ev.type === 'YELLOW_CARD' ? '🟨 Card' : ev.type === 'RED_CARD' ? '🔴 Red Card' : '🔄 Sub'}
                        </span>
                        <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </div>
                    </div>

                    {/* Expandable More Information on Tap (Feature 11) */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-emerald-200/60 text-xs text-slate-700 space-y-2 animate-in fade-in">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-white p-2.5 rounded-xl border border-emerald-200/50">
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Recorded Minute</span>
                            <span className="font-mono font-bold text-slate-900">{ev.minute}' ({ev.minute <= 45 ? '1st Half' : '2nd Half'})</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Club</span>
                            <span className="font-semibold text-slate-900">{ev.teamName}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Telemetry Source</span>
                            <span className="font-semibold text-[#009270]">Official Feed Verified</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-600 italic">
                          Tap again to collapse match event details.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              No live goal events recorded for this fixture.
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: INTERACTIVE LINEUPS (PITCH & CARDS) */}
      {/* ========================================================================= */}
      {activeTab === 'lineups' && (
        <div className="space-y-6">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 p-5 shadow-xs flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 font-display">Interactive Starting Lineups</h3>
              <p className="text-xs text-slate-500">Tap any player card to flip stats or inspect full profile</p>
            </div>

            {/* Pitch vs Cards View Mode Switcher */}
            <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs">
              <button
                onClick={() => setLineupViewMode('CARDS')}
                className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  lineupViewMode === 'CARDS' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Player Cards</span>
              </button>

              <button
                onClick={() => setLineupViewMode('PITCH')}
                className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  lineupViewMode === 'PITCH' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>Pitch View</span>
              </button>
            </div>
          </div>

          {activeLineups ? (
            lineupViewMode === 'PITCH' ? (
              <FootballPitch
                homePlayers={activeLineups.home.startingXI}
                awayPlayers={activeLineups.away.startingXI}
                homeTeamName={match.homeTeam.name}
                awayTeamName={match.awayTeam.name}
                onPlayerClick={(p) => setSelectedPlayerForModal(p)}
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Home Lineup */}
                <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 p-6 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <ClubCrest name={match.homeTeam.name} code={match.homeTeam.code} crestUrl={match.homeTeam.crestUrl} size="sm" />
                      <div>
                        <div className="font-black text-sm text-slate-900">{match.homeTeam.name}</div>
                        <div className="text-xs text-slate-500 font-mono">Formation: {activeLineups.home.formation} · Coach: {activeLineups.home.coach}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeLineups.home.startingXI.map((player: any) => (
                      <PlayerCard
                        key={`h-${player.playerId}`}
                        player={player}
                        teamName={match.homeTeam.shortName}
                        isStartingXI={true}
                        onCompare={(pid) => setPlayerCompareIds([pid, ''])}
                        onViewProfile={() => setSelectedPlayerForModal(player)}
                      />
                    ))}
                  </div>

                  {/* Substitutes */}
                  {activeLineups.home.bench.length > 0 && (
                    <div className="pt-4 border-t border-slate-100 space-y-2">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Substitutes</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {activeLineups.home.bench.map((player: any) => (
                          <PlayerCard
                            key={`hb-${player.playerId}`}
                            player={player}
                            teamName={match.homeTeam.shortName}
                            isStartingXI={false}
                            onCompare={(pid) => setPlayerCompareIds([pid, ''])}
                            onViewProfile={() => setSelectedPlayerForModal(player)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Away Lineup */}
                <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 p-6 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <ClubCrest name={match.awayTeam.name} code={match.awayTeam.code} crestUrl={match.awayTeam.crestUrl} size="sm" />
                      <div>
                        <div className="font-black text-sm text-slate-900">{match.awayTeam.name}</div>
                        <div className="text-xs text-slate-500 font-mono">Formation: {activeLineups.away.formation} · Coach: {activeLineups.away.coach}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeLineups.away.startingXI.map((player: any) => (
                      <PlayerCard
                        key={`a-${player.playerId}`}
                        player={player}
                        teamName={match.awayTeam.shortName}
                        isStartingXI={true}
                        onCompare={(pid) => setPlayerCompareIds([pid, ''])}
                        onViewProfile={() => setSelectedPlayerForModal(player)}
                      />
                    ))}
                  </div>

                  {/* Substitutes */}
                  {activeLineups.away.bench.length > 0 && (
                    <div className="pt-4 border-t border-slate-100 space-y-2">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Substitutes</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {activeLineups.away.bench.map((player: any) => (
                          <PlayerCard
                            key={`ab-${player.playerId}`}
                            player={player}
                            teamName={match.awayTeam.shortName}
                            isStartingXI={false}
                            onCompare={(pid) => setPlayerCompareIds([pid, ''])}
                            onViewProfile={() => setSelectedPlayerForModal(player)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          ) : (
            <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-3xl border border-slate-200">
              Official confirmed lineups are published 60 minutes prior to kickoff. Check back closer to match time.
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: STATISTICS */}
      {/* ========================================================================= */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          {/* Dedicated Goal Stats & Goalscorers Section */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-base shadow-2xs">
                  ⚽
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider font-display">
                    Goal Statistics & Goalscorers
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Official goalscorers, scoring minutes, and penalty breakdowns
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold">
                {match.score.home ?? 0} – {match.score.away ?? 0}
              </span>
            </div>

            {/* Goalscorers Grid: Home Team vs Away Team */}
            {goalEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Home Team Goals & Scorers */}
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200">
                    <div className="flex items-center gap-2 min-w-0">
                      <ClubCrest
                        name={match.homeTeam.name}
                        code={match.homeTeam.code}
                        country={match.homeTeam.country}
                        crestUrl={match.homeTeam.crestUrl}
                        size="xs"
                      />
                      <span className="text-xs font-black text-slate-900 truncate">
                        {match.homeTeam.name}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-900">
                      {goalEvents.filter((g) => g.isHomeTeam || g.teamId === match.homeTeam.id).length} {goalEvents.filter((g) => g.isHomeTeam || g.teamId === match.homeTeam.id).length === 1 ? 'Goal' : 'Goals'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {goalEvents.filter((g) => g.isHomeTeam || g.teamId === match.homeTeam.id).length > 0 ? (
                      goalEvents
                        .filter((g) => g.isHomeTeam || g.teamId === match.homeTeam.id)
                        .map((g, idx) => (
                          <div
                            key={`hg-${idx}-${g.playerName}`}
                            onClick={() => {
                              if (g.playerId) {
                                navigateTo('player-detail', { playerId: g.playerId });
                              }
                            }}
                            className={`p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-3 shadow-2xs hover:border-[#009270] transition-all ${
                              g.playerId ? 'cursor-pointer hover:shadow-xs' : ''
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <PlayerAvatar
                                id={g.playerId}
                                name={g.playerName}
                                size="sm"
                              />
                              <div className="min-w-0">
                                <div className="text-xs font-black text-slate-900 truncate hover:text-[#009270]">
                                  {g.playerName}
                                </div>
                                <div className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                                  <span>{g.type === 'PENALTY_GOAL' ? '🎯 Penalty' : '⚽ Goal'}</span>
                                  {g.detail && <span className="truncate">· {g.detail}</span>}
                                </div>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-[#009270] font-mono text-xs font-bold border border-emerald-200 shrink-0">
                              {g.minute}'
                            </span>
                          </div>
                        ))
                    ) : (
                      <div className="py-4 text-center text-xs text-slate-400 italic">
                        No goals scored by {match.homeTeam.shortName}
                      </div>
                    )}
                  </div>
                </div>

                {/* Away Team Goals & Scorers */}
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200">
                    <div className="flex items-center gap-2 min-w-0">
                      <ClubCrest
                        name={match.awayTeam.name}
                        code={match.awayTeam.code}
                        country={match.awayTeam.country}
                        crestUrl={match.awayTeam.crestUrl}
                        size="xs"
                      />
                      <span className="text-xs font-black text-slate-900 truncate">
                        {match.awayTeam.name}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-900">
                      {goalEvents.filter((g) => !g.isHomeTeam && g.teamId !== match.homeTeam.id).length} {goalEvents.filter((g) => !g.isHomeTeam && g.teamId !== match.homeTeam.id).length === 1 ? 'Goal' : 'Goals'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {goalEvents.filter((g) => !g.isHomeTeam && g.teamId !== match.homeTeam.id).length > 0 ? (
                      goalEvents
                        .filter((g) => !g.isHomeTeam && g.teamId !== match.homeTeam.id)
                        .map((g, idx) => (
                          <div
                            key={`ag-${idx}-${g.playerName}`}
                            onClick={() => {
                              if (g.playerId) {
                                navigateTo('player-detail', { playerId: g.playerId });
                              }
                            }}
                            className={`p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-3 shadow-2xs hover:border-[#009270] transition-all ${
                              g.playerId ? 'cursor-pointer hover:shadow-xs' : ''
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <PlayerAvatar
                                id={g.playerId}
                                name={g.playerName}
                                size="sm"
                              />
                              <div className="min-w-0">
                                <div className="text-xs font-black text-slate-900 truncate hover:text-[#009270]">
                                  {g.playerName}
                                </div>
                                <div className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                                  <span>{g.type === 'PENALTY_GOAL' ? '🎯 Penalty' : '⚽ Goal'}</span>
                                  {g.detail && <span className="truncate">· {g.detail}</span>}
                                </div>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-[#009270] font-mono text-xs font-bold border border-emerald-200 shrink-0">
                              {g.minute}'
                            </span>
                          </div>
                        ))
                    ) : (
                      <div className="py-4 text-center text-xs text-slate-400 italic">
                        No goals scored by {match.awayTeam.shortName}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : isLive || match.status === 'FINISHED' ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                Scores level at 0–0. No goals have been scored in this match.
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                Goal statistics and goalscorer profiles will update live during match coverage.
              </div>
            )}
          </div>

          {/* Full Match Statistics Matrix */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider font-display">
                Team Performance Statistics
              </h3>
              <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
                Official Provider Verified
              </span>
            </div>
            {activeStats ? (
              <div className="space-y-3">
                {statBar(
                  'Goals Scored',
                  match.score.home !== null ? match.score.home : goalEvents.filter((g) => g.isHomeTeam || g.teamId === match.homeTeam.id).length,
                  match.score.away !== null ? match.score.away : goalEvents.filter((g) => !g.isHomeTeam && g.teamId !== match.homeTeam.id).length
                )}
                {statBar('Possession', activeStats.possession[0], activeStats.possession[1], true)}
                {statBar('Shots on Target', activeStats.shotsOnTarget[0], activeStats.shotsOnTarget[1])}
                {statBar('Total Shots', activeStats.shotsTotal[0], activeStats.shotsTotal[1])}
                {statBar('Corner Kicks', activeStats.corners[0], activeStats.corners[1])}
                {statBar('Fouls Committed', activeStats.fouls[0], activeStats.fouls[1])}
                {activeStats.yellowCards && statBar('Yellow Cards', activeStats.yellowCards[0], activeStats.yellowCards[1])}
                {activeStats.redCards && (activeStats.redCards[0] > 0 || activeStats.redCards[1] > 0) && statBar('Red Cards', activeStats.redCards[0], activeStats.redCards[1])}
                {activeStats.offsides && statBar('Offsides', activeStats.offsides[0], activeStats.offsides[1])}
                {activeStats.saves && statBar('Goalkeeper Saves', activeStats.saves[0], activeStats.saves[1])}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-500">
                Live statistics tracking activates during match play. Check back during live coverage or post-match.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: TACTICS */}
      {/* ========================================================================= */}
      {activeTab === 'tactics' && (
        <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 p-8 text-center shadow-xs space-y-2">
          <Sliders className="w-8 h-8 text-[#009270] mx-auto opacity-70" />
          <div className="text-sm font-bold text-slate-800">Tactical Pitch Analysis</div>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Optical tracking and shape telemetry are dynamically generated during televised broadcast fixtures.
          </p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}
      {/* Player Modal */}
      <PlayerModal
        player={selectedPlayerForModal}
        isOpen={Boolean(selectedPlayerForModal)}
        onClose={() => setSelectedPlayerForModal(null)}
        onCompare={(pid) => setPlayerCompareIds([pid, ''])}
      />

      {/* Player Head-to-Head Comparison Modal */}
      {playerCompareIds && (
        <PlayerComparisonModal
          initialPlayerIdA={playerCompareIds[0]}
          initialPlayerIdB={playerCompareIds[1]}
          isOpen={true}
          onClose={() => setPlayerCompareIds(null)}
        />
      )}

      {/* Match Comparison Modal */}
      <MatchComparisonModal
        initialMatchIdA={match.id}
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
      />

      {/* Ticket Modal */}
      <TicketModal
        match={match}
        isOpen={ticketModalOpen}
        onClose={() => setTicketModalOpen(false)}
      />

      {/* Match Share Modal (Feature 28) */}
      <MatchShareModal
        match={match}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />

      {/* Live AI Commentary & Live Chat Preview Modal */}
      <ComingSoonModal
        isOpen={Boolean(comingSoonFeature)}
        onClose={() => setComingSoonFeature(null)}
        featureType={comingSoonFeature || 'ai-commentary'}
        matchTitle={`${match.homeTeam.name} vs ${match.awayTeam.name}`}
      />
    </div>
  );
};

export const MatchCentre: React.FC<{ matchId?: string | null; match?: Match }> = ({
  matchId,
  match: initialMatch,
}) => {
  const { navigateTo } = useApp();
  const [resolvedMatch, setResolvedMatch] = useState<Match | null>(() => {
    if (initialMatch) return initialMatch;
    if (matchId) return footballApi.getMatchById(matchId) || null;
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(() => !resolvedMatch && Boolean(matchId));
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState<boolean>(false);

  useEffect(() => {
    if (initialMatch) {
      setResolvedMatch(initialMatch);
      setIsLoading(false);
      return;
    }

    if (!matchId) {
      // If no matchId specified, check if there are any cached matches
      const fallback = footballApi.getAllMatches()[0] || null;
      setResolvedMatch(fallback);
      setIsLoading(false);
      return;
    }

    const cached = footballApi.getMatchById(matchId);
    if (cached) {
      setResolvedMatch(cached);
      setIsLoading(false);
      return;
    }

    // Match not found in local memory, asynchronously fetch the specific match from backend
    setIsLoading(true);
    let isMounted = true;

    footballApi
      .fetchMatchById(matchId)
      .then((fetched) => {
        if (isMounted) {
          if (fetched) {
            setResolvedMatch(fetched);
          }
          setIsLoading(false);
          setHasAttemptedFetch(true);
        }
      })
      .catch((err) => {
        console.error('Failed to load match by ID:', err);
        if (isMounted) {
          setIsLoading(false);
          setHasAttemptedFetch(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [matchId, initialMatch]);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto py-6 animate-pulse">
        {/* Skeleton Top Bar */}
        <div className="h-6 w-48 bg-slate-200 rounded-md" />

        {/* Skeleton Header Card */}
        <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-5 w-32 bg-slate-200 rounded-full" />
            <div className="h-5 w-24 bg-slate-200 rounded-full" />
          </div>

          <div className="grid grid-cols-3 items-center gap-4 py-6">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-200" />
              <div className="h-4 w-28 bg-slate-200 rounded" />
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="h-8 w-16 bg-slate-200 rounded" />
              <div className="h-3 w-20 bg-slate-200 rounded" />
            </div>
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-200" />
              <div className="h-4 w-28 bg-slate-200 rounded" />
            </div>
          </div>
        </div>

        {/* Skeleton Tabs & Content */}
        <div className="h-12 bg-white rounded-2xl border border-slate-200" />
        <div className="h-64 bg-white rounded-2xl border border-slate-200" />
      </div>
    );
  }

  if (!resolvedMatch) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200 text-center space-y-5 shadow-lg">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200 text-2xl font-bold">
          ⚽
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-slate-900 font-display">
            Match Details Not Found
          </h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            {matchId
              ? `We couldn't locate match #${matchId} in the live provider feed. The match may have ended or the fixture data is currently being updated.`
              : 'No match was selected. Please choose a match from the fixtures list.'}
          </p>
        </div>

        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => navigateTo('matches')}
            className="px-6 py-2.5 rounded-xl bg-[#009270] hover:bg-[#028060] text-white text-xs font-black shadow-md transition-all active:scale-95"
          >
            Browse All Matches
          </button>
          <button
            onClick={() => navigateTo('home')}
            className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return <MatchCentreContent match={resolvedMatch} />;
};
