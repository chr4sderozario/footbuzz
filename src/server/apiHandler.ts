/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Real Football Data API Handler
 * Authoritative provider pipeline querying live sports data with zero fake matches.
 */

import { Match, MatchStatus } from '../types/football';

// In-memory cache for live matches (20-second TTL)
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 20 * 1000;

function getCached(key: string) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }
  return null;
}

function setCache(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() });
}

function levenshtein(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix = Array.from({ length: bn + 1 }, () => new Array(an + 1).fill(0));
  for (let i = 0; i <= an; i++) matrix[0][i] = i;
  for (let j = 0; j <= bn; j++) matrix[j][0] = j;
  for (let j = 1; j <= bn; j++) {
    for (let i = 1; i <= an; i++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[j][i] = matrix[j - 1][i - 1];
      } else {
        matrix[j][i] = Math.min(
          matrix[j - 1][i - 1] + 1,
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1
        );
      }
    }
  }
  return matrix[bn][an];
}

export function normalizeQuery(query: string): string {
  if (!query) return '';
  return query
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
    .replace(/\b(vs|v|versus|against|and|&)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Fetch and validate real matches from official sports data providers.
 */
export async function fetchRealProviderMatches(dateStr: string): Promise<Match[]> {
  const cacheKey = `matches_${dateStr}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const dateCompact = dateStr.replace(/-/g, '');
  const matches: Match[] = [];
  const seenMatchIds = new Set<string>();

  try {
    // 1. If FOOTBALL_DATA_API_KEY is configured
    if (process.env.FOOTBALL_DATA_API_KEY) {
      try {
        const fdRes = await fetch(
          `https://api.football-data.org/v4/matches?dateFrom=${dateStr}&dateTo=${dateStr}`,
          {
            headers: {
              'X-Auth-Token': process.env.FOOTBALL_DATA_API_KEY,
            },
          }
        );
        if (fdRes.ok) {
          const fdData: any = await fdRes.json();
          if (Array.isArray(fdData.matches)) {
            for (const m of fdData.matches) {
              if (!m.id || !m.homeTeam?.id || !m.awayTeam?.id) continue;
              const providerId = `fd-${m.id}`;
              if (seenMatchIds.has(providerId)) continue;
              seenMatchIds.add(providerId);

              const isLive = m.status === 'IN_PLAY' || m.status === 'PAUSED';
              const isFinished = m.status === 'FINISHED';
              const isScheduled = m.status === 'TIMED' || m.status === 'SCHEDULED';
              const isPostponed = m.status === 'POSTPONED' || m.status === 'SUSPENDED';
              const isCancelled = m.status === 'CANCELLED';

              let status: MatchStatus = 'SCHEDULED';
              if (isLive) status = m.status === 'PAUSED' ? 'HT' : 'LIVE';
              else if (isFinished) status = 'FINISHED';
              else if (isPostponed) status = 'POSTPONED';
              else if (isCancelled) status = 'CANCELLED';

              const matchDate = m.utcDate ? m.utcDate.split('T')[0] : dateStr;
              const matchTime = m.utcDate ? m.utcDate.split('T')[1]?.substring(0, 5) || '19:00' : '19:00';

              matches.push({
                id: providerId,
                providerMatchId: String(m.id),
                competitionId: m.competition?.code?.toLowerCase() || 'comp-general',
                competitionName: m.competition?.name || 'Football League',
                competitionCategory: 'league',
                competitionEmblem: m.competition?.emblem || undefined,
                season: String(m.season?.startDate?.split('-')[0] || new Date().getFullYear()),
                round: m.matchday ? `Matchday ${m.matchday}` : undefined,
                date: matchDate,
                time: matchTime,
                timezone: 'UTC',
                status,
                minute: isLive ? m.minute || 45 : undefined,
                homeTeam: {
                  id: `team-${m.homeTeam.id}`,
                  name: m.homeTeam.name,
                  shortName: m.homeTeam.shortName || m.homeTeam.name,
                  code: m.homeTeam.tla || m.homeTeam.name.substring(0, 3).toUpperCase(),
                  crestUrl: m.homeTeam.crest || undefined,
                  country: m.area?.name || '',
                },
                awayTeam: {
                  id: `team-${m.awayTeam.id}`,
                  name: m.awayTeam.name,
                  shortName: m.awayTeam.shortName || m.awayTeam.name,
                  code: m.awayTeam.tla || m.awayTeam.name.substring(0, 3).toUpperCase(),
                  crestUrl: m.awayTeam.crest || undefined,
                  country: m.area?.name || '',
                },
                score: {
                  home: isScheduled || isPostponed || isCancelled ? null : m.score?.fullTime?.home ?? 0,
                  away: isScheduled || isPostponed || isCancelled ? null : m.score?.fullTime?.away ?? 0,
                  htHome: m.score?.halfTime?.home ?? undefined,
                  htAway: m.score?.halfTime?.away ?? undefined,
                },
                venue: m.venue || 'Stadium',
                city: m.area?.name || '',
                referee: m.referees?.[0]?.name || undefined,
                events: [],
                ticketInfo: { available: false, providerName: '', ticketUrl: '', officialOrAuthorized: false },
              });
            }
          }
        }
      } catch (e) {
        console.error('Football data org fetch error:', e);
      }
    }

    // 2. Fetch official sports scoreboard feed
    const espnUrl = `https://site.api.espn.com/apis/site/v2/sports/soccer/all/scoreboard?dates=${dateCompact}`;
    const res = await fetch(espnUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (FootBuzz Football Platform)',
        Accept: 'application/json',
      },
    });

    if (res.ok) {
      const data: any = await res.json();
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
          const leagueSlug = ev.league?.slug || ev.league?.id || 'soccer-league';

          const eventsList: any[] = [];
          if (Array.isArray(comp.details)) {
            comp.details.forEach((det: any, idx: number) => {
              if (det.type?.text?.toLowerCase().includes('goal') || det.scoringPlay) {
                eventsList.push({
                  id: `ev-${providerMatchId}-${idx}`,
                  minute: parseInt(det.clock?.displayValue, 10) || 0,
                  type: 'GOAL',
                  teamId: det.team?.id ? `team-${det.team.id}` : `team-${homeComp.team.id}`,
                  teamName: det.team?.displayName || homeComp.team.displayName,
                  playerId: det.athletesInvolved?.[0]?.id || `p-${idx}`,
                  playerName: det.athletesInvolved?.[0]?.displayName || det.participants?.[0]?.athlete?.displayName || 'Goal',
                  detail: det.type?.text || 'Goal',
                  isHomeTeam: det.team?.id === homeComp.team.id,
                });
              }
            });
          }

          matches.push({
            id: fullId,
            providerMatchId,
            competitionId: `comp-${leagueSlug}`,
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
              code: homeComp.team.abbreviation || homeComp.team.name.substring(0, 3).toUpperCase(),
              crestUrl: homeComp.team.logo || undefined,
              country: homeComp.team.location || '',
            },
            awayTeam: {
              id: `team-${awayComp.team.id}`,
              name: awayComp.team.displayName || awayComp.team.name,
              shortName: awayComp.team.shortDisplayName || awayComp.team.name,
              code: awayComp.team.abbreviation || awayComp.team.name.substring(0, 3).toUpperCase(),
              crestUrl: awayComp.team.logo || undefined,
              country: awayComp.team.location || '',
            },
            score: {
              home: homeScore,
              away: awayScore,
            },
            venue: comp.venue?.fullName || 'Stadium',
            city: comp.venue?.address?.city || '',
            attendance: comp.attendance || undefined,
            events: eventsList,
            postponedReason: isPostponed ? comp.notes?.[0]?.headline || 'Match Postponed' : undefined,
            ticketInfo: { available: false, providerName: '', ticketUrl: '', officialOrAuthorized: false },
          });
        }
      }
    }
  } catch (error) {
    console.error('Real provider matches fetch error:', error);
  }

  setCache(cacheKey, matches);
  return matches;
}

export async function fetchRealMatchSummary(providerMatchId: string): Promise<any> {
  const cleanId = providerMatchId.replace(/^(espn-|fd-)/, '');
  const cacheKey = `match_summary_${cleanId}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const summaryUrl = `https://site.api.espn.com/apis/site/v2/sports/soccer/all/summary?event=${cleanId}`;
    const res = await fetch(summaryUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (FootBuzz Football Platform)',
        Accept: 'application/json',
      },
    });

    if (res.ok) {
      const data = await res.json();
      setCache(cacheKey, data);
      return data;
    }
  } catch (err) {
    console.error('Real provider summary error:', err);
  }
  return null;
}
