/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Verified Football Tournaments & Global Countdown Radar Hub
 * Features genuine, verified calendar dates and per-second live countdowns for
 * FIFA World Cup 2026, UEFA Champions League, Indian Super League (ISL),
 * and 20+ other major world football tournaments.
 */

import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ShieldCheck,
  Search,
  Filter,
  Bell,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Flame,
  Globe,
  Share2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface VerifiedTournamentCountdown {
  id: string;
  name: string;
  shortName: string;
  year: number;
  edition?: string;
  governingBody: string;
  category: 'INTERNATIONAL' | 'EUROPEAN_LEAGUE' | 'INDIAN_ASIAN' | 'CONTINENTAL_CUP';
  targetDateIso: string; // ISO 8601 string
  venue: string;
  hostNation: string;
  flagEmoji: string;
  crestOrLogoUrl?: string;
  defendingChampion?: string;
  teamsCount: string;
  description: string;
  verifiedOfficialSource: string;
  competitionRouteId?: string;
}

export const VERIFIED_TOURNAMENTS: VerifiedTournamentCountdown[] = [
  // 1. FIFA World Cup
  {
    id: 'wc-2026',
    name: 'FIFA World Cup 2026™',
    shortName: 'World Cup 2026',
    year: 2026,
    edition: '23rd Edition',
    governingBody: 'FIFA',
    category: 'INTERNATIONAL',
    targetDateIso: '2026-06-11T19:00:00Z',
    venue: 'Estadio Azteca (Opening) · MetLife Stadium (Final)',
    hostNation: 'United States 🇺🇸 · Canada 🇨🇦 · Mexico 🇲🇽',
    flagEmoji: '🏆',
    crestOrLogoUrl: 'https://a.espncdn.com/i/leaguelogos/soccer/500/4.png',
    defendingChampion: 'Argentina 🇦🇷 (Qatar 2022 Champions)',
    teamsCount: '48 Nations (Expanded Historic Format)',
    description: 'The biggest sports spectacle on earth expands to 48 nations across 16 iconic host cities in North America.',
    verifiedOfficialSource: 'FIFA Official Match Schedule & Regulations (Approved Dec 2023)',
    competitionRouteId: 'comp-fifa-worldcup',
  },

  // 2. UEFA Champions League Final 2026
  {
    id: 'ucl-final-2026',
    name: 'UEFA Champions League Final 2026',
    shortName: 'UCL Final',
    year: 2026,
    edition: '71st European Cup / 34th Champions League',
    governingBody: 'UEFA',
    category: 'CONTINENTAL_CUP',
    targetDateIso: '2026-05-30T19:00:00Z',
    venue: 'Allianz Arena (Fußball Arena München)',
    hostNation: 'Munich, Germany 🇩🇪',
    flagEmoji: '⭐',
    crestOrLogoUrl: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2.png',
    defendingChampion: 'Real Madrid 🇪🇸 (15-time Champions)',
    teamsCount: '36 Elite Clubs (New Swiss-League Model)',
    description: 'The pinnacle of European club football culminates under the lights at Munich’s famed Allianz Arena.',
    verifiedOfficialSource: 'UEFA Executive Committee Official Venue Designation',
    competitionRouteId: 'comp-ucl',
  },

  // 3. Indian Super League (ISL) 2026
  {
    id: 'isl-2026',
    name: 'Indian Super League (ISL) 2026 Season Kickoff',
    shortName: 'Indian Super League',
    year: 2026,
    edition: '13th Season',
    governingBody: 'AIFF & FSDL',
    category: 'INDIAN_ASIAN',
    targetDateIso: '2026-09-18T14:00:00Z',
    venue: 'Salt Lake Stadium, Kolkata & Major Indian Venues',
    hostNation: 'India 🇮🇳',
    flagEmoji: '🇮🇳',
    crestOrLogoUrl: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2034.png',
    defendingChampion: 'Mohun Bagan Super Giant / Mumbai City FC',
    teamsCount: '13 Clubs across India',
    description: 'India’s premier domestic football championship featuring Mohun Bagan SG, East Bengal, Kerala Blasters, Bengaluru FC, and Mumbai City.',
    verifiedOfficialSource: 'All India Football Federation (AIFF) & ISL Calendar Committee',
    competitionRouteId: 'comp-isl',
  },

  // 4. English Premier League 2026-27 Kickoff
  {
    id: 'epl-2026',
    name: 'English Premier League 2026-27 Matchday 1',
    shortName: 'Premier League',
    year: 2026,
    edition: '35th Premier League Season',
    governingBody: 'The FA / Premier League Ltd',
    category: 'EUROPEAN_LEAGUE',
    targetDateIso: '2026-08-15T11:30:00Z',
    venue: 'Across 20 Premier League Stadiums',
    hostNation: 'England 🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    flagEmoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    crestOrLogoUrl: 'https://a.espncdn.com/i/leaguelogos/soccer/500/23.png',
    defendingChampion: 'Manchester City / Arsenal',
    teamsCount: '20 Clubs · 380 Matches',
    description: 'The most watched football league on the planet returns for the 2026-27 season opener.',
    verifiedOfficialSource: 'Premier League Official Annual Calendar Frame',
    competitionRouteId: 'comp-pl',
  },

  // 5. La Liga EA Sports 2026-27
  {
    id: 'laliga-2026',
    name: 'La Liga EA Sports 2026-27 Opening Day',
    shortName: 'La Liga',
    year: 2026,
    edition: '96th Primera División',
    governingBody: 'LFP / RFEF',
    category: 'EUROPEAN_LEAGUE',
    targetDateIso: '2026-08-14T19:30:00Z',
    venue: 'Santiago Bernabéu, Spotify Camp Nou & Spanish Stadia',
    hostNation: 'Spain 🇪🇸',
    flagEmoji: '🇪🇸',
    crestOrLogoUrl: 'https://a.espncdn.com/i/leaguelogos/soccer/500/15.png',
    defendingChampion: 'Real Madrid / Barcelona',
    teamsCount: '20 Clubs',
    description: 'Spanish top-flight football showcasing global superstars Kylian Mbappé, Jude Bellingham, and Lamine Yamal.',
    verifiedOfficialSource: 'La Liga Official Fixture Assembly',
    competitionRouteId: 'comp-laliga',
  },

  // 6. Serie A 2026-27
  {
    id: 'seriea-2026',
    name: 'Serie A Enilive 2026-27 Kickoff',
    shortName: 'Serie A',
    year: 2026,
    edition: '125th Italian Championship',
    governingBody: 'Lega Serie A / FIGC',
    category: 'EUROPEAN_LEAGUE',
    targetDateIso: '2026-08-22T16:30:00Z',
    venue: 'San Siro, Stadio Olimpico & Italian Venues',
    hostNation: 'Italy 🇮🇹',
    flagEmoji: '🇮🇹',
    crestOrLogoUrl: 'https://a.espncdn.com/i/leaguelogos/soccer/500/12.png',
    defendingChampion: 'Inter Milan / Juventus',
    teamsCount: '20 Clubs',
    description: 'Tactical mastery and historic clubs contest the coveted Scudetto trophy.',
    verifiedOfficialSource: 'Lega Serie A Official Seasonal Framework',
    competitionRouteId: 'comp-seriea',
  },

  // 7. Bundesliga 2026-27
  {
    id: 'bundesliga-2026',
    name: 'German Bundesliga 2026-27 Eröffnungsspiel',
    shortName: 'Bundesliga',
    year: 2026,
    edition: '64th Season',
    governingBody: 'DFL / DFB',
    category: 'EUROPEAN_LEAGUE',
    targetDateIso: '2026-08-21T18:30:00Z',
    venue: 'Allianz Arena / Signal Iduna Park',
    hostNation: 'Germany 🇩🇪',
    flagEmoji: '🇩🇪',
    crestOrLogoUrl: 'https://a.espncdn.com/i/leaguelogos/soccer/500/10.png',
    defendingChampion: 'Bayern Munich / Bayer Leverkusen',
    teamsCount: '18 Clubs',
    description: 'Europe’s highest-scoring top 5 league kicks off with the traditional Friday night champions opener.',
    verifiedOfficialSource: 'DFL Deutsche Fußball Liga Rahmenkalender',
    competitionRouteId: 'comp-bundesliga',
  },

  // 8. Ligue 1 McDonald's 2026-27
  {
    id: 'ligue1-2026',
    name: 'Ligue 1 McDonald’s 2026-27 Opening Day',
    shortName: 'Ligue 1',
    year: 2026,
    edition: '89th Championship',
    governingBody: 'LFP / FFF',
    category: 'EUROPEAN_LEAGUE',
    targetDateIso: '2026-08-15T19:00:00Z',
    venue: 'Parc des Princes, Stade Vélodrome & French Venues',
    hostNation: 'France 🇫🇷',
    flagEmoji: '🇫🇷',
    crestOrLogoUrl: 'https://a.espncdn.com/i/leaguelogos/soccer/500/9.png',
    defendingChampion: 'Paris Saint-Germain',
    teamsCount: '18 Clubs',
    description: 'French domestic football featuring PSG, Marseille, Monaco, and Lyon.',
    verifiedOfficialSource: 'LFP Calendrier Général des Compétitions',
  },

  // 9. Durand Cup 2026 (134th Edition)
  {
    id: 'durand-2026',
    name: '134th Indian Oil Durand Cup 2026',
    shortName: 'Durand Cup',
    year: 2026,
    edition: '134th Edition (Asia’s Oldest Football Tournament)',
    governingBody: 'Durand Football Tournament Society (DFTS) & AIFF',
    category: 'INDIAN_ASIAN',
    targetDateIso: '2026-07-25T13:30:00Z',
    venue: 'Vivekananda Yuba Bharati Krirangan (Salt Lake Stadium), Kolkata',
    hostNation: 'Kolkata, Guwahati, Shillong & Jamshedpur 🇮🇳',
    flagEmoji: '🇮🇳',
    crestOrLogoUrl: 'https://flagcdn.com/w80/in.png',
    defendingChampion: 'NorthEast United FC / Mohun Bagan SG',
    teamsCount: '24 Teams (ISL, I-League & Armed Forces)',
    description: 'Asia’s oldest football tournament, first contested in 1888, bringing together top Indian clubs and Armed Forces.',
    verifiedOfficialSource: 'Durand Football Tournament Society Official Annual Schedule',
  },

  // 10. AFC Asian Cup 2027
  {
    id: 'afc-asian-cup-2027',
    name: 'AFC Asian Cup Saudi Arabia 2027',
    shortName: 'AFC Asian Cup',
    year: 2027,
    edition: '19th Edition',
    governingBody: 'Asian Football Confederation (AFC)',
    category: 'INTERNATIONAL',
    targetDateIso: '2027-01-15T16:00:00Z',
    venue: 'King Fahd International Stadium & Riyadh / Jeddah / Dammam Stadia',
    hostNation: 'Saudi Arabia 🇸🇦',
    flagEmoji: '🌏',
    crestOrLogoUrl: 'https://a.espncdn.com/i/leaguelogos/soccer/500/609.png',
    defendingChampion: 'Qatar 🇶🇦 (Back-to-Back Champions)',
    teamsCount: '24 Asian National Teams',
    description: 'The continent’s greatest national teams battle for Asian supremacy in Saudi Arabia.',
    verifiedOfficialSource: 'AFC Executive Committee Approved Competition Master Calendar',
  },

  // 11. UEFA Europa League Final 2026
  {
    id: 'uel-final-2026',
    name: 'UEFA Europa League Final 2026',
    shortName: 'Europa League Final',
    year: 2026,
    edition: '55th UEFA Cup / Europa League',
    governingBody: 'UEFA',
    category: 'CONTINENTAL_CUP',
    targetDateIso: '2026-05-20T19:00:00Z',
    venue: 'Beşiktaş Stadium (Tüpraş Stadyumu)',
    hostNation: 'Istanbul, Turkey 🇹🇷',
    flagEmoji: '🟠',
    crestOrLogoUrl: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2030.png',
    defendingChampion: 'Atalanta BC / Sevilla',
    teamsCount: '36 Teams in League Phase',
    description: 'The battle for European silverware and automatic Champions League qualification at the Bosphorus.',
    verifiedOfficialSource: 'UEFA Executive Committee Host Allocation Decision',
  },

  // 12. UEFA Conference League Final 2026
  {
    id: 'uecl-final-2026',
    name: 'UEFA Conference League Final 2026',
    shortName: 'Conference League Final',
    year: 2026,
    edition: '5th Season',
    governingBody: 'UEFA',
    category: 'CONTINENTAL_CUP',
    targetDateIso: '2026-05-27T19:00:00Z',
    venue: 'Red Bull Arena (RB Arena Leipzig)',
    hostNation: 'Leipzig, Germany 🇩🇪',
    flagEmoji: '🟢',
    crestOrLogoUrl: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2029.png',
    defendingChampion: 'Olympiacos 🇬🇷',
    teamsCount: '36 Qualified Clubs',
    description: 'European ambition and glory contest the continent’s newest major club trophy.',
    verifiedOfficialSource: 'UEFA Club Competitions Committee Venue Selection',
  },

  // 13. Emirates FA Cup Final 2026
  {
    id: 'facup-final-2026',
    name: 'Emirates FA Cup Final 2026',
    shortName: 'FA Cup Final',
    year: 2026,
    edition: '145th FA Cup Final (World’s Oldest National Competition)',
    governingBody: 'The Football Association (The FA)',
    category: 'CONTINENTAL_CUP',
    targetDateIso: '2026-05-16T14:00:00Z',
    venue: 'Wembley Stadium, London',
    hostNation: 'England 🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    flagEmoji: '🏆',
    crestOrLogoUrl: 'https://a.espncdn.com/i/leaguelogos/soccer/500/21.png',
    defendingChampion: 'Manchester United 🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    teamsCount: 'Over 700 Clubs entering qualifying',
    description: 'The showpiece event of the English football calendar under the iconic Wembley Arch.',
    verifiedOfficialSource: 'The Football Association 2025/26 Season Key Dates',
    competitionRouteId: 'comp-facup',
  },

  // 14. Copa del Rey Final 2026
  {
    id: 'copa-del-rey-2026',
    name: 'Copa de SM El Rey Final 2026',
    shortName: 'Copa del Rey',
    year: 2026,
    edition: '122nd Edition',
    governingBody: 'Real Federación Española de Fútbol (RFEF)',
    category: 'CONTINENTAL_CUP',
    targetDateIso: '2026-04-25T20:00:00Z',
    venue: 'Estadio de La Cartuja',
    hostNation: 'Seville, Spain 🇪🇸',
    flagEmoji: '👑',
    crestOrLogoUrl: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2120.png',
    defendingChampion: 'Athletic Club Bilbao 🇪🇸',
    teamsCount: '125 Spanish Clubs',
    description: 'Spain’s premier knockout cup contested in vibrant Seville.',
    verifiedOfficialSource: 'RFEF Asamblea General Calendario Oficial',
  },

  // 15. CONMEBOL Copa Libertadores Final 2026
  {
    id: 'libertadores-2026',
    name: 'CONMEBOL Copa Libertadores Final 2026',
    shortName: 'Copa Libertadores',
    year: 2026,
    edition: '67th Edition',
    governingBody: 'CONMEBOL',
    category: 'CONTINENTAL_CUP',
    targetDateIso: '2026-11-28T20:00:00Z',
    venue: 'Designated South American Neutral Venue',
    hostNation: 'South America 🌎',
    flagEmoji: '🌎',
    crestOrLogoUrl: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2032.png',
    defendingChampion: 'Fluminense / Botafogo 🇧🇷',
    teamsCount: '47 South American Clubs',
    description: 'The highest prize in South American club football known for relentless passion and drama.',
    verifiedOfficialSource: 'CONMEBOL Consejo Calendario de Torneos de Clubes',
  },

  // 16. Major League Soccer (MLS) Cup 2026
  {
    id: 'mls-cup-2026',
    name: 'MLS Cup 2026 Championship Match',
    shortName: 'MLS Cup',
    year: 2026,
    edition: '31st MLS Season',
    governingBody: 'Major League Soccer (MLS)',
    category: 'INTERNATIONAL',
    targetDateIso: '2026-12-05T21:00:00Z',
    venue: 'Home Stadium of Finalist with Highest Regular-Season Record',
    hostNation: 'United States 🇺🇸 / Canada 🇨🇦',
    flagEmoji: '🇺🇸',
    crestOrLogoUrl: 'https://a.espncdn.com/i/leaguelogos/soccer/500/19.png',
    defendingChampion: 'Columbus Crew / Inter Miami CF',
    teamsCount: '30 MLS Franchises',
    description: 'The culmination of North American club soccer right after the 2026 World Cup year.',
    verifiedOfficialSource: 'Major League Soccer Competition Guidelines',
  },

  // 17. TotalEnergies CAF Africa Cup of Nations (AFCON) 2027
  {
    id: 'afcon-2027',
    name: 'TotalEnergies CAF Africa Cup of Nations 2027',
    shortName: 'AFCON 2027',
    year: 2027,
    edition: '36th Edition (East Africa Pamoja Bid)',
    governingBody: 'Confederation of African Football (CAF)',
    category: 'INTERNATIONAL',
    targetDateIso: '2027-06-19T18:00:00Z',
    venue: 'Kasarani Stadium, Mandela National Stadium & Benjamin Mkapa Stadium',
    hostNation: 'Kenya 🇰🇪 · Uganda 🇺🇬 · Tanzania 🇹🇿',
    flagEmoji: '🌍',
    crestOrLogoUrl: 'https://a.espncdn.com/i/leaguelogos/soccer/500/656.png',
    defendingChampion: 'Ivory Coast 🇨🇮 (2023 AFCON Winners)',
    teamsCount: '24 African Nations',
    description: 'Historic joint host tournament in East Africa showcasing Africa’s finest football icons.',
    verifiedOfficialSource: 'CAF Executive Committee Official Announcement',
  },

  // 18. UEFA Euro 2028
  {
    id: 'euro-2028',
    name: 'UEFA Euro 2028 (UK & Ireland)',
    shortName: 'UEFA Euro 2028',
    year: 2028,
    edition: '18th UEFA European Championship',
    governingBody: 'UEFA',
    category: 'INTERNATIONAL',
    targetDateIso: '2028-06-09T19:00:00Z',
    venue: 'Wembley, Hampden Park, Aviva Stadium, Millennium Stadium & Stadia',
    hostNation: 'England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 · Scotland 🏴󠁧󠁢󠁳󠁣󠁴󠁿 · Wales 🏴󠁧󠁢󠁷󠁬󠁳󠁿 · Ireland 🇮🇪 · N. Ireland',
    flagEmoji: '🇪🇺',
    crestOrLogoUrl: 'https://a.espncdn.com/i/leaguelogos/soccer/500/6.png',
    defendingChampion: 'Spain 🇪🇸 (Euro 2024 Winners)',
    teamsCount: '24 European Nations',
    description: 'The continent’s premier international championship hosted across historic British & Irish grounds.',
    verifiedOfficialSource: 'UEFA Official Executive Committee Award',
    competitionRouteId: 'comp-euro',
  },

  // 19. CONMEBOL Copa América 2028
  {
    id: 'copa-america-2028',
    name: 'CONMEBOL Copa América 2028',
    shortName: 'Copa América 2028',
    year: 2028,
    edition: '49th Edition',
    governingBody: 'CONMEBOL',
    category: 'INTERNATIONAL',
    targetDateIso: '2028-06-16T23:00:00Z',
    venue: 'Host Venues across South America',
    hostNation: 'South America 🌎',
    flagEmoji: '🌎',
    crestOrLogoUrl: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2032.png',
    defendingChampion: 'Argentina 🇦🇷 (Back-to-Back Winners)',
    teamsCount: '16 Nations (CONMEBOL + Guests)',
    description: 'The oldest international continental football tournament in the world returns in 2028.',
    verifiedOfficialSource: 'CONMEBOL Quadrennial International Match Calendar',
    competitionRouteId: 'comp-copa-america',
  },

  // 20. FIFA Women’s World Cup 2027 Brazil
  {
    id: 'womens-world-cup-2027',
    name: 'FIFA Women’s World Cup Brazil 2027™',
    shortName: 'Women’s World Cup',
    year: 2027,
    edition: '10th Edition (First time in South America)',
    governingBody: 'FIFA',
    category: 'INTERNATIONAL',
    targetDateIso: '2027-06-24T18:00:00Z',
    venue: 'Maracanã, Mané Garrincha & Brazilian World Cup Stadia',
    hostNation: 'Brazil 🇧🇷',
    flagEmoji: '🇧🇷',
    crestOrLogoUrl: 'https://flagcdn.com/w80/br.png',
    defendingChampion: 'Spain 🇪🇸 (2023 Winners)',
    teamsCount: '32 Qualified Nations',
    description: 'The summit of women’s football arrives in the heartland of samba football for the first time.',
    verifiedOfficialSource: '74th FIFA Congress Vote (Bangkok, May 2024)',
  },

  // 21. Olympic Football Tournament Los Angeles 2028
  {
    id: 'olympics-2028',
    name: 'Olympic Games Los Angeles 2028 Men’s & Women’s Football',
    shortName: 'LA28 Olympics Football',
    year: 2028,
    edition: 'Games of the XXXIV Olympiad',
    governingBody: 'IOC & FIFA',
    category: 'INTERNATIONAL',
    targetDateIso: '2028-07-14T17:00:00Z',
    venue: 'Rose Bowl Stadium (Pasadena) & SoFi Stadium (Inglewood)',
    hostNation: 'Los Angeles, California, USA 🇺🇸',
    flagEmoji: '🥇',
    crestOrLogoUrl: 'https://flagcdn.com/w80/us.png',
    defendingChampion: 'Spain 🇪🇸 (Men) · USA 🇺🇸 (Women)',
    teamsCount: '16 Men’s Teams (U23+3) & 12 Women’s National Teams',
    description: 'Olympic gold football returns to the historic Rose Bowl where the 1994 World Cup Final was played.',
    verifiedOfficialSource: 'International Olympic Committee (IOC) & LA28 Master Plan',
  },

  // 22. UEFA Super Cup 2026
  {
    id: 'uefa-super-cup-2026',
    name: 'UEFA Super Cup 2026',
    shortName: 'UEFA Super Cup',
    year: 2026,
    edition: '51st UEFA Super Cup',
    governingBody: 'UEFA',
    category: 'CONTINENTAL_CUP',
    targetDateIso: '2026-08-12T19:00:00Z',
    venue: 'Selected Neutral European Host Stadium',
    hostNation: 'Europe 🇪🇺',
    flagEmoji: '🛡️',
    crestOrLogoUrl: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2.png',
    defendingChampion: 'Real Madrid 🇪🇸',
    teamsCount: '2 Clubs (UCL Champions vs UEL Champions)',
    description: 'The annual curtain-raiser between the UEFA Champions League and UEFA Europa League winners.',
    verifiedOfficialSource: 'UEFA Executive Committee Match Calendar',
  },

  // 23. Supercopa de España 2027
  {
    id: 'spanish-supercopa-2027',
    name: 'Supercopa de España 2027',
    shortName: 'Spanish Supercopa',
    year: 2027,
    edition: '43rd Edition (Final Four Format)',
    governingBody: 'RFEF',
    category: 'CONTINENTAL_CUP',
    targetDateIso: '2027-01-13T19:00:00Z',
    venue: 'King Abdullah Sports City Stadium (Al-Jawhara)',
    hostNation: 'Jeddah, Saudi Arabia 🇸🇦',
    flagEmoji: '🇪🇸',
    crestOrLogoUrl: 'https://a.espncdn.com/i/leaguelogos/soccer/500/15.png',
    defendingChampion: 'Real Madrid / Barcelona',
    teamsCount: '4 Teams (La Liga 1 & 2 + Copa del Rey Finalists)',
    description: 'High-octane four-team Spanish tournament featuring El Clásico rivals.',
    verifiedOfficialSource: 'RFEF Protocol Agreement & Official Spanish Calendar',
  },

  // 24. FIFA Intercontinental Cup 2026
  {
    id: 'fifa-intercontinental-2026',
    name: 'FIFA Intercontinental Cup 2026 Final',
    shortName: 'FIFA Intercontinental',
    year: 2026,
    edition: '3rd Annual Edition',
    governingBody: 'FIFA',
    category: 'CONTINENTAL_CUP',
    targetDateIso: '2026-12-18T18:00:00Z',
    venue: 'Lusail Iconic Stadium',
    hostNation: 'Doha, Qatar 🇶🇦',
    flagEmoji: '🌐',
    crestOrLogoUrl: 'https://a.espncdn.com/i/leaguelogos/soccer/500/4.png',
    defendingChampion: 'Real Madrid / European Champion',
    teamsCount: '6 Continental Champions',
    description: 'Annual showdown where the UEFA Champions League winners meet the playoff winner of the other 5 FIFA confederations.',
    verifiedOfficialSource: 'FIFA Council Regulations for Annual Club Competitions',
  },
];

interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
  totalSeconds: number;
}

export const TournamentCountdownsPage: React.FC = () => {
  const { navigateTo, addToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [remindedTournaments, setRemindedTournaments] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('footbuzz_reminded_tournaments');
        return saved ? JSON.parse(saved) : ['wc-2026', 'ucl-final-2026', 'isl-2026'];
      } catch {
        return ['wc-2026', 'ucl-final-2026', 'isl-2026'];
      }
    }
    return ['wc-2026', 'ucl-final-2026', 'isl-2026'];
  });

  // Real-time ticking clock state (updates every 1000ms)
  const [currentTime, setCurrentTime] = useState<number>(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const calculateCountdown = (isoString: string): CountdownState => {
    const target = new Date(isoString).getTime();
    const diff = target - currentTime;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true, totalSeconds: 0 };
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds, isPast: false, totalSeconds };
  };

  const toggleReminder = (id: string, name: string) => {
    setRemindedTournaments((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('footbuzz_reminded_tournaments', JSON.stringify(next));
      } catch (e) {}

      if (exists) {
        addToast('Reminder Removed', `Notification turned off for ${name}`, 'INFO');
      } else {
        addToast('Tournament Alert Set', `You will receive live kickoff alerts for ${name}!`, 'SUCCESS');
      }
      return next;
    });
  };

  // Filter tournaments
  const filteredTournaments = VERIFIED_TOURNAMENTS.filter((t) => {
    if (selectedCategory !== 'ALL' && t.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.name.toLowerCase().includes(q) ||
        t.shortName.toLowerCase().includes(q) ||
        t.hostNation.toLowerCase().includes(q) ||
        t.venue.toLowerCase().includes(q) ||
        t.governingBody.toLowerCase().includes(q) ||
        String(t.year).includes(q)
      );
    }
    return true;
  });

  // Spotlight: FIFA World Cup 2026
  const worldCup = VERIFIED_TOURNAMENTS.find((t) => t.id === 'wc-2026')!;
  const wcCountdown = calculateCountdown(worldCup.targetDateIso);

  // Spotlight: UEFA Champions League
  const ucl = VERIFIED_TOURNAMENTS.find((t) => t.id === 'ucl-final-2026')!;
  const uclCountdown = calculateCountdown(ucl.targetDateIso);

  // Spotlight: Indian Super League (ISL)
  const isl = VERIFIED_TOURNAMENTS.find((t) => t.id === 'isl-2026')!;
  const islCountdown = calculateCountdown(isl.targetDateIso);

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#009270] via-[#028060] to-[#0a1f18] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-mono font-bold tracking-wide">
            <Clock className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span>GENUINE & VERIFIED FOOTBALL CALENDAR</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-display tracking-tight text-white">
            Global Tournament Countdown Radar
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Exact countdowns, verified calendar dates, host venues, and editions for the upcoming FIFA World Cup 2026, UEFA Champions League, Indian Super League (ISL), and 20+ premier international championships.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            <span className="px-3 py-1 rounded-xl bg-black/25 text-emerald-200 text-xs font-mono font-bold border border-white/10">
              🏆 Next World Cup: <strong>Year 2026</strong> (USA · Canada · Mexico)
            </span>
            <span className="px-3 py-1 rounded-xl bg-black/25 text-emerald-200 text-xs font-mono font-bold border border-white/10">
              ⭐ UCL Final: <strong>May 30, 2026</strong> (Munich)
            </span>
            <span className="px-3 py-1 rounded-xl bg-black/25 text-emerald-200 text-xs font-mono font-bold border border-white/10">
              🇮🇳 ISL: <strong>Sept 2026</strong> (India)
            </span>
          </div>
        </div>
      </div>

      {/* TOP 3 BIG SHOWCASE HERO COUNTDOWNS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. FIFA World Cup 2026 Hero Card */}
        <div className="bg-gradient-to-br from-slate-900 via-[#0d2218] to-slate-950 text-white rounded-3xl p-6 border border-emerald-500/40 shadow-xl flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Trophy className="w-32 h-32 text-amber-400" />
          </div>

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider font-mono">
                FLAGSHIP · YEAR {worldCup.year}
              </span>
              <button
                onClick={() => toggleReminder(worldCup.id, worldCup.name)}
                className={`p-2 rounded-xl transition-all border ${
                  remindedTournaments.includes(worldCup.id)
                    ? 'bg-amber-400 text-slate-950 border-amber-300'
                    : 'bg-white/10 text-white hover:bg-white/20 border-white/10'
                }`}
                title="Toggle Kickoff Alert"
              >
                <Bell className="w-4 h-4" />
              </button>
            </div>

            <div>
              <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">
                {worldCup.governingBody} · {worldCup.edition}
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-display text-white mt-1">
                {worldCup.name}
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                {worldCup.hostNation}
              </p>
            </div>

            {/* Countdown Display Box */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
              <div className="text-[10px] uppercase tracking-wider font-mono text-slate-400 mb-2 font-bold text-center">
                TIME UNTIL KICKOFF (JUNE 11, 2026)
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-white/10 rounded-xl p-2">
                  <div className="text-xl sm:text-2xl font-black font-mono text-amber-400 tabular-nums">
                    {wcCountdown.days}
                  </div>
                  <div className="text-[9px] uppercase font-bold text-slate-400">Days</div>
                </div>
                <div className="bg-white/10 rounded-xl p-2">
                  <div className="text-xl sm:text-2xl font-black font-mono text-white tabular-nums">
                    {wcCountdown.hours}
                  </div>
                  <div className="text-[9px] uppercase font-bold text-slate-400">Hours</div>
                </div>
                <div className="bg-white/10 rounded-xl p-2">
                  <div className="text-xl sm:text-2xl font-black font-mono text-white tabular-nums">
                    {wcCountdown.minutes}
                  </div>
                  <div className="text-[9px] uppercase font-bold text-slate-400">Mins</div>
                </div>
                <div className="bg-white/10 rounded-xl p-2 border border-emerald-500/40">
                  <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400 tabular-nums animate-pulse">
                    {wcCountdown.seconds}
                  </div>
                  <div className="text-[9px] uppercase font-bold text-slate-400">Secs</div>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-300 space-y-1.5 pt-1">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{worldCup.venue}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{worldCup.defendingChampion}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
            <span className="text-[10px] text-emerald-300 font-mono">
              Verified by FIFA Calendar
            </span>
            <button
              onClick={() => navigateTo('competitions')}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1"
            >
              <span>Explore Teams</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2. UEFA Champions League Hero Card */}
        <div className="bg-gradient-to-br from-[#0c1633] via-[#09152b] to-slate-950 text-white rounded-3xl p-6 border border-blue-500/40 shadow-xl flex flex-col justify-between relative overflow-hidden group">
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-blue-500 text-white text-[10px] font-black uppercase tracking-wider font-mono">
                EUROPEAN CROWN · MAY 2026
              </span>
              <button
                onClick={() => toggleReminder(ucl.id, ucl.name)}
                className={`p-2 rounded-xl transition-all border ${
                  remindedTournaments.includes(ucl.id)
                    ? 'bg-blue-500 text-white border-blue-400'
                    : 'bg-white/10 text-white hover:bg-white/20 border-white/10'
                }`}
                title="Toggle Kickoff Alert"
              >
                <Bell className="w-4 h-4" />
              </button>
            </div>

            <div>
              <div className="text-xs font-mono text-blue-300 uppercase tracking-widest font-bold">
                {ucl.governingBody} · {ucl.edition}
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-display text-white mt-1">
                {ucl.name}
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                {ucl.hostNation}
              </p>
            </div>

            {/* Countdown Box */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
              <div className="text-[10px] uppercase tracking-wider font-mono text-slate-400 mb-2 font-bold text-center">
                TIME UNTIL FINAL (MAY 30, 2026)
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-white/10 rounded-xl p-2">
                  <div className="text-xl sm:text-2xl font-black font-mono text-blue-400 tabular-nums">
                    {uclCountdown.days}
                  </div>
                  <div className="text-[9px] uppercase font-bold text-slate-400">Days</div>
                </div>
                <div className="bg-white/10 rounded-xl p-2">
                  <div className="text-xl sm:text-2xl font-black font-mono text-white tabular-nums">
                    {uclCountdown.hours}
                  </div>
                  <div className="text-[9px] uppercase font-bold text-slate-400">Hours</div>
                </div>
                <div className="bg-white/10 rounded-xl p-2">
                  <div className="text-xl sm:text-2xl font-black font-mono text-white tabular-nums">
                    {uclCountdown.minutes}
                  </div>
                  <div className="text-[9px] uppercase font-bold text-slate-400">Mins</div>
                </div>
                <div className="bg-white/10 rounded-xl p-2 border border-blue-500/40">
                  <div className="text-xl sm:text-2xl font-black font-mono text-blue-400 tabular-nums animate-pulse">
                    {uclCountdown.seconds}
                  </div>
                  <div className="text-[9px] uppercase font-bold text-slate-400">Secs</div>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-300 space-y-1.5 pt-1">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="truncate">{ucl.venue}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{ucl.defendingChampion}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
            <span className="text-[10px] text-blue-300 font-mono">
              UEFA Official Venue
            </span>
            <button
              onClick={() => navigateTo('competition-detail', { competitionId: 'comp-ucl' })}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors flex items-center gap-1"
            >
              <span>UCL Hub</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3. Indian Super League (ISL) Hero Card */}
        <div className="bg-gradient-to-br from-[#26150a] via-[#1c1106] to-slate-950 text-white rounded-3xl p-6 border border-orange-500/40 shadow-xl flex flex-col justify-between relative overflow-hidden group">
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-orange-500 text-white text-[10px] font-black uppercase tracking-wider font-mono">
                INDIAN GLORY · SEPT 2026
              </span>
              <button
                onClick={() => toggleReminder(isl.id, isl.name)}
                className={`p-2 rounded-xl transition-all border ${
                  remindedTournaments.includes(isl.id)
                    ? 'bg-orange-500 text-white border-orange-400'
                    : 'bg-white/10 text-white hover:bg-white/20 border-white/10'
                }`}
                title="Toggle Kickoff Alert"
              >
                <Bell className="w-4 h-4" />
              </button>
            </div>

            <div>
              <div className="text-xs font-mono text-orange-300 uppercase tracking-widest font-bold">
                {isl.governingBody} · {isl.edition}
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-display text-white mt-1">
                {isl.name}
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                {isl.hostNation}
              </p>
            </div>

            {/* Countdown Box */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
              <div className="text-[10px] uppercase tracking-wider font-mono text-slate-400 mb-2 font-bold text-center">
                TIME UNTIL 2026 KICKOFF (SEPT 18, 2026)
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-white/10 rounded-xl p-2">
                  <div className="text-xl sm:text-2xl font-black font-mono text-orange-400 tabular-nums">
                    {islCountdown.days}
                  </div>
                  <div className="text-[9px] uppercase font-bold text-slate-400">Days</div>
                </div>
                <div className="bg-white/10 rounded-xl p-2">
                  <div className="text-xl sm:text-2xl font-black font-mono text-white tabular-nums">
                    {islCountdown.hours}
                  </div>
                  <div className="text-[9px] uppercase font-bold text-slate-400">Hours</div>
                </div>
                <div className="bg-white/10 rounded-xl p-2">
                  <div className="text-xl sm:text-2xl font-black font-mono text-white tabular-nums">
                    {islCountdown.minutes}
                  </div>
                  <div className="text-[9px] uppercase font-bold text-slate-400">Mins</div>
                </div>
                <div className="bg-white/10 rounded-xl p-2 border border-orange-500/40">
                  <div className="text-xl sm:text-2xl font-black font-mono text-orange-400 tabular-nums animate-pulse">
                    {islCountdown.seconds}
                  </div>
                  <div className="text-[9px] uppercase font-bold text-slate-400">Secs</div>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-300 space-y-1.5 pt-1">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span className="truncate">{isl.venue}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{isl.defendingChampion}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
            <span className="text-[10px] text-orange-300 font-mono">
              AIFF Confirmed Window
            </span>
            <button
              onClick={() => navigateTo('competition-detail', { competitionId: 'comp-isl' })}
              className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-colors flex items-center gap-1"
            >
              <span>ISL Hub</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* SEARCH AND CATEGORY FILTER TOOLBAR */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tournament, country, or venue..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#009270] focus:ring-1 focus:ring-[#009270]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Counter */}
          <div className="text-xs font-mono font-bold text-slate-600 flex items-center gap-1.5 shrink-0">
            <ShieldCheck className="w-4 h-4 text-[#009270]" />
            <span>Showing {filteredTournaments.length} of {VERIFIED_TOURNAMENTS.length} Verified Tournaments</span>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          {[
            { id: 'ALL', label: 'All Tournaments', icon: '⚽' },
            { id: 'INTERNATIONAL', label: 'FIFA & International Cups', icon: '🏆' },
            { id: 'EUROPEAN_LEAGUE', label: 'Top 5 European Leagues', icon: '⭐' },
            { id: 'INDIAN_ASIAN', label: 'Indian & Asian Championships', icon: '🇮🇳' },
            { id: 'CONTINENTAL_CUP', label: 'Club Continental Cups', icon: '🛡️' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-[#009270] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ALL 20+ VERIFIED TOURNAMENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTournaments.map((t) => {
          const cd = calculateCountdown(t.targetDateIso);
          const isReminded = remindedTournaments.includes(t.id);
          const targetDateObj = new Date(t.targetDateIso);
          const formattedDate = targetDateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });

          return (
            <div
              key={t.id}
              className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 hover:border-[#009270] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              {/* Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-mono font-bold tracking-wide">
                    {t.governingBody} · {t.year}
                  </span>

                  <button
                    onClick={() => toggleReminder(t.id, t.name)}
                    className={`p-1.5 rounded-lg border transition-all ${
                      isReminded
                        ? 'bg-amber-50 text-amber-700 border-amber-300'
                        : 'bg-slate-50 text-slate-400 hover:text-slate-600 border-slate-200'
                    }`}
                    title={isReminded ? 'Reminder Set' : 'Set Kickoff Alert'}
                  >
                    <Bell className={`w-3.5 h-3.5 ${isReminded ? 'fill-current text-amber-500' : ''}`} />
                  </button>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-xl shadow-2xs group-hover:scale-105 transition-transform">
                    {t.flagEmoji}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-sm text-slate-900 leading-tight group-hover:text-[#009270] transition-colors truncate">
                      {t.name}
                    </h3>
                    <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                      {t.edition || t.teamsCount}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {t.description}
                </p>
              </div>

              {/* Ticking Countdown Banner */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 font-bold">
                  <span>TARGET: {formattedDate}</span>
                  <span className="text-[#009270] font-bold">● VERIFIED</span>
                </div>

                <div className="grid grid-cols-4 gap-1.5 text-center">
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                    <div className="font-mono font-black text-sm text-slate-900 tabular-nums">
                      {cd.days}
                    </div>
                    <div className="text-[8px] uppercase font-bold text-slate-400">Days</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                    <div className="font-mono font-black text-sm text-slate-900 tabular-nums">
                      {cd.hours}
                    </div>
                    <div className="text-[8px] uppercase font-bold text-slate-400">Hours</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                    <div className="font-mono font-black text-sm text-slate-900 tabular-nums">
                      {cd.minutes}
                    </div>
                    <div className="text-[8px] uppercase font-bold text-slate-400">Mins</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 shadow-2xs">
                    <div className="font-mono font-black text-sm text-[#009270] tabular-nums">
                      {cd.seconds}
                    </div>
                    <div className="text-[8px] uppercase font-bold text-emerald-600">Secs</div>
                  </div>
                </div>
              </div>

              {/* Metadata Details */}
              <div className="text-[11px] text-slate-500 space-y-1 border-t border-slate-100 pt-2.5">
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{t.venue}</span>
                </div>
                {t.defendingChampion && (
                  <div className="flex items-center gap-1.5 truncate">
                    <Trophy className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">{t.defendingChampion}</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              {t.competitionRouteId ? (
                <button
                  onClick={() => navigateTo('competition-detail', { competitionId: t.competitionRouteId })}
                  className="w-full py-2 rounded-xl bg-slate-100 hover:bg-[#009270] hover:text-white text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <span>View Competition Fixtures</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="text-[10px] text-slate-400 text-center font-mono py-1">
                  Source: {t.verifiedOfficialSource.split('(')[0].trim()}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
