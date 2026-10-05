/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Authoritative ESPN Official Scoreboard Provider Service
 * Multi-endpoint provider fetching, canonical event resolution, and audit tracing.
 */

import { Match, MatchStatus } from '../types/football.js';
import { isNationalTeam } from '../utils/flagUtils.js';

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

/**
 * Parses raw ESPN event object into a canonical validated FootBuzz Match model.
 * Trace: RAW PROVIDER EVENT -> RAW SCORE -> NORMALIZED SCORE -> FOOTBUZZ MATCH
 */
export function extractScore(rawScore: any): number | null {
  if (rawScore === undefined || rawScore === null) return null;
  if (typeof rawScore === 'object') {
    const val = rawScore.value ?? rawScore.displayValue;
    if (val !== undefined && val !== null) {
      const parsed = parseInt(String(val), 10);
      return isNaN(parsed) ? null : parsed;
    }
    return null;
  }
  const parsed = parseInt(String(rawScore), 10);
  return isNaN(parsed) ? null : parsed;
}

export function parseEspnEvent(ev: any, fallbackDateStr?: string): Match | null {
  if (!ev || !ev.id) return null;
  const comp = ev.competitions?.[0] || ev;
  const competitors = comp.competitors || [];
  if (competitors.length < 2) return null;

  const homeComp = competitors.find((c: any) => c.homeAway === 'home') || competitors[0];
  const awayComp = competitors.find((c: any) => c.homeAway === 'away') || competitors[1];

  if (!homeComp?.team?.id || !awayComp?.team?.id) return null;

  const providerMatchId = String(ev.id);
  const fullId = `espn-${providerMatchId}`;

  const state = comp.status?.type?.state;
  const statusName = comp.status?.type?.name || comp.status?.type?.description || '';
  const isLive = state === 'in' || statusName.includes('IN_PROGRESS') || statusName.includes('HALFTIME') || statusName.includes('First Half') || statusName.includes('Second Half');
  const isFinished = state === 'post' || statusName.includes('FINAL') || statusName.includes('Full Time') || comp.status?.type?.completed === true;
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

  // Raw Provider Final Scores
  const homeScoreRaw = extractScore(homeComp.score);
  const awayScoreRaw = extractScore(awayComp.score);

  const homeScore = isLive || isFinished ? (homeScoreRaw !== null && !isNaN(homeScoreRaw) ? homeScoreRaw : 0) : null;
  const awayScore = isLive || isFinished ? (awayScoreRaw !== null && !isNaN(awayScoreRaw) ? awayScoreRaw : 0) : null;

  const clockDisplay = comp.status?.displayClock || '';
  const parsedMinute = parseInt(clockDisplay, 10);
  const minute = isLive ? (isNaN(parsedMinute) ? (comp.status?.period === 1 ? 30 : 70) : parsedMinute) : undefined;

  const rawDateStr = ev.date || comp.date || fallbackDateStr || new Date().toISOString();
  const eventDateObj = new Date(rawDateStr);
  const eventDateStr = !isNaN(eventDateObj.getTime())
    ? eventDateObj.toISOString().split('T')[0]
    : (fallbackDateStr || new Date().toISOString().split('T')[0]);
  const eventTimeStr = !isNaN(eventDateObj.getTime())
    ? eventDateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
    : '19:00';

  const leagueName = ev.league?.name || comp.league?.name || ev.season?.displayName || 'International Friendly';
  const leagueCode = ev.league?.slug || ev.league?.id || 'soccer-league';

  // Parse goal events, cards, and substitutions
  const events: any[] = [];
  const rawDetails = comp.details || ev.details || ev.scoringPlays || comp.scoringPlays || ev.keyEvents || [];
  if (Array.isArray(rawDetails)) {
    for (const d of rawDetails) {
      const isGoal = d.type?.text === 'Goal' || d.type?.id === '70' || d.scoringPlay === true || d.type?.name?.includes('Goal');
      const isCard = d.type?.text?.includes('Card') || d.type?.name?.includes('Card');
      const isYellow = isCard && (d.type?.text?.includes('Yellow') || d.type?.id === '51');
      const isRed = isCard && (d.type?.text?.includes('Red') || d.type?.id === '52');
      const isSub = d.type?.text === 'Substitution' || d.type?.id === '11';

      const teamId = String(d.team?.id || '');
      const athlete = d.athletesInvolved?.[0] || d.athlete || {};
      const subIn = d.athletesInvolved?.[0] || {};
      const subOut = d.athletesInvolved?.[1] || {};

      let type: any = 'GOAL';
      if (isYellow) type = 'YELLOW_CARD';
      else if (isRed) type = 'RED_CARD';
      else if (isSub) type = 'SUBSTITUTION';
      else if (isGoal) type = 'GOAL';
      else continue;

      const rawClock = d.clock?.displayValue || d.clock?.value || d.time?.displayValue || '0';
      const eventMin = parseInt(String(rawClock).replace("'", ''), 10) || 0;

      events.push({
        id: `ev-${d.id || eventMin || Math.random()}`,
        minute: eventMin,
        type,
        teamId: `team-${teamId}`,
        teamName: teamId === String(homeComp.team.id) ? homeComp.team.displayName : awayComp.team.displayName,
        playerId: athlete.id ? `p-${athlete.id}` : undefined,
        playerName: athlete.displayName || athlete.shortName || 'Player',
        playerInName: isSub ? subIn.displayName || subIn.shortName : undefined,
        playerOutName: isSub ? subOut.displayName || subOut.shortName : undefined,
        detail: d.text || d.description || d.type?.text,
        isHomeTeam: teamId === String(homeComp.team.id),
      });
    }
  }

  // Parse Boxscore Statistics (possession, shots, fouls, corners, cards, offsides, saves)
  let statistics: any = undefined;
  const boxTeams = ev.boxscore?.teams || comp.boxscore?.teams;
  if (Array.isArray(boxTeams) && boxTeams.length >= 2) {
    const homeBox = boxTeams.find((b: any) => String(b.team?.id) === String(homeComp.team.id)) || boxTeams[0];
    const awayBox = boxTeams.find((b: any) => String(b.team?.id) === String(awayComp.team.id)) || boxTeams[1];

    const getStat = (box: any, name: string): number => {
      const s = (box.statistics || []).find((item: any) => item.name === name || item.label?.toLowerCase() === name.toLowerCase());
      if (!s) return 0;
      const num = parseFloat(String(s.displayValue || s.value || '0').replace('%', ''));
      return isNaN(num) ? 0 : num;
    };

    const homePoss = getStat(homeBox, 'possessionPct');
    const awayPoss = getStat(awayBox, 'possessionPct');

    statistics = {
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
  }

  // Parse Lineups from Rosters
  let lineups: any = undefined;
  const rawRosters = ev.rosters || comp.rosters;
  if (Array.isArray(rawRosters) && rawRosters.length >= 2) {
    const homeRoster = rawRosters.find((r: any) => String(r.team?.id) === String(homeComp.team.id)) || rawRosters[0];
    const awayRoster = rawRosters.find((r: any) => String(r.team?.id) === String(awayComp.team.id)) || rawRosters[1];

    const parseLineup = (roster: any, isHome: boolean) => {
      const starting = (roster.roster || []).filter((p: any) => p.starter === true);
      const bench = (roster.roster || []).filter((p: any) => p.starter === false);
      const coach = roster.coach?.[0]?.displayName || (isHome ? 'Manager' : 'Head Coach');
      const formatPlayer = (p: any) => ({
        playerId: `p-${p.athlete?.id || Math.random()}`,
        name: p.athlete?.displayName || p.athlete?.shortName || 'Player',
        shirtNumber: parseInt(String(p.jersey || p.athlete?.jersey || '0'), 10) || 1,
        position: p.position?.abbreviation || p.athlete?.position?.abbreviation || 'MF',
        gridPosition: { x: 50, y: 50 },
        isCaptain: p.captain || false,
      });

      return {
        formation: roster.formation || '4-3-3',
        coach,
        startingXI: starting.map(formatPlayer),
        bench: bench.map(formatPlayer),
      };
    };

    lineups = {
      home: parseLineup(homeRoster, true),
      away: parseLineup(awayRoster, false),
    };
  }

  const homeTeamName = homeComp.team.displayName || homeComp.team.name;
  const awayTeamName = awayComp.team.displayName || awayComp.team.name;
  const homeIsNational = isNationalTeam(homeTeamName, homeComp.team.location, homeComp.team.isNational);
  const awayIsNational = isNationalTeam(awayTeamName, awayComp.team.location, awayComp.team.isNational);

  return {
    id: fullId,
    providerMatchId,
    competitionId: `comp-${leagueCode}`,
    competitionName: leagueName,
    competitionCategory: homeIsNational || awayIsNational ? 'international' : 'league',
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
      name: homeTeamName,
      shortName: homeComp.team.shortDisplayName || homeComp.team.name,
      code: homeComp.team.abbreviation || homeComp.team.name?.substring(0, 3).toUpperCase(),
      crestUrl: homeComp.team.logo || undefined,
      country: homeComp.team.location || '',
      isNational: homeIsNational,
    },
    awayTeam: {
      id: `team-${awayComp.team.id}`,
      name: awayTeamName,
      shortName: awayComp.team.shortDisplayName || awayComp.team.name,
      code: awayComp.team.abbreviation || awayComp.team.name?.substring(0, 3).toUpperCase(),
      crestUrl: awayComp.team.logo || undefined,
      country: awayComp.team.location || '',
      isNational: awayIsNational,
    },
    score: {
      home: homeScore,
      away: awayScore,
    },
    venue: comp.venue?.fullName || comp.venue?.displayName || 'Stadium',
    city: comp.venue?.address?.city || '',
    referee: comp.officials?.[0]?.displayName || undefined,
    attendance: comp.attendance || undefined,
    events,
    statistics,
    lineups,
    ticketInfo: {
      available: false,
      providerName: 'Official Ticketing',
      ticketUrl: '',
      officialOrAuthorized: true,
    },
  };
}

/**
 * Fetches real ESPN scoreboard events for a specific date and league.
 */
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
          const match = parseEspnEvent(ev, dateStr);
          if (match && !seenMatchIds.has(match.id)) {
            seenMatchIds.add(match.id);
            matches.push(match);
          }
        }
      }
    }
  } catch (err) {
    console.error('ESPN Provider Fetch Error:', err);
  }

  return matches;
}

/**
 * Multi-league and multi-date scoreboard indexer.
 * Fetches today, yesterday, and key leagues to cover recent and live events.
 */
export async function fetchEspnMultiLeagueMatches(dateStr: string): Promise<Match[]> {
  const targetDate = dateStr || new Date().toISOString().split('T')[0];
  const dateObj = new Date(targetDate);
  const yesterdayObj = new Date(dateObj);
  yesterdayObj.setDate(yesterdayObj.getDate() - 1);
  const yesterdayStr = yesterdayObj.toISOString().split('T')[0];

  const leagueSlugs = ['all', 'eng.1', 'esp.1', 'uefa.champions', 'ind.1', 'ger.1', 'ita.1', 'fra.1', 'fifa.friendly'];

  const [todayResults, yesterdayResults] = await Promise.all([
    Promise.all(leagueSlugs.map((slug) => fetchEspnProviderMatches(targetDate, slug))),
    Promise.all(['all', 'fifa.friendly', 'ind.1'].map((slug) => fetchEspnProviderMatches(yesterdayStr, slug))),
  ]);

  const pool = new Map<string, Match>();
  for (const list of [...todayResults, ...yesterdayResults]) {
    for (const m of list) {
      if (isValidEspnMatch(m)) {
        pool.set(m.id, m);
      }
    }
  }

  return Array.from(pool.values());
}

/**
 * Fetches canonical match details directly from the provider's exact match endpoint.
 * URL: https://site.api.espn.com/apis/site/v2/sports/soccer/all/summary?event={id}
 */
export async function fetchEspnEventSummary(eventId: string): Promise<Match | null> {
  const numericId = eventId.replace(/^(espn-|fd-)/, '');
  try {
    const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/all/summary?event=${numericId}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (FootBuzz Football Platform)',
        Accept: 'application/json',
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.header) {
        return parseEspnEvent({
          id: numericId,
          ...data.header,
          boxscore: data.boxscore,
          rosters: data.rosters,
          details: data.header?.competitions?.[0]?.details || data.keyEvents || data.plays,
        });
      }
    }
  } catch (err) {
    console.error(`ESPN Event Summary Fetch Error for ${eventId}:`, err);
  }

  return null;
}

/**
 * Known prominent clubs and national teams for instant, resilient ID resolution
 */
const KNOWN_FOOTBALL_ENTITIES: Array<{ id: string; name: string; aliases: string[]; country: string; isNational: boolean; logo?: string }> = [
  // National Teams
  { id: '4385', name: 'India', aliases: ['india', 'indian national team', 'blue tigers'], country: 'India', isNational: true, logo: 'https://flagcdn.com/w80/in.png' },
  { id: '205', name: 'Brazil', aliases: ['brazil', 'brasil', 'selecao'], country: 'Brazil', isNational: true, logo: 'https://flagcdn.com/w80/br.png' },
  { id: '202', name: 'Argentina', aliases: ['argentina', 'albiceleste'], country: 'Argentina', isNational: true, logo: 'https://flagcdn.com/w80/ar.png' },
  { id: '478', name: 'France', aliases: ['france', 'les bleus'], country: 'France', isNational: true, logo: 'https://flagcdn.com/w80/fr.png' },
  { id: '481', name: 'Germany', aliases: ['germany', 'deutschland'], country: 'Germany', isNational: true, logo: 'https://flagcdn.com/w80/de.png' },
  { id: '474', name: 'England', aliases: ['england', 'three lions'], country: 'England', isNational: true, logo: 'https://flagcdn.com/w80/gb-eng.png' },
  { id: '479', name: 'Spain', aliases: ['spain', 'la roja'], country: 'Spain', isNational: true, logo: 'https://flagcdn.com/w80/es.png' },
  { id: '480', name: 'Italy', aliases: ['italy', 'azzurri'], country: 'Italy', isNational: true, logo: 'https://flagcdn.com/w80/it.png' },
  { id: '477', name: 'Portugal', aliases: ['portugal'], country: 'Portugal', isNational: true, logo: 'https://flagcdn.com/w80/pt.png' },
  { id: '482', name: 'United States', aliases: ['usa', 'usmnt', 'united states'], country: 'United States', isNational: true, logo: 'https://flagcdn.com/w80/us.png' },

  // Indian Clubs
  { id: '20774', name: 'Mohun Bagan Super Giant', aliases: ['mohun bagan', 'mbsg', 'mohun bagan sg'], country: 'India', isNational: false, logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/20774.png' },
  { id: '8897', name: 'SC East Bengal', aliases: ['east bengal', 'sc east bengal'], country: 'India', isNational: false, logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/8897.png' },
  { id: '18851', name: 'Bengaluru FC', aliases: ['bengaluru', 'bengaluru fc', 'bfc'], country: 'India', isNational: false, logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/18851.png' },
  { id: '17997', name: 'Kerala Blasters FC', aliases: ['kerala blasters', 'kerala', 'kbfc'], country: 'India', isNational: false, logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/17997.png' },
  { id: '18002', name: 'Mumbai City FC', aliases: ['mumbai city', 'mumbai city fc'], country: 'India', isNational: false, logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/18002.png' },
  { id: '18000', name: 'Chennaiyin FC', aliases: ['chennaiyin', 'chennaiyin fc'], country: 'India', isNational: false, logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/18000.png' },
  { id: '18003', name: 'FC Goa', aliases: ['fc goa', 'goa'], country: 'India', isNational: false, logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/18003.png' },

  // Major European & Global Clubs
  { id: '86', name: 'Real Madrid', aliases: ['real madrid', 'madrid', 'los blancos'], country: 'Spain', isNational: false, logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/86.png' },
  { id: '83', name: 'Barcelona', aliases: ['barcelona', 'barca', 'fc barcelona'], country: 'Spain', isNational: false, logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/83.png' },
  { id: '359', name: 'Arsenal', aliases: ['arsenal', 'the gunners'], country: 'England', isNational: false, logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/359.png' },
  { id: '363', name: 'Chelsea', aliases: ['chelsea', 'the blues'], country: 'England', isNational: false, logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/363.png' },
  { id: '364', name: 'Liverpool', aliases: ['liverpool', 'the reds'], country: 'England', isNational: false, logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/364.png' },
  { id: '360', name: 'Manchester United', aliases: ['manchester united', 'man utd', 'man united'], country: 'England', isNational: false, logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/360.png' },
  { id: '382', name: 'Manchester City', aliases: ['manchester city', 'man city'], country: 'England', isNational: false, logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/382.png' },
  { id: '132', name: 'Bayern Munich', aliases: ['bayern munich', 'bayern', 'fc bayern'], country: 'Germany', isNational: false, logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/132.png' },
  { id: '160', name: 'Paris Saint-Germain', aliases: ['psg', 'paris saint germain', 'paris sg'], country: 'France', isNational: false, logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/160.png' },
  { id: '111', name: 'Juventus', aliases: ['juventus', 'juve'], country: 'Italy', isNational: false, logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/111.png' },
  { id: '110', name: 'Inter Milan', aliases: ['inter milan', 'inter'], country: 'Italy', isNational: false, logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/110.png' },
  { id: '103', name: 'AC Milan', aliases: ['ac milan', 'milan'], country: 'Italy', isNational: false, logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/103.png' },
];

/**
 * Fetches real schedule events for a specific team and optional season.
 */
export async function fetchEspnTeamSchedule(teamId: string, season?: string | number): Promise<Match[]> {
  const cleanId = String(teamId).replace(/^(team-|espn-)/, '');
  const seasonParam = season ? `?season=${season}` : '';
  const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/all/teams/${cleanId}/schedule${seasonParam}`;
  const matches: Match[] = [];

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (FootBuzz Football Platform)',
        Accept: 'application/json',
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.events)) {
        for (const ev of data.events) {
          const match = parseEspnEvent(ev);
          if (match && isValidEspnMatch(match)) {
            matches.push(match);
          }
        }
      }
    }
  } catch (err) {
    console.error(`ESPN Team Schedule Fetch Error for ${teamId} (season: ${season}):`, err);
  }

  return matches;
}

/**
 * Searches ESPN for soccer teams
 */
export async function searchEspnTeams(query: string): Promise<any[]> {
  const norm = normalizeSearchQuery(query);
  const found: any[] = [];
  const seenIds = new Set<string>();

  // 1. Check known entities
  for (const ent of KNOWN_FOOTBALL_ENTITIES) {
    if (ent.aliases.some((a) => norm.includes(a) || a.includes(norm))) {
      seenIds.add(ent.id);
      found.push({
        id: `team-${ent.id}`,
        numericId: ent.id,
        name: ent.name,
        shortName: ent.name,
        code: ent.name.substring(0, 3).toUpperCase(),
        crestUrl: ent.logo,
        country: ent.country,
        isNational: ent.isNational,
      });
    }
  }

  // 2. Query ESPN Official Search API
  try {
    const searchUrl = `https://site.web.api.espn.com/apis/search/v2?query=${encodeURIComponent(query)}&type=team&sport=soccer`;
    const res = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (FootBuzz Football Platform)',
        Accept: 'application/json',
      },
    });

    if (res.ok) {
      const data = await res.json();
      const items = data.results?.[0]?.contents || [];
      for (const item of items) {
        let numId = '';
        if (item.uid && item.uid.includes('~t:')) {
          numId = item.uid.split('~t:')[1];
        } else if (item.image?.default) {
          const m = item.image.default.match(/\/(\d+)\.png/);
          if (m) numId = m[1];
        } else if (item.id && /^\d+$/.test(item.id)) {
          numId = item.id;
        }

        if (numId && !seenIds.has(numId)) {
          seenIds.add(numId);
          const isNat = isNationalTeam(item.displayName, item.subtitle);
          found.push({
            id: `team-${numId}`,
            numericId: numId,
            name: item.displayName,
            shortName: item.displayName,
            code: item.displayName.substring(0, 3).toUpperCase(),
            crestUrl: item.image?.default,
            country: item.subtitle || '',
            isNational: isNat,
          });
        }
      }
    }
  } catch (err) {
    console.error('ESPN Team Search Error:', err);
  }

  return found;
}

/**
 * Searches ESPN for soccer players
 */
export async function searchEspnPlayers(query: string): Promise<any[]> {
  const players: any[] = [];
  try {
    const url = `https://site.web.api.espn.com/apis/search/v2?query=${encodeURIComponent(query)}&type=player&sport=soccer`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (FootBuzz Football Platform)',
        Accept: 'application/json',
      },
    });

    if (res.ok) {
      const data = await res.json();
      const items = data.results?.[0]?.contents || [];
      for (const p of items) {
        players.push({
          id: `player-${p.id}`,
          name: p.displayName,
          position: p.subtitle || 'Player',
          photoUrl: p.image?.default,
          currentTeamName: p.team?.displayName || 'Club',
        });
      }
    }
  } catch (err) {
    console.error('ESPN Player Search Error:', err);
  }
  return players;
}

/**
 * Comprehensive Match Search Engine
 * Searches real provider data across:
 * - Matchups (Team A vs Team B) across current and past/historic seasons
 * - Single club and national team schedules
 * - Competitions & tournament fixtures
 * - Players & direct event IDs
 * - Today's multi-league matches
 */
export async function searchVerifiedMatches(rawQuery: string): Promise<{
  matches: Match[];
  teams: any[];
  players?: any[];
  notice?: string;
}> {
  const query = rawQuery.trim();
  const normalized = normalizeSearchQuery(query);

  if (!normalized) {
    return { matches: [], teams: [] };
  }

  const matchedMatchesMap = new Map<string, Match>();
  const matchedTeamsMap = new Map<string, any>();
  let notice: string | undefined = undefined;

  // 1. Direct Event ID lookup (e.g. "401903233" or "704656")
  const idMatch = query.match(/\b(\d{6,10})\b/);
  if (idMatch) {
    const directMatch = await fetchEspnEventSummary(idMatch[1]);
    if (directMatch && isValidEspnMatch(directMatch)) {
      matchedMatchesMap.set(directMatch.id, directMatch);
      matchedTeamsMap.set(directMatch.homeTeam.id, directMatch.homeTeam);
      matchedTeamsMap.set(directMatch.awayTeam.id, directMatch.awayTeam);
      return {
        matches: [directMatch],
        teams: Array.from(matchedTeamsMap.values()),
      };
    }
  }

  // 2. Check for Durand Cup mention
  if (normalized.includes('durand')) {
    notice = 'Durand Cup is an Indian domestic tournament not currently syndicated in ESPN digital soccer telemetry feeds. Displaying verified Indian Super League and club fixtures below.';
  }

  // 3. Matchup Query Resolution (e.g. "Brazil vs India", "Arsenal vs Chelsea", "Real Madrid vs Barcelona")
  const vsPattern = /\b(vs|v|versus|-)\b/i;
  let teamParts: string[] = [];
  if (vsPattern.test(query)) {
    teamParts = query.split(vsPattern).map((p) => p.trim()).filter((p) => p && !/^(vs|v|versus|-)$/i.test(p));
  }

  if (teamParts.length >= 2) {
    const [teamASearch, teamBSearch] = await Promise.all([
      searchEspnTeams(teamParts[0]),
      searchEspnTeams(teamParts[1]),
    ]);

    const teamA = teamASearch[0];
    const teamB = teamBSearch[0];

    if (teamA) matchedTeamsMap.set(teamA.id, teamA);
    if (teamB) matchedTeamsMap.set(teamB.id, teamB);

    if (teamA && teamB) {
      // Query current schedule + historical seasons (2024, 2023, 2022) to discover all past/present encounters
      const seasonsToQuery = ['', '2024', '2023', '2022'];
      const schedulePromises = seasonsToQuery.map((s) => fetchEspnTeamSchedule(teamA.numericId, s));
      const scheduleResults = await Promise.all(schedulePromises);

      const targetBId = String(teamB.numericId);
      const targetBName = teamB.name.toLowerCase();

      for (const list of scheduleResults) {
        for (const m of list) {
          const homeNum = m.homeTeam.id.replace('team-', '');
          const awayNum = m.awayTeam.id.replace('team-', '');
          const homeMatchesB = homeNum === targetBId || m.homeTeam.name.toLowerCase().includes(targetBName);
          const awayMatchesB = awayNum === targetBId || m.awayTeam.name.toLowerCase().includes(targetBName);

          if (homeMatchesB || awayMatchesB) {
            matchedMatchesMap.set(m.id, m);
          }
        }
      }
    }
  }

  // 4. Single Team or Club Search (e.g. "Arsenal", "Real Madrid", "Brazil", "India", "Mohun Bagan")
  if (matchedMatchesMap.size === 0) {
    const teams = await searchEspnTeams(query);
    for (const t of teams.slice(0, 3)) {
      matchedTeamsMap.set(t.id, t);
    }

    if (teams.length > 0) {
      const primaryTeam = teams[0];
      // Fetch current season + previous season schedules for comprehensive past/present match coverage
      const [currentSeason, prevSeason] = await Promise.all([
        fetchEspnTeamSchedule(primaryTeam.numericId),
        fetchEspnTeamSchedule(primaryTeam.numericId, '2024'),
      ]);

      for (const m of [...currentSeason, ...prevSeason]) {
        if (isValidEspnMatch(m)) {
          matchedMatchesMap.set(m.id, m);
          matchedTeamsMap.set(m.homeTeam.id, m.homeTeam);
          matchedTeamsMap.set(m.awayTeam.id, m.awayTeam);
        }
      }
    }
  }

  // 5. Multi-League Scoreboard Query (Today & Yesterday)
  const todayStr = new Date().toISOString().split('T')[0];
  const liveMatches = await fetchEspnMultiLeagueMatches(todayStr);
  const tokens = normalized.split(' ').filter(Boolean);

  for (const match of liveMatches) {
    const homeNorm = normalizeSearchQuery(`${match.homeTeam.name} ${match.homeTeam.shortName || ''} ${match.homeTeam.code || ''}`);
    const awayNorm = normalizeSearchQuery(`${match.awayTeam.name} ${match.awayTeam.shortName || ''} ${match.awayTeam.code || ''}`);
    const compNorm = normalizeSearchQuery(match.competitionName || '');
    const fullText = `${homeNorm} ${awayNorm} ${compNorm}`;

    const matchesAll = tokens.every((tok) => fullText.includes(tok));
    const pairMatch =
      tokens.length >= 2 &&
      ((tokens.some((t) => homeNorm.includes(t)) && tokens.some((t) => awayNorm.includes(t))) ||
        (tokens.some((t) => awayNorm.includes(t)) && tokens.some((t) => homeNorm.includes(t))));

    if (matchesAll || pairMatch || fullText.includes(normalized)) {
      matchedMatchesMap.set(match.id, match);
      matchedTeamsMap.set(match.homeTeam.id, match.homeTeam);
      matchedTeamsMap.set(match.awayTeam.id, match.awayTeam);
    }
  }

  // 6. Enrich top matches with full event summary (boxscore statistics & lineups)
  const matchesList = Array.from(matchedMatchesMap.values());
  const enrichedMatches = await Promise.all(
    matchesList.slice(0, 10).map(async (m) => {
      // If statistics already attached, keep it
      if (m.statistics && m.events && m.events.length > 0) return m;
      try {
        const summary = await fetchEspnEventSummary(m.providerMatchId || m.id);
        if (summary) {
          return {
            ...m,
            statistics: summary.statistics || m.statistics,
            events: summary.events && summary.events.length > 0 ? summary.events : m.events,
            lineups: summary.lineups || m.lineups,
          };
        }
      } catch (e) {
        // ignore
      }
      return m;
    })
  );

  // Combine enriched top matches with the rest
  const finalMatches = [...enrichedMatches, ...matchesList.slice(10)];

  // Also query players if query could be a player name
  let players: any[] = [];
  if (finalMatches.length < 5 && tokens.length <= 3) {
    players = await searchEspnPlayers(query);
  }

  return {
    matches: finalMatches,
    teams: Array.from(matchedTeamsMap.values()),
    players,
    notice,
  };
}
