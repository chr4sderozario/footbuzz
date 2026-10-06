/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Football Domain Types
 */

export type MatchStatus =
  | 'LIVE'
  | 'SCHEDULED'
  | 'FINISHED'
  | 'POSTPONED'
  | 'CANCELLED'
  | 'HT'
  | 'ET'
  | 'PEN'
  | 'UPCOMING';

export type MatchMoodType =
  | 'DERBY'
  | 'FINAL'
  | 'WORLD_CUP'
  | 'KNOCKOUT'
  | 'INTERNATIONAL'
  | 'LEAGUE';

export interface YouTubeVideoInfo {
  videoId: string;
  title: string;
  channel: string;
  thumbnail: string;
  publishedAt: string;
  description?: string;
  isOfficial?: boolean;
  channelBadge?: string;
  videoType?: 'HIGHLIGHTS' | 'PRESS_CONFERENCE' | 'TACTICAL_ANALYSIS' | 'OFFICIAL_MATCH_CONTENT' | 'GOALS' | 'MATCH_PREVIEW';
}

export interface FootballNewsItem {
  id: string;
  headline: string;
  description: string;
  published: string;
  imageUrl?: string;
  url: string;
  byline?: string;
  category?: string;
  footballer?: string;
}

export interface InAppNotification {
  id: string;
  type: 'GOAL' | 'RED_CARD' | 'FULL_TIME' | 'LINEUP' | 'KICKOFF_SOON';
  title: string;
  message: string;
  matchId: string;
  timestamp: number;
  read: boolean;
}

export interface HeadToHeadMeeting {
  date: string;
  competition: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  winner?: 'HOME' | 'AWAY' | 'DRAW';
  venue?: string;
}

export type EventType =
  | 'GOAL'
  | 'OWN_GOAL'
  | 'PENALTY_GOAL'
  | 'MISSED_PENALTY'
  | 'YELLOW_CARD'
  | 'RED_CARD'
  | 'SUBSTITUTION'
  | 'VAR_DECISION';

export interface TicketInfo {
  available: boolean;
  providerName: string; // e.g. "BookMyShow", "Official Club Ticketing", "District", "UEFA Official"
  ticketUrl: string;
  officialOrAuthorized: boolean;
  priceRange?: string;
  availabilityStatus?: 'AVAILABLE' | 'FEW_LEFT' | 'SOLD_OUT' | 'UNAVAILABLE';
}

export interface MatchEvent {
  id: string;
  minute: number;
  addedTime?: number;
  type: EventType;
  teamId: string;
  teamName: string;
  playerId: string;
  playerName: string;
  assistPlayerId?: string;
  assistPlayerName?: string;
  playerInId?: string;
  playerInName?: string;
  playerOutId?: string;
  playerOutName?: string;
  detail?: string;
  isHomeTeam: boolean;
}

export interface LineupPlayer {
  playerId: string;
  name: string;
  number: number;
  position: 'GK' | 'DF' | 'MF' | 'FW' | string;
  role?: string;
  gridPos?: { x: number; y: number }; // 0 to 100 percentage coordinates
  isCaptain?: boolean;
  rating?: number;
  isSubstituted?: boolean;
  subMinute?: number;
  goals?: number;
  assists?: number;
  yellowCards?: number;
  redCards?: number;
  [key: string]: any;
}

export interface TeamLineup {
  formation: string;
  coach: string;
  startingXI: LineupPlayer[];
  bench: LineupPlayer[];
}

export interface MatchLineups {
  home: TeamLineup;
  away: TeamLineup;
}

export interface MatchStatistics {
  possession: [number, number]; // [home, away] %
  shotsTotal: [number, number];
  shotsOnTarget: [number, number];
  expectedGoals: [number, number]; // xG
  corners: [number, number];
  fouls: [number, number];
  yellowCards: [number, number];
  redCards: [number, number];
  offsides: [number, number];
  saves: [number, number];
  passesTotal: [number, number];
  passAccuracy: [number, number]; // %
  crosses: [number, number];
  tacklesWon: [number, number];
  interceptions: [number, number];
  bigChancesCreated: [number, number];
  [key: string]: any;
}

export interface TacticalPhaseNode {
  playerId: string;
  name: string;
  number: number;
  x: number; // 0 to 100 on pitch
  y: number; // 0 to 100 on pitch
}

export interface TacticalPhase {
  phaseMinute: string; // e.g. "Kickoff (0')", "First Half (30')", "Second Half (65')", "Full Time"
  homeShape: string;
  awayShape: string;
  homeNodes: TacticalPhaseNode[];
  awayNodes: TacticalPhaseNode[];
  passingLines?: { fromId: string; toId: string; count: number }[];
  possessionZones?: { defThird: number; midThird: number; attThird: number };
  description?: string;
  [key: string]: any;
}

export interface MomentumShift {
  minute: number;
  title: string;
  description: string;
  impactType: 'GOAL' | 'RED_CARD' | 'TACTICAL_SUB' | 'MOMENTUM_SWING' | string;
  teamId: string;
  teamName: string;
  statImpactNote: string;
}

export interface PostMatchReport {
  headline: string;
  summary: string;
  keyTakeaway: string;
  playerOfTheMatch: {
    playerId: string;
    name: string;
    team: string;
    rating: number;
    rationale: string;
  };
  tacticalVerdict: string;
  milestones?: string[];
}

export interface CommentaryItem {
  id: string;
  minute: number;
  addedTime?: number;
  text: string;
  isImportant?: boolean;
  type?: 'GOAL' | 'CARD' | 'CHANCE' | 'SUB' | 'VAR' | 'GENERAL' | string;
  teamId?: string;
}

export interface MatchTeamRef {
  id: string;
  name: string;
  shortName: string;
  code: string;
  crestColor?: string;
  crestSecondaryColor?: string;
  crestUrl?: string;
  country: string;
  isNational?: boolean;
}

export interface Match {
  id: string;
  providerMatchId?: string;
  competitionId: string;
  competitionName: string;
  competitionCategory: 'league' | 'cup' | 'international' | string;
  competitionEmblem?: string;
  season: string;
  round?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM local
  timezone?: string; // e.g. "UTC+1" or "IST"
  status: MatchStatus;
  minute?: number;
  addedTime?: number;
  homeTeam: MatchTeamRef;
  awayTeam: MatchTeamRef;
  score: {
    home: number | null;
    away: number | null;
    htHome?: number | null;
    htAway?: number | null;
    penalties?: { home: number; away: number };
  };
  venue: string;
  city: string;
  referee?: string;
  attendance?: number;
  weather?: { temp: string; condition: string };
  events: MatchEvent[];
  lineups?: MatchLineups;
  statistics?: MatchStatistics;
  tacticalPhases?: TacticalPhase[];
  momentumShifts?: MomentumShift[];
  postMatchReport?: PostMatchReport;
  commentary?: CommentaryItem[];
  commentaryAvailable?: boolean;
  tacticalDataAvailable?: boolean;
  isHistorical?: boolean;
  historicalContext?: string;
  ticketInfo?: TicketInfo;
  postponedReason?: string;
  mood?: MatchMoodType;
  followed?: boolean;
  youtubeVideos?: YouTubeVideoInfo[];
  [key: string]: any;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  code: string;
  country: string;
  countryCode: string;
  city: string;
  founded: number;
  stadium: string;
  capacity: number;
  manager: string;
  primaryColor: string;
  secondaryColor: string;
  leagueId: string;
  leagueName: string;
  rank?: number;
  points?: number;
  form?: ('W' | 'D' | 'L')[];
  trophies: { title: string; count: number; years: number[] }[];
  stats: {
    matchesPlayed: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    cleanSheets: number;
    possessionAvg: number;
    passAccuracyAvg: number;
  };
  squadPlayerIds: string[];
  [key: string]: any;
}

export interface Player {
  id: string;
  name: string;
  shortName: string;
  number: number;
  position: 'GK' | 'DF' | 'MF' | 'FW' | string;
  detailedPosition?: string;
  nationality: string;
  nationalityCode?: string;
  dateOfBirth?: string;
  age?: number;
  heightCm?: number;
  height?: string | number;
  weightKg?: number;
  preferredFoot?: 'Left' | 'Right' | 'Both' | string;
  currentTeamId: string;
  currentTeamName: string;
  careerStats?: any;
  seasonStats?: any;
  attributes?: {
    pace?: number;
    shooting?: number;
    passing?: number;
    dribbling?: number;
    defending?: number;
    physical?: number;
    [key: string]: any;
  };
  achievements?: any[];
  isLegend?: boolean;
  biography?: string;
  [key: string]: any;
}

export interface CompetitionStandingRow {
  position: number;
  teamId: string;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
}

export interface TopScorerRow {
  rank: number;
  playerId: string;
  playerName: string;
  teamId: string;
  teamName: string;
  goals: number;
  assists: number;
  penalties: number;
  matches: number;
}

export interface Competition {
  id: string;
  name: string;
  shortName: string;
  code: string;
  category: 'league' | 'cup' | 'international' | string;
  country: string;
  countryCode: string;
  season: string;
  currentRound?: string;
  founded: number;
  trophyName: string;
  primaryColor: string;
  teamsCount: number;
  historySummary: string;
  allTimeChampions: { team: string; titles: number; lastWon: number }[];
  standings?: CompetitionStandingRow[];
  topScorers?: TopScorerRow[];
  [key: string]: any;
}

export interface HistoricTournament {
  id: string;
  name: string;
  year: number;
  hostCountry?: string;
  host?: string;
  champion?: string;
  championTeamName?: string;
  runnerUp?: string;
  runnerUpTeamName?: string;
  thirdPlace?: string;
  goldenBoot?: { player: string; country: string; goals: number };
  goldenBall?: { player: string; country: string };
  totalGoals?: number;
  totalMatches?: number;
  matchesPlayed?: number;
  summary?: string;
  keyMoments?: { minute?: string; title: string; description: string }[];
  iconicMoments?: any[];
  iconicMatchId?: string;
  [key: string]: any;
}

export interface FootballConcept {
  id: string;
  name: string;
  category?: string;
  shortSummary?: string;
  shortDesc?: string;
  origin?: string;
  originEra?: string;
  keyInnovators?: string[];
  explanation?: string;
  keyPrinciples?: string[];
  famousTeamsUsed?: string[];
  famousTeamsOrManagers?: any[];
  visualType?: string;
  [key: string]: any;
}

export interface OnThisDayEvent {
  id: string;
  dateStr: string; // MM-DD
  year: number;
  title: string;
  description: string;
  type: string;
  entityId?: string;
  relatedPlayerId?: string;
  relatedTeamId?: string;
  [key: string]: any;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  authProvider?: 'email' | 'google';
  favoriteTeamIds: string[];
  favoritePlayerIds: string[];
  favoriteCompetitionIds: string[];
  favoriteMatchIds: string[];
  notificationSettings: {
    matchStart: boolean;
    goals: boolean;
    redCards: boolean;
    fullTime: boolean;
    favoriteTeamOnly: boolean;
  };
  joinedDate: string;
}
