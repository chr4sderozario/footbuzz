/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Authoritative ESPN Official Scoreboard Provider Service
 * Direct client & server ESPN scoreboard fetching pipeline.
 */

import { Match, MatchStatus } from '../types/football.js';
import { HISTORICAL_VERIFIED_MATCHES } from '../data/historicalMatches.js';

export function isValidEspnMatch(m: any): boolean {
  if (!m) return false;
  const idStr = String(m.id || m.providerMatchId || '');
  const hasValidId = idStr.startsWith('espn-') || idStr.startsWith('match-hist-') || idStr.length >= 4;
  const hasHome = Boolean(m.homeTeam?.id && m.homeTeam?.name);
  const hasAway = Boolean(m.awayTeam?.id && m.awayTeam?.name);
  const hasKickoff = Boolean(m.date && m.time);
  const hasStatus = Boolean(m.status);
  const hasComp = Boolean(m.competitionName);

  return hasValidId && hasHome && hasAway && hasKickoff && hasStatus && hasComp;
}

export function normalizeSearchQuery(query: string): string {
  if (!query) return '';
  return query
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
    .replace(/\b(vs|v|versus|against|and|&)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function fetchEspnProviderMatches(dateStr: string, leagueSlug: string = 'all'): Promise<Match[]> {
  const dateCompact = dateStr.replace(/-/g, '');
  const matches: Match[] = [];
  const seenMatchIds = new Set<string>();

  try {
    const slugPath = leagueSlug && leagueSlug !== 'all' ? leagueSlug : 'all';
    const espnUrl = `https://site.api.espn.com/apis/site/v2/sports/soccer/${slugPath}/scoreboard?dates=${dateCompact}`;
    const res = await fetch(espnUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (FootBuzz Football Platform)',
        Accept: 'application/json',
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.events)) {
        for (const ev of data.events) {
          if (!ev.id || !ev.competitions || !ev.competitions[0]) continue;
          const comp = ev.competitions[0];
          const competitors = comp.competitors || [];
          if (competitors.length < 2) continue;

          const homeComp = competitors.find((c: any) => c.homeAway === 'home') || competitors[0];
          const awayComp = competitors.find((c: any) => c.homeAway === 'away') || competitors[1];

          if (!homeComp?.team?.id || !awayComp?.team?.id) continue;

          const providerMatchId = String(ev.id);
          const fullId = `espn-${providerMatchId}`;
          if (seenMatchIds.has(fullId)) continue;
          seenMatchIds.add(fullId);

          const state = comp.status?.type?.state;
          const statusName = comp.status?.type?.name || '';
          const isLive = state === 'in' || statusName.includes('IN_PROGRESS') || statusName.includes('HALFTIME');
          const isFinished = state === 'post' || statusName.includes('FINAL');
          const isPostponed = statusName.includes('POSTPONED') || statusName.includes('SUSPENDED');
          const isCancelled = statusName.includes('CANCEL');

          let status: MatchStatus = 'SCHEDULED';
          if (isLive) {
            status = statusName.includes('HALFTIME') ? 'HT' : 'LIVE';
          } else if (isFinished) {
            status = 'FINISHED';
          } else if (isPostponed) {
            status = 'POSTPONED';
          } else if (isCancelled) {
            status = 'CANCELLED';
          }

          const homeScoreNum = homeComp.score !== undefined && homeComp.score !== null ? parseInt(homeComp.score, 10) : null;
          const awayScoreNum = awayComp.score !== undefined && awayComp.score !== null ? parseInt(awayComp.score, 10) : null;

          const homeScore = isLive || isFinished ? (isNaN(homeScoreNum!) ? 0 : homeScoreNum) : null;
          const awayScore = isLive || isFinished ? (isNaN(awayScoreNum!) ? 0 : awayScoreNum) : null;

          const clockDisplay = comp.status?.displayClock || '';
          const parsedMinute = parseInt(clockDisplay, 10);
          const minute = isLive ? (isNaN(parsedMinute) ? (comp.status?.period === 1 ? 30 : 70) : parsedMinute) : undefined;

          const eventDateObj = new Date(ev.date || dateStr);
          const eventDateStr = !isNaN(eventDateObj.getTime())
            ? eventDateObj.toISOString().split('T')[0]
            : dateStr;
          const eventTimeStr = !isNaN(eventDateObj.getTime())
            ? eventDateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
            : '19:00';

          const leagueName = ev.league?.name || comp.league?.name || 'Football League';
          const leagueCode = ev.league?.slug || ev.league?.id || 'soccer-league';

          matches.push({
            id: fullId,
            providerMatchId,
            competitionId: `comp-${leagueCode}`,
            competitionName: leagueName,
            competitionCategory: 'league',
            competitionEmblem: ev.league?.logos?.[0]?.href || undefined,
            season: String(ev.season?.year || new Date().getFullYear()),
            round: comp.round ? `Round ${comp.round}` : undefined,
            date: eventDateStr,
            time: eventTimeStr,
            timezone: 'Local',
            status,
            minute,
            homeTeam: {
              id: `team-${homeComp.team.id}`,
              name: homeComp.team.displayName || homeComp.team.name,
              shortName: homeComp.team.shortDisplayName || homeComp.team.name,
              code: homeComp.team.abbreviation || homeComp.team.name?.substring(0, 3).toUpperCase(),
              crestUrl: homeComp.team.logo || undefined,
              country: homeComp.team.location || '',
            },
            awayTeam: {
              id: `team-${awayComp.team.id}`,
              name: awayComp.team.displayName || awayComp.team.name,
              shortName: awayComp.team.shortDisplayName || awayComp.team.name,
              code: awayComp.team.abbreviation || awayComp.team.name?.substring(0, 3).toUpperCase(),
              crestUrl: awayComp.team.logo || undefined,
              country: awayComp.team.location || '',
            },
            score: {
              home: homeScore,
              away: awayScore,
            },
            venue: comp.venue?.fullName || 'Stadium',
            city: comp.venue?.address?.city || '',
            referee: comp.officials?.[0]?.displayName || undefined,
            attendance: comp.attendance || undefined,
            events: [],
            ticketInfo: {
              available: false,
              providerName: 'Official Ticketing',
              ticketUrl: '',
              officialOrAuthorized: true,
            },
          });
        }
      }
    }
  } catch (err) {
    console.error('ESPN Provider Fetch Error:', err);
  }

  return matches;
}

export async function fetchEspnMultiLeagueMatches(dateStr: string): Promise<Match[]> {
  const leagueSlugs = ['all', 'eng.1', 'esp.1', 'uefa.champions', 'ind.1', 'ger.1', 'ita.1', 'fra.1', 'fifa.friendly'];
  const results = await Promise.all(leagueSlugs.map((slug) => fetchEspnProviderMatches(dateStr, slug)));

  const pool = new Map<string, Match>();
  for (const list of results) {
    for (const m of list) {
      if (isValidEspnMatch(m)) {
        pool.set(m.id, m);
      }
    }
  }

  return Array.from(pool.values());
}

export async function searchVerifiedMatches(rawQuery: string): Promise<{ matches: Match[]; teams: any[] }> {
  const query = rawQuery.trim();
  const normalized = normalizeSearchQuery(query);

  if (!normalized) {
    return { matches: [], teams: [] };
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const liveMatches = await fetchEspnMultiLeagueMatches(todayStr);

  const pool = new Map<string, Match>();
  for (const m of HISTORICAL_VERIFIED_MATCHES) {
    if (isValidEspnMatch(m)) pool.set(m.id, m);
  }
  for (const m of liveMatches) {
    if (isValidEspnMatch(m)) pool.set(m.id, m);
  }

  const allMatches = Array.from(pool.values());
  const tokens = normalized.split(' ').filter(Boolean);
  const matchedMatches: Match[] = [];
  const matchedTeamsMap = new Map<string, any>();

  for (const match of allMatches) {
    const homeNorm = normalizeSearchQuery(`${match.homeTeam.name} ${match.homeTeam.shortName || ''} ${match.homeTeam.code || ''}`);
    const awayNorm = normalizeSearchQuery(`${match.awayTeam.name} ${match.awayTeam.shortName || ''} ${match.awayTeam.code || ''}`);
    const compNorm = normalizeSearchQuery(match.competitionName || '');
    const venueNorm = normalizeSearchQuery(`${match.venue || ''} ${match.city || ''}`);
    const coachNorm = normalizeSearchQuery(`${match.lineups?.home?.coach || ''} ${match.lineups?.away?.coach || ''}`);
    const fullText = `${homeNorm} ${awayNorm} ${compNorm} ${venueNorm} ${coachNorm}`;

    const allTokensMatch = tokens.every((tok) => fullText.includes(tok));
    const pairMatch =
      tokens.length >= 2 &&
      ((tokens.some((t) => homeNorm.includes(t)) && tokens.some((t) => awayNorm.includes(t))) ||
        (tokens.some((t) => awayNorm.includes(t)) && tokens.some((t) => homeNorm.includes(t))));

    if (allTokensMatch || pairMatch || fullText.includes(normalized)) {
      matchedMatches.push(match);
    }

    if (tokens.some((t) => homeNorm.includes(t))) matchedTeamsMap.set(match.homeTeam.id, match.homeTeam);
    if (tokens.some((t) => awayNorm.includes(t))) matchedTeamsMap.set(match.awayTeam.id, match.awayTeam);
  }

  return {
    matches: matchedMatches,
    teams: Array.from(matchedTeamsMap.values()),
  };
}
