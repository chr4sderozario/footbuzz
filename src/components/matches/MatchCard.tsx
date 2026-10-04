/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Authentic Cricbuzz-style Football Match Card
 * Renders real scores from the data provider and displays '—' for scheduled fixtures.
 */

import React, { useState } from 'react';
import { Bookmark, Clock, Ticket, Heart, Bell, Share2, Video, Sparkles, Flame } from 'lucide-react';
import { Match } from '../../types/football';
import { ClubCrest } from '../common/ClubCrest';
import { TicketModal } from '../common/TicketModal';
import { MatchShareModal } from './MatchShareModal';
import { useApp } from '../../context/AppContext';
import { getMatchMood, getMatchCountdown } from '../../utils/footballUtils';

export const MatchCard: React.FC<{
  match: Match;
  variant?: 'default' | 'strip' | 'featured';
}> = ({ match, variant = 'default' }) => {
  const {
    navigateTo,
    isMatchFollowed,
    toggleFollowMatch,
    remindedMatchIds,
    toggleMatchReminder,
  } = useApp();

  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const isFollowed = isMatchFollowed(match.id);
  const isReminded = remindedMatchIds.includes(match.id);

  const isLive = match.status === 'LIVE' || match.status === 'HT';
  const isScheduled = match.status === 'SCHEDULED';
  const isFinished = match.status === 'FINISHED';
  const isPostponed = match.status === 'POSTPONED' || match.status === 'CANCELLED';

  const mood = getMatchMood(match);
  const countdown = getMatchCountdown(match.date, match.time);

  const goalEvents = Array.isArray(match.events)
    ? match.events.filter((e) => e.type === 'GOAL' || e.type === 'PENALTY_GOAL')
    : [];

  const homeScore = match.score.home;
  const awayScore = match.score.away;

  // Status headline
  let matchStatusHeadline = '';
  if (isLive) {
    if (homeScore !== null && awayScore !== null) {
      if (homeScore > awayScore) {
        matchStatusHeadline = `${match.homeTeam.shortName} lead by ${homeScore - awayScore} goal${homeScore - awayScore > 1 ? 's' : ''}`;
      } else if (awayScore > homeScore) {
        matchStatusHeadline = `${match.awayTeam.shortName} lead by ${awayScore - homeScore} goal${awayScore - homeScore > 1 ? 's' : ''}`;
      } else {
        matchStatusHeadline = `Scores level at ${homeScore}-${awayScore}`;
      }
    } else {
      matchStatusHeadline = 'Match is live';
    }
  } else if (isFinished) {
    if (homeScore !== null && awayScore !== null) {
      if (homeScore > awayScore) {
        matchStatusHeadline = `${match.homeTeam.shortName} won by ${homeScore - awayScore} goal${homeScore - awayScore > 1 ? 's' : ''}`;
      } else if (awayScore > homeScore) {
        matchStatusHeadline = `${match.awayTeam.shortName} won by ${awayScore - homeScore} goal${awayScore - homeScore > 1 ? 's' : ''}`;
      } else {
        matchStatusHeadline = match.score.penalties
          ? `Match tied ${homeScore}-${awayScore} (${match.score.penalties.home}-${match.score.penalties.away} on pens)`
          : `Match drawn ${homeScore}-${awayScore}`;
      }
    } else {
      matchStatusHeadline = 'Full Time';
    }
  } else if (isPostponed) {
    matchStatusHeadline = match.postponedReason || 'Match Postponed';
  } else {
    matchStatusHeadline = `Kickoff at ${match.time} (${match.venue || match.city || 'Stadium'})`;
  }

  // Strip Carousel Variant
  if (variant === 'strip') {
    return (
      <div
        onClick={() => navigateTo('match-centre', { matchId: match.id })}
        className="w-[280px] shrink-0 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200/90 p-3.5 shadow-xs hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer flex flex-col justify-between select-none"
      >
        <div className="flex items-center justify-between text-[11px] text-slate-500 pb-2 border-b border-slate-100">
          <span className="font-semibold text-slate-700 truncate max-w-[170px]">
            {match.competitionName}
          </span>
          {isLive ? (
            <span className="flex items-center gap-1 font-bold text-rose-600 font-mono text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-live" />
              {match.status === 'HT' ? 'HT' : match.minute ? `${match.minute}'` : 'LIVE'}
            </span>
          ) : isFinished ? (
            <span className="font-bold text-slate-500 text-[10px] uppercase">FT</span>
          ) : isPostponed ? (
            <span className="font-bold text-amber-700 text-[10px] uppercase">P-P</span>
          ) : (
            <span className="font-mono text-slate-600 text-[10px] font-bold">{match.time}</span>
          )}
        </div>

        {/* Teams & Scores */}
        <div className="py-2.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <ClubCrest name={match.homeTeam.name} code={match.homeTeam.code} crestUrl={match.homeTeam.crestUrl} size="xs" />
              <span className="text-xs font-bold text-slate-800 truncate">{match.homeTeam.shortName}</span>
            </div>
            <span className={`font-mono text-sm font-black tabular-nums ${isLive ? 'text-rose-600' : 'text-slate-900'}`}>
              {isLive || isFinished ? (homeScore !== null && !isNaN(homeScore) ? homeScore : 0) : '—'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <ClubCrest name={match.awayTeam.name} code={match.awayTeam.code} crestUrl={match.awayTeam.crestUrl} size="xs" />
              <span className="text-xs font-bold text-slate-800 truncate">{match.awayTeam.shortName}</span>
            </div>
            <span className={`font-mono text-sm font-black tabular-nums ${isLive ? 'text-rose-600' : 'text-slate-900'}`}>
              {isLive || isFinished ? (awayScore !== null && !isNaN(awayScore) ? awayScore : 0) : '—'}
            </span>
          </div>
        </div>

        {/* Goalscorers preview on strip */}
        {(isLive || isFinished) && goalEvents.length > 0 && (
          <div className="text-[10px] text-slate-500 font-medium truncate pt-1 border-t border-slate-100 flex items-center gap-1">
            <span className="text-amber-500">⚽</span>
            <span className="truncate">{goalEvents.map((g) => `${g.playerName} ${g.minute}'`).join(', ')}</span>
          </div>
        )}

        {/* Footnote */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1 text-[11px] font-medium text-blue-600 truncate">
          <span className="truncate">{matchStatusHeadline}</span>
          {isScheduled && match.ticketInfo && match.ticketInfo.available && (
            <span className="text-[10px] text-[#009270] font-black shrink-0">Tickets</span>
          )}
        </div>
      </div>
    );
  }

  // Standard / Featured Card
  return (
    <>
      <div
        onClick={() => navigateTo('match-centre', { matchId: match.id })}
        className="group bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 hover:border-emerald-500 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all cursor-pointer select-none space-y-3"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between text-xs pb-2.5 border-b border-slate-100 text-slate-500">
          <div className="flex items-center gap-2 truncate">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border shrink-0 ${mood.badgeStyle}`}>
              {mood.emoji} {mood.label}
            </span>
            <span className="font-bold text-slate-700 truncate">{match.competitionName}</span>
            {match.round && <span className="text-slate-400 text-[11px] hidden sm:inline">· {match.round}</span>}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {isLive ? (
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-rose-600 font-bold font-mono text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-live" />
                <span>{match.status === 'HT' ? 'HALF TIME' : match.minute ? `LIVE ${match.minute}'` : 'LIVE'}</span>
              </span>
            ) : isFinished ? (
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold text-[10px] uppercase tracking-wider">
                Full Time
              </span>
            ) : isPostponed ? (
              <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-bold text-[10px] uppercase tracking-wider">
                Postponed
              </span>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="flex items-center gap-1 font-mono text-xs font-bold text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {match.time}
                </span>
                {countdown.isUpcoming && (
                  <span className="hidden sm:inline-block text-[10px] font-mono text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    {countdown.text}
                  </span>
                )}
              </div>
            )}

            {/* Follow Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFollowMatch(match.id);
              }}
              className={`p-1.5 rounded-lg border transition-colors ${
                isFollowed
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'bg-slate-50 text-slate-400 hover:text-slate-600 border-slate-200'
              }`}
              title={isFollowed ? 'Following Match' : 'Follow Match'}
            >
              <Heart className={`w-3.5 h-3.5 ${isFollowed ? 'fill-current text-rose-500' : ''}`} />
            </button>

            {/* Kickoff Reminder for Scheduled Matches */}
            {isScheduled && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMatchReminder(match.id);
                }}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isReminded
                    ? 'bg-amber-50 text-amber-700 border-amber-300'
                    : 'bg-slate-50 text-slate-400 hover:text-slate-600 border-slate-200'
                }`}
                title={isReminded ? 'Reminder Set' : 'Set Kickoff Reminder'}
              >
                <Bell className={`w-3.5 h-3.5 ${isReminded ? 'fill-current text-amber-500' : ''}`} />
              </button>
            )}

            {/* Share Card Modal Trigger */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShareModalOpen(true);
              }}
              className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 border border-slate-200 transition-colors"
              title="Share Match Card"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Teams and Scores */}
        <div className="space-y-2.5 py-1">
          {/* Home Team Row */}
          <div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <ClubCrest
                  name={match.homeTeam.name}
                  code={match.homeTeam.code}
                  crestUrl={match.homeTeam.crestUrl}
                  size="sm"
                />
                <span className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                  {match.homeTeam.name}
                </span>
              </div>
              <span className={`font-mono text-lg font-black tabular-nums transition-transform duration-300 ${
                isLive ? 'text-rose-600 scale-105' : 'text-slate-900'
              }`}>
                {isLive || isFinished ? (homeScore !== null && !isNaN(homeScore) ? homeScore : 0) : '—'}
              </span>
            </div>
            {/* Home Goalscorers */}
            {(isLive || isFinished) && goalEvents.filter((g) => g.isHomeTeam || g.teamId === match.homeTeam.id).length > 0 && (
              <div className="pl-9 pt-0.5 text-[11px] text-slate-500 font-medium flex items-center gap-1.5 truncate">
                <span className="text-amber-500 animate-bounce">⚽</span>
                <span className="truncate">
                  {goalEvents
                    .filter((g) => g.isHomeTeam || g.teamId === match.homeTeam.id)
                    .map((g) => `${g.playerName} ${g.minute}'`)
                    .join(', ')}
                </span>
              </div>
            )}
          </div>

          {/* Away Team Row */}
          <div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <ClubCrest
                  name={match.awayTeam.name}
                  code={match.awayTeam.code}
                  crestUrl={match.awayTeam.crestUrl}
                  size="sm"
                />
                <span className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                  {match.awayTeam.name}
                </span>
              </div>
              <span className={`font-mono text-lg font-black tabular-nums transition-transform duration-300 ${
                isLive ? 'text-rose-600 scale-105' : 'text-slate-900'
              }`}>
                {isLive || isFinished ? (awayScore !== null && !isNaN(awayScore) ? awayScore : 0) : '—'}
              </span>
            </div>
            {/* Away Goalscorers */}
            {(isLive || isFinished) && goalEvents.filter((g) => !g.isHomeTeam && g.teamId !== match.homeTeam.id).length > 0 && (
              <div className="pl-9 pt-0.5 text-[11px] text-slate-500 font-medium flex items-center gap-1.5 truncate">
                <span className="text-amber-500 animate-bounce">⚽</span>
                <span className="truncate">
                  {goalEvents
                    .filter((g) => !g.isHomeTeam && g.teamId !== match.homeTeam.id)
                    .map((g) => `${g.playerName} ${g.minute}'`)
                    .join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Match Headline & Actions: Watch & Tickets (Feature 29) */}
        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
          <span className="font-semibold text-slate-600 truncate">{matchStatusHeadline}</span>

          <div className="flex items-center gap-2 shrink-0">
            {/* Watch Highlights / Live Video button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateTo('match-centre', { matchId: match.id });
              }}
              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-2xs active:scale-98"
              title="Watch Official Match Highlights & Videos"
            >
              <Video className="w-3.5 h-3.5 text-rose-600" />
              <span>Watch</span>
            </button>

            {isScheduled && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setTicketModalOpen(true);
                }}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[#009270] text-[11px] font-black flex items-center gap-1.5 transition-all shadow-2xs hover:scale-[1.02] active:scale-98"
                title="Book Official Match Tickets"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>Buy Tickets</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <TicketModal
        match={match}
        isOpen={ticketModalOpen}
        onClose={() => setTicketModalOpen(false)}
      />

      <MatchShareModal
        match={match}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />
    </>
  );
};
