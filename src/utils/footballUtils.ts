/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Football Domain Utilities
 * Real-metadata match mood classification, live countdowns, and transparent match activity calculation.
 */

import { Match, MatchEvent, MatchMoodType } from '../types/football';

/**
 * Feature 9: Match Mood Visual Identity based on REAL match metadata.
 */
export function getMatchMood(match: Match): {
  type: MatchMoodType;
  label: string;
  emoji: string;
  badgeStyle: string;
} {
  const home = (match.homeTeam?.name || '').toLowerCase();
  const away = (match.awayTeam?.name || '').toLowerCase();
  const comp = (match.competitionName || '').toLowerCase();
  const round = (match.round || '').toLowerCase();

  // 1. Derby Detection (Rivalry clashes)
  const isKolkataDerby = (home.includes('mohun bagan') && away.includes('east bengal')) || (home.includes('east bengal') && away.includes('mohun bagan'));
  const isElClasico = (home.includes('real madrid') && away.includes('barcelona')) || (home.includes('barcelona') && away.includes('real madrid'));
  const isNorthLondon = (home.includes('arsenal') && away.includes('tottenham')) || (home.includes('tottenham') && away.includes('arsenal'));
  const isManchester = (home.includes('manchester city') && away.includes('manchester united')) || (home.includes('manchester united') && away.includes('manchester city'));
  const isMilan = (home.includes('inter') && away.includes('milan')) || (home.includes('milan') && away.includes('inter'));
  const isMerseyside = (home.includes('liverpool') && away.includes('everton')) || (home.includes('everton') && away.includes('liverpool'));
  const isSouthernDerby = (home.includes('kerala blasters') && away.includes('bengaluru')) || (home.includes('bengaluru') && away.includes('kerala blasters'));

  if (isKolkataDerby) {
    return { type: 'DERBY', label: 'Kolkata Derby', emoji: '🔥', badgeStyle: 'bg-rose-600 text-white border-rose-700 shadow-xs' };
  }
  if (isElClasico) {
    return { type: 'DERBY', label: 'El Clásico', emoji: '🔥', badgeStyle: 'bg-rose-600 text-white border-rose-700 shadow-xs' };
  }
  if (isNorthLondon || isManchester || isMilan || isMerseyside || isSouthernDerby) {
    return { type: 'DERBY', label: 'Derby Rivalry', emoji: '🔥', badgeStyle: 'bg-amber-600 text-white border-amber-700 shadow-xs' };
  }

  // 2. Final / Championship
  if (round.includes('final') && !round.includes('semi') && !round.includes('quarter')) {
    return { type: 'FINAL', label: 'Cup Final', emoji: '🏆', badgeStyle: 'bg-amber-500 text-slate-950 font-black border-amber-400 shadow-xs' };
  }

  // 3. FIFA World Cup
  if (comp.includes('world cup') || comp.includes('fifa')) {
    return { type: 'WORLD_CUP', label: 'World Cup', emoji: '🌍', badgeStyle: 'bg-blue-600 text-white border-blue-700 shadow-xs' };
  }

  // 4. Knockout Stage
  if (
    round.includes('semi') ||
    round.includes('quarter') ||
    round.includes('round of') ||
    round.includes('playoff') ||
    match.competitionCategory === 'cup'
  ) {
    return { type: 'KNOCKOUT', label: 'Knockout Tie', emoji: '⚔️', badgeStyle: 'bg-purple-600 text-white border-purple-700 shadow-xs' };
  }

  // 5. International Fixture
  if (match.competitionCategory === 'international' || comp.includes('friendly') || comp.includes('euro') || comp.includes('copa')) {
    return { type: 'INTERNATIONAL', label: 'International', emoji: '🌐', badgeStyle: 'bg-teal-700 text-white border-teal-800 shadow-xs' };
  }

  // 6. Regular League
  return { type: 'LEAGUE', label: 'League Match', emoji: '📅', badgeStyle: 'bg-slate-800 text-slate-200 border-slate-700' };
}

/**
 * Feature 10: Live Kickoff Countdown for Upcoming Matches.
 */
export function getMatchCountdown(dateStr: string, timeStr: string): {
  text: string;
  isUpcoming: boolean;
  hours: number;
  minutes: number;
  totalMinutes: number;
} {
  try {
    const [hours, mins] = (timeStr || '19:00').split(':').map((v) => parseInt(v, 10) || 0);
    const matchDate = new Date(`${dateStr}T${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:00`);

    const diffMs = matchDate.getTime() - Date.now();
    if (diffMs <= 0) {
      return { text: 'Kickoff Imminent', isUpcoming: false, hours: 0, minutes: 0, totalMinutes: 0 };
    }

    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;

    let text = '';
    if (h > 24) {
      const days = Math.floor(h / 24);
      text = `Starts in ${days}d ${h % 24}h`;
    } else if (h > 0) {
      text = `Starts in ${h}h ${m}m`;
    } else {
      text = `Starts in ${m}m`;
    }

    return { text, isUpcoming: true, hours: h, minutes: m, totalMinutes };
  } catch {
    return { text: 'Upcoming', isUpcoming: true, hours: 0, minutes: 0, totalMinutes: 60 };
  }
}

/**
 * Feature 33: Transparent Match Activity Score calculated purely from real provider events.
 */
export function calculateMatchActivity(
  events: MatchEvent[] = [],
  isLive: boolean = false
): {
  score: number;
  label: 'HIGH TEMPO' | 'ACTIVE' | 'STEADY';
  explanation: string;
  goalsCount: number;
  cardsCount: number;
  subsCount: number;
} {
  const goalsCount = events.filter((e) => e.type === 'GOAL' || e.type === 'PENALTY_GOAL').length;
  const cardsCount = events.filter((e) => e.type === 'YELLOW_CARD' || e.type === 'RED_CARD').length;
  const subsCount = events.filter((e) => e.type === 'SUBSTITUTION').length;

  // Transparent point calculation:
  // Base: 40 points
  // Goals: +15 each
  // Cards: +6 each
  // Substitutions: +3 each
  let raw = 40 + goalsCount * 15 + cardsCount * 6 + subsCount * 3;
  if (isLive) raw += 10;

  const score = Math.min(100, Math.max(30, raw));

  let label: 'HIGH TEMPO' | 'ACTIVE' | 'STEADY' = 'STEADY';
  if (score >= 75) label = 'HIGH TEMPO';
  else if (score >= 55) label = 'ACTIVE';

  const explanation = `${goalsCount} goal(s), ${cardsCount} card(s), and ${subsCount} substitution(s) recorded.`;

  return { score, label, explanation, goalsCount, cardsCount, subsCount };
}

/**
 * Feature 28: Shareable match scorecard summary.
 */
export function generateMatchShareText(match: Match): string {
  const isFinished = match.status === 'FINISHED';
  const isLive = match.status === 'LIVE' || match.status === 'HT';

  let statusText = '';
  if (isFinished) {
    statusText = `Final: ${match.homeTeam.name} ${match.score.home ?? 0} – ${match.score.away ?? 0} ${match.awayTeam.name}`;
  } else if (isLive) {
    statusText = `LIVE (${match.minute || ''}'): ${match.homeTeam.name} ${match.score.home ?? 0} – ${match.score.away ?? 0} ${match.awayTeam.name}`;
  } else {
    statusText = `${match.homeTeam.name} vs ${match.awayTeam.name} · Kickoff ${match.time} (${match.date})`;
  }

  return `⚽ ${statusText}\n🏆 ${match.competitionName} · ${match.venue || 'Stadium'}\n⚡ Live match centre on FootBuzz: ${typeof window !== 'undefined' ? window.location.origin : ''}`;
}
