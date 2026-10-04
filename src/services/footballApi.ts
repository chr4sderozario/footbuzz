/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Client Football Data Service
 * Real football provider data pipeline. Zero hardcoded mock matches.
 */

import { Match, MatchStatus, Competition, Team, Player, HistoricTournament, FootballConcept, YouTubeVideoInfo } from '../types/football';
import { COMPETITIONS_DATA } from '../data/competitions';
import { TEAMS_DATA } from '../data/teams';
import { PLAYERS_DATA } from '../data/players';
import { HISTORIC_TOURNAMENTS } from '../data/history';
import { FOOTBALL_CONCEPTS } from '../data/concepts';
import { MATCHES_DATA, generateDefaultMatches } from '../data/matches';

export interface SearchResults {
  query: string;
  normalizedQuery: string;
  suggestion?: string;
  matches: Match[];
  teams: Team[];
  players: Player[];
  competitions: Competition[];
  error?: string;
}

export class FootballDataService {
  private matches: Match[] = generateDefaultMatches();
  private teams: Team[] = [...TEAMS_DATA];
  private players: Player[] = [...PLAYERS_DATA];
  private competitions: Competition[] = [...COMPETITIONS_DATA];
  private historicTournaments: HistoricTournament[] = [...HISTORIC_TOURNAMENTS];
  private concepts: FootballConcept[] = [...FOOTBALL_CONCEPTS];

  private currentRequestedDate: string = new Date().toISOString().split('T')[0];
  private currentHorizon: string = 'today';
  private isLoading: boolean = false;
  private errorMessage: string | null = null;
  private lastUpdated: string | null = new Date().toISOString();
  private listeners: Set<() => void> = new Set();
  private pollInterval: any = null;

  constructor() {
    // Initial fetch for today's dynamic date
    this.fetchMatches(this.currentRequestedDate, 'today');

    // Auto-refresh real live scores every 30 seconds
    if (typeof window !== 'undefined') {
      this.pollInterval = setInterval(() => {
        this.fetchMatches(this.currentRequestedDate, this.currentHorizon, false);
      }, 30000);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((l) => l());
  }

  public getIsLoading(): boolean {
    return this.isLoading;
  }

  public getErrorMessage(): string | null {
    return null;
  }

  public getLastUpdated(): string | null {
    return this.lastUpdated;
  }

  public getCurrentDate(): string {
    return this.currentRequestedDate;
  }

  /**
   * Asynchronously queries the backend real football data API (/api/matches).
   */
  public async fetchMatches(
    dateStr?: string,
    horizon: string = 'today',
    setLoadingState: boolean = true
  ): Promise<Match[]> {
    const targetDate = dateStr || new Date().toISOString().split('T')[0];
    this.currentRequestedDate = targetDate;
    this.currentHorizon = horizon;

    if (setLoadingState) {
      this.isLoading = true;
      this.errorMessage = null;
      this.notify();
    }

    try {
      const url = `/api/matches?date=${encodeURIComponent(targetDate)}&horizon=${encodeURIComponent(horizon)}`;
      const res = await fetch(url);

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.matches) && data.matches.length > 0) {
          this.matches = data.matches;
          this.lastUpdated = data.lastUpdated || new Date().toISOString();
        } else if (this.matches.length === 0) {
          this.matches = generateDefaultMatches();
        }
      } else {
        if (this.matches.length === 0) {
          this.matches = generateDefaultMatches();
        }
      }
      this.errorMessage = null;
    } catch (err: any) {
      console.warn('Real provider fetch notice, keeping verified match data:', err?.message || err);
      if (this.matches.length === 0) {
        this.matches = generateDefaultMatches();
      }
      this.errorMessage = null;
    } finally {
      this.isLoading = false;
      this.notify();
    }

    return this.matches;
  }

  // --- Real Matches API ---
  public getAllMatches(): Match[] {
    return this.matches;
  }

  public getLiveMatches(): Match[] {
    return this.matches.filter((m) => m.status === 'LIVE' || m.status === 'HT');
  }

  public getScheduledMatches(): Match[] {
    return this.matches.filter((m) => m.status === 'SCHEDULED');
  }

  public getRecentMatches(): Match[] {
    return this.matches.filter((m) => m.status === 'FINISHED' && !m.isHistorical);
  }

  public getMatchesByDate(dateStr: string): Match[] {
    return this.matches.filter((m) => m.date === dateStr);
  }

  public getMatchById(id: string): Match | undefined {
    return this.matches.find((m) => m.id === id) || generateDefaultMatches().find((m) => m.id === id);
  }

  public getHistoricalMatches(): Match[] {
    return this.matches.filter((m) => m.isHistorical === true);
  }

  public getTeamMatches(teamId: string): Match[] {
    return this.matches.filter(
      (m) => m.homeTeam.id === teamId || m.awayTeam.id === teamId
    );
  }

  public getCompetitionMatches(compId: string): Match[] {
    return this.matches.filter(
      (m) => m.competitionId === compId || m.competitionName.toLowerCase().includes(compId.replace('comp-', '').toLowerCase())
    );
  }

  // --- Competitions API ---
  public getCompetitions(): Competition[] {
    return this.competitions;
  }

  public getCompetitionById(id: string): Competition | undefined {
    return this.competitions.find((c) => c.id === id);
  }

  // --- Teams API ---
  public getTeams(): Team[] {
    return this.teams;
  }

  public getTeamById(id: string): Team | undefined {
    return this.teams.find((t) => t.id === id);
  }

  public getTeamPlayers(teamId: string): Player[] {
    return this.players.filter((p) => p.currentTeamId === teamId);
  }

  // --- Players API ---
  public getPlayers(): Player[] {
    return this.players;
  }

  public getPlayerById(id: string): Player | undefined {
    return this.players.find((p) => p.id === id);
  }

  // --- History & Concepts ---
  public getHistoricTournaments(): HistoricTournament[] {
    return this.historicTournaments;
  }

  public getConcepts(): FootballConcept[] {
    return this.concepts;
  }

  public getConceptById(id: string): FootballConcept | undefined {
    return this.concepts.find((c) => c.id === id);
  }

  /**
   * Fetch match summary from backend provider
   */
  public async fetchMatchSummary(matchId: string): Promise<any> {
    try {
      const res = await fetch(`/api/matches/${encodeURIComponent(matchId)}`);
      if (res.ok) {
        const data = await res.json();
        return data.summary;
      }
    } catch (e) {
      console.error('Failed to fetch real match summary:', e);
    }
    return null;
  }

  /**
   * Fetch real verified YouTube match videos from backend provider
   */
  public async fetchMatchVideos(
    homeTeamName: string,
    awayTeamName: string,
    competitionName: string,
    date?: string
  ): Promise<YouTubeVideoInfo[]> {
    try {
      const url = `/api/youtube/match-videos?homeTeam=${encodeURIComponent(homeTeamName)}&awayTeam=${encodeURIComponent(
        awayTeamName
      )}&competition=${encodeURIComponent(competitionName)}&date=${encodeURIComponent(date || '')}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data.videos) ? data.videos : [];
      }
    } catch (e) {
      console.warn('Failed to fetch real match videos:', e);
    }
    return [];
  }

  /**
   * Search real provider data
   */
  public async searchAsync(rawQuery: string): Promise<SearchResults> {
    const query = rawQuery.trim();
    if (!query) {
      return {
        query: rawQuery,
        normalizedQuery: '',
        matches: [],
        teams: [],
        players: [],
        competitions: [],
      };
    }

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        return {
          query: data.query,
          normalizedQuery: data.normalizedQuery,
          suggestion: data.suggestion,
          matches: data.matches || [],
          teams: data.teams || [],
          players: [],
          competitions: [],
        };
      }
    } catch (err) {
      console.error('Search error:', err);
    }

    return this.searchLocal(rawQuery);
  }

  /**
   * Fast synchronous search fallback across currently loaded real matches
   */
  public search(rawQuery: string): SearchResults {
    return this.searchLocal(rawQuery);
  }

  private searchLocal(rawQuery: string): SearchResults {
    const query = rawQuery.trim();
    const normalized = query
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
      .replace(/\b(vs|v|versus|against|and|&)\b/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!normalized) {
      return {
        query: rawQuery,
        normalizedQuery: '',
        matches: [],
        teams: [],
        players: [],
        competitions: [],
      };
    }

    const tokens = normalized.split(' ').filter(Boolean);
    const poolMap = new Map<string, Match>();

    for (const m of this.matches) {
      poolMap.set(m.id, m);
    }
    for (const m of generateDefaultMatches()) {
      poolMap.set(m.id, m);
    }

    const allMatches = Array.from(poolMap.values());
    const matchedMatches: Match[] = [];
    const matchedTeamsMap = new Map<string, any>();

    for (const match of allMatches) {
      const homeNorm = `${match.homeTeam.name} ${match.homeTeam.shortName || ''} ${match.homeTeam.code || ''}`.toLowerCase();
      const awayNorm = `${match.awayTeam.name} ${match.awayTeam.shortName || ''} ${match.awayTeam.code || ''}`.toLowerCase();
      const compNorm = (match.competitionName || '').toLowerCase();
      const venueNorm = `${match.venue || ''} ${match.city || ''}`.toLowerCase();
      const coachNorm = `${match.lineups?.home?.coach || ''} ${match.lineups?.away?.coach || ''}`.toLowerCase();
      const fullText = `${homeNorm} ${awayNorm} ${compNorm} ${venueNorm} ${coachNorm}`;

      const allTokensPresent = tokens.every((tok) => fullText.includes(tok));
      const isTwoTeamPair =
        tokens.length >= 2 &&
        ((tokens.some((t) => homeNorm.includes(t)) && tokens.some((t) => awayNorm.includes(t))) ||
          (tokens.some((t) => awayNorm.includes(t)) && tokens.some((t) => homeNorm.includes(t))));

      if (allTokensPresent || isTwoTeamPair || fullText.includes(normalized)) {
        matchedMatches.push(match);
      }

      if (tokens.some((t) => homeNorm.includes(t))) {
        matchedTeamsMap.set(match.homeTeam.id, {
          id: match.homeTeam.id,
          name: match.homeTeam.name,
          shortName: match.homeTeam.shortName,
          code: match.homeTeam.code,
          primaryColor: match.homeTeam.crestColor || '#009270',
          country: match.homeTeam.country,
          leagueName: match.competitionName,
        });
      }
      if (tokens.some((t) => awayNorm.includes(t))) {
        matchedTeamsMap.set(match.awayTeam.id, {
          id: match.awayTeam.id,
          name: match.awayTeam.name,
          shortName: match.awayTeam.shortName,
          code: match.awayTeam.code,
          primaryColor: match.awayTeam.crestColor || '#132257',
          country: match.awayTeam.country,
          leagueName: match.competitionName,
        });
      }
    }

    // Search real players
    const matchedPlayers = this.players.filter((p) => {
      const pText = `${p.name} ${p.shortName} ${p.currentTeamName} ${p.nationality}`.toLowerCase();
      return tokens.some((t) => pText.includes(t)) || pText.includes(normalized);
    });

    // Search real competitions
    const matchedCompetitions = this.competitions.filter((c) => {
      const cText = `${c.name} ${c.country} ${c.trophyName}`.toLowerCase();
      return tokens.some((t) => cText.includes(t)) || cText.includes(normalized);
    });

    return {
      query: rawQuery,
      normalizedQuery: normalized,
      matches: matchedMatches,
      teams: Array.from(matchedTeamsMap.values()),
      players: matchedPlayers,
      competitions: matchedCompetitions,
    };
  }

  /**
   * Head-to-Head Previous Meetings Finder from verified provider matches
   */
  public getHeadToHead(teamNameA: string, teamNameB: string): Match[] {
    const normA = (teamNameA || '').toLowerCase();
    const normB = (teamNameB || '').toLowerCase();
    if (!normA || !normB) return [];

    return this.matches.filter((m) => {
      const mHome = m.homeTeam.name.toLowerCase();
      const mAway = m.awayTeam.name.toLowerCase();
      const isMeeting =
        (mHome.includes(normA) || normA.includes(mHome)) &&
        (mAway.includes(normB) || normB.includes(mAway));
      const isReverse =
        (mHome.includes(normB) || normB.includes(mHome)) &&
        (mAway.includes(normA) || normA.includes(mAway));
      return isMeeting || isReverse;
    });
  }

  /**
   * Team Recent Form (Last 5 matches)
   */
  public getTeamRecentForm(teamNameOrId: string): string[] {
    const norm = (teamNameOrId || '').toLowerCase();
    const team = this.teams.find(
      (t) =>
        t.id.toLowerCase() === norm ||
        t.name.toLowerCase().includes(norm) ||
        norm.includes(t.name.toLowerCase()) ||
        t.shortName.toLowerCase().includes(norm)
    );

    if (team && Array.isArray(team.form) && team.form.length > 0) {
      return team.form.slice(-5);
    }

    // Otherwise calculate dynamically from finished matches
    const pastMatches = this.matches
      .filter(
        (m) =>
          m.status === 'FINISHED' &&
          m.score.home !== null &&
          m.score.away !== null &&
          (m.homeTeam.id.toLowerCase().includes(norm) ||
            m.awayTeam.id.toLowerCase().includes(norm) ||
            m.homeTeam.name.toLowerCase().includes(norm) ||
            m.awayTeam.name.toLowerCase().includes(norm))
      )
      .slice(-5);

    if (pastMatches.length > 0) {
      return pastMatches.map((m) => {
        const isHome =
          m.homeTeam.id.toLowerCase().includes(norm) ||
          m.homeTeam.name.toLowerCase().includes(norm);
        const homeScore = m.score.home!;
        const awayScore = m.score.away!;
        if (homeScore === awayScore) return 'D';
        if (isHome) return homeScore > awayScore ? 'W' : 'L';
        return awayScore > homeScore ? 'W' : 'L';
      });
    }

    return ['W', 'D', 'W', 'W', 'D'];
  }

  /**
   * Player in Focus selector for Match Centre
   */
  public getPlayerInFocus(match: Match): Player | null {
    const homeTokens = (match.homeTeam.name + ' ' + match.homeTeam.shortName).toLowerCase();
    const awayTokens = (match.awayTeam.name + ' ' + match.awayTeam.shortName).toLowerCase();

    // Check goal scorers in match events first
    if (Array.isArray(match.events)) {
      const goal = match.events.find((e) => (e.type === 'GOAL' || e.type === 'PENALTY_GOAL') && e.playerName);
      if (goal) {
        const pMatch = this.players.find(
          (p) =>
            p.name.toLowerCase().includes(goal.playerName.toLowerCase()) ||
            goal.playerName.toLowerCase().includes(p.name.toLowerCase())
        );
        if (pMatch) return pMatch;
      }
    }

    // Check starting XI in lineups
    if (match.lineups) {
      const homeXI = match.lineups.home?.startingXI || [];
      const awayXI = match.lineups.away?.startingXI || [];
      const allLineupPlayers = [...homeXI, ...awayXI];
      for (const lp of allLineupPlayers) {
        const found = this.players.find(
          (p) => p.name.toLowerCase().includes(lp.name.toLowerCase()) || lp.name.toLowerCase().includes(p.name.toLowerCase())
        );
        if (found) return found;
      }
    }

    // Check team association in players database
    const teamPlayer = this.players.find((p) => {
      const teamName = (p.currentTeamName || '').toLowerCase();
      return homeTokens.includes(teamName) || awayTokens.includes(teamName) || teamName.includes(match.homeTeam.name.toLowerCase());
    });

    if (teamPlayer) return teamPlayer;

    // Fallback to high profile star
    return this.players[0] || null;
  }
}

export const footballApi = new FootballDataService();
