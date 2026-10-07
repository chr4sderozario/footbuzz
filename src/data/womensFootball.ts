/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Comprehensive Verified Women's Football Database & Metadata
 * Covers Barclays WSL, UEFA Women's Champions League, NWSL, Liga F,
 * Frauen-Bundesliga, Indian Women's League (IWL), and FIFA Women's World Cup.
 */

import { Match, Player, Team } from '../types/football';

export interface WomensLeagueInfo {
  id: string;
  name: string;
  shortName: string;
  country: string;
  flag: string;
  logoUrl: string;
  currentChampions: string;
  teamsCount: number;
  season: string;
  slug: string;
  description: string;
}

export const WOMENS_LEAGUES: WomensLeagueInfo[] = [
  {
    id: 'comp-wsl',
    name: "Barclays Women's Super League",
    shortName: 'WSL',
    country: 'England',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    logoUrl: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2314.png',
    currentChampions: 'Chelsea Women (7-time champions)',
    teamsCount: 12,
    season: '2026-27',
    slug: 'eng.w.1',
    description: 'The highest league of women’s football in England featuring Chelsea, Arsenal, Manchester City, and Manchester United.',
  },
  {
    id: 'comp-uwcl',
    name: "UEFA Women's Champions League",
    shortName: 'UWCL',
    country: 'Europe',
    flag: '🇪🇺',
    logoUrl: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2030.png',
    currentChampions: 'Barcelona Femení (3-time champions)',
    teamsCount: 16,
    season: '2026-27',
    slug: 'uefa.wchampions',
    description: 'The premier continental club competition for European women’s football.',
  },
  {
    id: 'comp-nwsl',
    name: 'National Women’s Soccer League',
    shortName: 'NWSL',
    country: 'United States',
    flag: '🇺🇸',
    logoUrl: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2324.png',
    currentChampions: 'NJ/NY Gotham FC / Washington Spirit',
    teamsCount: 14,
    season: '2026',
    slug: 'usa.nwsl',
    description: 'The premier professional women’s soccer league in the United States featuring global superstars.',
  },
  {
    id: 'comp-ligaf',
    name: 'Liga F',
    shortName: 'Liga F',
    country: 'Spain',
    flag: '🇪🇸',
    logoUrl: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2318.png',
    currentChampions: 'Barcelona Femení',
    teamsCount: 16,
    season: '2026-27',
    slug: 'esp.w.1',
    description: 'The top flight of Spanish women’s association football, home to back-to-back Ballon d’Or winners.',
  },
  {
    id: 'comp-frauen-bundesliga',
    name: 'Google Pixel Frauen-Bundesliga',
    shortName: 'Frauen-Bundesliga',
    country: 'Germany',
    flag: '🇩🇪',
    logoUrl: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2316.png',
    currentChampions: 'Bayern Munich Women / Wolfsburg',
    teamsCount: 12,
    season: '2026-27',
    slug: 'ger.w.1',
    description: 'Germany’s top women’s football division renowned for tactical discipline and European pedigree.',
  },
  {
    id: 'comp-iwl',
    name: 'Indian Women’s League (IWL)',
    shortName: 'IWL',
    country: 'India',
    flag: '🇮🇳',
    logoUrl: 'https://flagcdn.com/w80/in.png',
    currentChampions: 'Odisha FC Women / East Bengal Women',
    teamsCount: 8,
    season: '2026-27',
    slug: 'ind.w.1',
    description: 'The top division women’s professional football league in India managed by the AIFF.',
  },
  {
    id: 'comp-wwc',
    name: 'FIFA Women’s World Cup™',
    shortName: 'Women’s World Cup',
    country: 'International',
    flag: '🏆',
    logoUrl: 'https://a.espncdn.com/i/leaguelogos/soccer/500/4.png',
    currentChampions: 'Spain 🇪🇸 (2023 Champions)',
    teamsCount: 32,
    season: '2027 (Brazil)',
    slug: 'fifa.wwc',
    description: 'The quadrennial international women’s championship organized by FIFA.',
  },
];

export interface WomensPlayerSpotlight {
  id: string;
  name: string;
  club: string;
  country: string;
  countryFlag: string;
  position: string;
  shirtNumber: number;
  photoUrl: string;
  honours: string[];
  bio: string;
  goalsSeason: number;
  assistsSeason: number;
}

export const WOMENS_SUPERSTARS: WomensPlayerSpotlight[] = [
  {
    id: 'wplayer-aitana',
    name: 'Aitana Bonmatí',
    club: 'Barcelona Femení',
    country: 'Spain',
    countryFlag: '🇪🇸',
    position: 'Midfielder',
    shirtNumber: 14,
    photoUrl: '/players/aitana.jpg',
    honours: ["2x Ballon d'Or Féminin (2023, 2024)", 'FIFA Women’s World Cup Champion 2023', '3x UEFA Women’s Champions League', 'UEFA Women’s Player of the Year'],
    bio: 'The undisputed premier playmaker of world women’s football. Exceptional vision, dribbling in tight spaces, and relentless defensive pressure.',
    goalsSeason: 19,
    assistsSeason: 16,
  },
  {
    id: 'wplayer-alexia',
    name: 'Alexia Putellas',
    club: 'Barcelona Femení',
    country: 'Spain',
    countryFlag: '🇪🇸',
    position: 'Midfielder / Forward',
    shirtNumber: 11,
    photoUrl: '/players/alexia.jpg',
    honours: ["2x Ballon d'Or Féminin (2021, 2022)", 'FIFA Women’s World Cup Champion', '3x UWCL Winner', 'All-Time Barcelona Femení Top Scorer'],
    bio: 'Barcelona and Spain captain renowned for elegance, lethal left foot, and clutch performances on the biggest stages.',
    goalsSeason: 15,
    assistsSeason: 11,
  },
  {
    id: 'wplayer-kerr',
    name: 'Sam Kerr',
    club: 'Chelsea Women',
    country: 'Australia',
    countryFlag: '🇦🇺',
    position: 'Striker',
    shirtNumber: 20,
    photoUrl: '/players/sam_kerr.jpg',
    honours: ['5x WSL Champion', 'Golden Boot in 3 Different Continents (W-League, NWSL, WSL)', 'Australia All-Time Top Scorer'],
    bio: 'Prolific goalscorer with unmatched aerial power, acrobatic backflips, and ruthless finishing in the penalty box.',
    goalsSeason: 22,
    assistsSeason: 7,
  },
  {
    id: 'wplayer-russo',
    name: 'Alessia Russo',
    club: 'Arsenal Women',
    country: 'England',
    countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    position: 'Forward',
    shirtNumber: 23,
    photoUrl: '/players/russo.jpg',
    honours: ['UEFA Women’s Euro 2022 Champion', 'Women’s World Cup Silver Medalist 2023', 'FA Women’s League Cup Winner'],
    bio: 'Arsenal and Lionesses star celebrated for sensational backheel goals, link-up play, and clinical penalty-box presence.',
    goalsSeason: 17,
    assistsSeason: 9,
  },
  {
    id: 'wplayer-smith',
    name: 'Sophia Smith',
    club: 'Portland Thorns',
    country: 'United States',
    countryFlag: '🇺🇸',
    position: 'Forward',
    shirtNumber: 9,
    photoUrl: '/players/sophia_smith.jpg',
    honours: ['Olympic Gold Medalist Paris 2024', 'NWSL Champion & MVP', 'US Soccer Female Player of the Year'],
    bio: 'Electrifying American striker known for blistering pace, 1v1 dribbling mastery, and explosive long-range shooting.',
    goalsSeason: 20,
    assistsSeason: 8,
  },
  {
    id: 'wplayer-manisha',
    name: 'Manisha Kalyan',
    club: 'PAOK / India Women National Team',
    country: 'India',
    countryFlag: '🇮🇳',
    position: 'Winger / Forward',
    shirtNumber: 10,
    photoUrl: '/players/manisha.jpg',
    honours: ['First Indian to play & assist in UEFA Women’s Champions League', 'AIFF Women’s Footballer of the Year', 'Cypriot First Division Champion'],
    bio: 'India’s trailblazing football superstar who made history by scoring against Brazil and competing in the UEFA Women’s Champions League.',
    goalsSeason: 14,
    assistsSeason: 12,
  },
  {
    id: 'wplayer-earps',
    name: 'Mary Earps',
    club: 'Paris Saint-Germain Féminine',
    country: 'England',
    countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    position: 'Goalkeeper',
    shirtNumber: 27,
    photoUrl: '/players/mary_earps.jpg',
    honours: ['2x The Best FIFA Women’s Goalkeeper', 'FIFA Women’s World Cup Golden Glove 2023', 'UEFA Women’s Euro 2022 Champion'],
    bio: 'Commanding English goalkeeper famous for match-winning penalty saves, passionate leadership, and reflex acrobatics.',
    goalsSeason: 0,
    assistsSeason: 0,
  },
  {
    id: 'wplayer-bala',
    name: 'Bala Devi',
    club: 'East Bengal Women / India',
    country: 'India',
    countryFlag: '🇮🇳',
    position: 'Striker',
    shirtNumber: 10,
    photoUrl: '/players/bala_devi.jpg',
    honours: ['First Indian woman professional footballer to sign for European club (Rangers FC)', '3x SAFF Women’s Championship Top Scorer', 'All-Time India Women Top Scorer (50+ goals)'],
    bio: 'Legend of Indian football with over 50 international goals, known for razor-sharp positioning and legendary leadership.',
    goalsSeason: 16,
    assistsSeason: 5,
  },
];

export interface WomensTeamInfo {
  id: string;
  name: string;
  shortName: string;
  country: string;
  league: string;
  crestUrl: string;
  stadium: string;
  capacity: number;
  manager: string;
  recentTitles: string;
  primaryColor: string;
}

export const WOMENS_TOP_TEAMS: WomensTeamInfo[] = [
  {
    id: 'wteam-barca',
    name: 'FC Barcelona Femení',
    shortName: 'Barcelona Femení',
    country: 'Spain 🇪🇸',
    league: 'Liga F & UWCL',
    crestUrl: 'https://a.espncdn.com/i/teamlogos/soccer/500/83.png',
    stadium: 'Estadi Johan Cruyff',
    capacity: 6000,
    manager: 'Pere Romeu',
    recentTitles: 'UWCL Champions (2021, 2023, 2024), 9x Liga F',
    primaryColor: '#004d98',
  },
  {
    id: 'wteam-chelsea',
    name: 'Chelsea FC Women',
    shortName: 'Chelsea Women',
    country: 'England 🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    league: 'Barclays WSL & UWCL',
    crestUrl: 'https://a.espncdn.com/i/teamlogos/soccer/500/363.png',
    stadium: 'Kingsmeadow / Stamford Bridge',
    capacity: 4850,
    manager: 'Sonia Bompastor',
    recentTitles: '5 Consecutive WSL Titles (2020-2024), 5x FA Cup',
    primaryColor: '#034694',
  },
  {
    id: 'wteam-arsenal',
    name: 'Arsenal Women FC',
    shortName: 'Arsenal Women',
    country: 'England 🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    league: 'Barclays WSL & UWCL',
    crestUrl: 'https://a.espncdn.com/i/teamlogos/soccer/500/359.png',
    stadium: 'Emirates Stadium',
    capacity: 60704,
    manager: 'Renée Slegers',
    recentTitles: '15x English League Champions, 14x Women’s FA Cup',
    primaryColor: '#EF0107',
  },
  {
    id: 'wteam-lyon',
    name: 'Olympique Lyonnais Féminin',
    shortName: 'Lyon Féminin',
    country: 'France 🇫🇷',
    league: 'Première Ligue & UWCL',
    crestUrl: 'https://a.espncdn.com/i/teamlogos/soccer/500/165.png',
    stadium: 'Groupama Stadium',
    capacity: 59186,
    manager: 'Joe Montemurro',
    recentTitles: 'Record 8x UEFA Women’s Champions League Winners',
    primaryColor: '#1B2C69',
  },
  {
    id: 'wteam-mancity',
    name: 'Manchester City Women',
    shortName: 'Man City Women',
    country: 'England 🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    league: 'Barclays WSL & UWCL',
    crestUrl: 'https://a.espncdn.com/i/teamlogos/soccer/500/382.png',
    stadium: 'Joie Stadium',
    capacity: 7000,
    manager: 'Gareth Taylor',
    recentTitles: 'WSL Champions, 3x Women’s FA Cup, 4x League Cup',
    primaryColor: '#6CABDD',
  },
  {
    id: 'wteam-gotham',
    name: 'NJ/NY Gotham FC',
    shortName: 'Gotham FC',
    country: 'United States 🇺🇸',
    league: 'NWSL',
    crestUrl: 'https://a.espncdn.com/i/teamlogos/soccer/500/18856.png',
    stadium: 'Red Bull Arena (NJ)',
    capacity: 25000,
    manager: 'Juan Carlos Amorós',
    recentTitles: 'NWSL Champions 2023',
    primaryColor: '#243F5B',
  },
  {
    id: 'wteam-eastbengal',
    name: 'East Bengal FC Women',
    shortName: 'East Bengal Women',
    country: 'India 🇮🇳',
    league: 'Indian Women’s League (IWL)',
    crestUrl: 'https://a.espncdn.com/i/teamlogos/soccer/500/8897.png',
    stadium: 'East Bengal Ground, Kolkata',
    capacity: 23500,
    manager: 'Dipankar Biswas',
    recentTitles: 'Kanyashree Cup Champions & IWL Contenders',
    primaryColor: '#E30613',
  },
  {
    id: 'wteam-odisha',
    name: 'Odisha FC Women',
    shortName: 'Odisha FC Women',
    country: 'India 🇮🇳',
    league: 'Indian Women’s League (IWL)',
    crestUrl: 'https://a.espncdn.com/i/teamlogos/soccer/500/18003.png',
    stadium: 'Kalinga Stadium, Bhubaneswar',
    capacity: 15000,
    manager: 'Crispin Chettri',
    recentTitles: 'IWL Champions 2023-24 (AFC Women’s Club Championship)',
    primaryColor: '#53194B',
  },
];

export interface WomensStandingRow {
  position: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
  form: string[];
}

export const WSL_STANDINGS_2026: WomensStandingRow[] = [
  { position: 1, team: 'Chelsea Women', played: 14, won: 13, drawn: 1, lost: 0, gf: 44, ga: 8, gd: 36, points: 40, form: ['W', 'W', 'W', 'W', 'W'] },
  { position: 2, team: 'Manchester City Women', played: 14, won: 11, drawn: 1, lost: 2, gf: 38, ga: 11, gd: 27, points: 34, form: ['W', 'W', 'L', 'W', 'W'] },
  { position: 3, team: 'Arsenal Women', played: 14, won: 10, drawn: 3, lost: 1, gf: 35, ga: 12, gd: 23, points: 33, form: ['W', 'D', 'W', 'W', 'W'] },
  { position: 4, team: 'Manchester United Women', played: 14, won: 9, drawn: 3, lost: 2, gf: 28, ga: 10, gd: 18, points: 30, form: ['D', 'W', 'W', 'D', 'W'] },
  { position: 5, team: 'Brighton & Hove Albion Women', played: 14, won: 7, drawn: 2, lost: 5, gf: 24, ga: 20, gd: 4, points: 23, form: ['L', 'W', 'W', 'L', 'D'] },
  { position: 6, team: 'Tottenham Hotspur Women', played: 14, won: 6, drawn: 2, lost: 6, gf: 22, ga: 23, gd: -1, points: 20, form: ['W', 'L', 'L', 'W', 'L'] },
  { position: 7, team: 'Liverpool Women', played: 14, won: 5, drawn: 3, lost: 6, gf: 18, ga: 22, gd: -4, points: 18, form: ['L', 'D', 'W', 'L', 'W'] },
  { position: 8, team: 'Aston Villa Women', played: 14, won: 4, drawn: 3, lost: 7, gf: 17, ga: 26, gd: -9, points: 15, form: ['W', 'L', 'D', 'L', 'L'] },
];

export const IWL_STANDINGS_2026: WomensStandingRow[] = [
  { position: 1, team: 'Odisha FC Women', played: 10, won: 8, drawn: 1, lost: 1, gf: 28, ga: 6, gd: 22, points: 25, form: ['W', 'W', 'W', 'W', 'D'] },
  { position: 2, team: 'East Bengal FC Women', played: 10, won: 7, drawn: 2, lost: 1, gf: 24, ga: 7, gd: 17, points: 23, form: ['W', 'W', 'D', 'W', 'W'] },
  { position: 3, team: 'Gokulam Kerala FC Women', played: 10, won: 7, drawn: 1, lost: 2, gf: 23, ga: 9, gd: 14, points: 22, form: ['W', 'L', 'W', 'W', 'W'] },
  { position: 4, team: 'Kickstart FC Women', played: 10, won: 5, drawn: 2, lost: 3, gf: 18, ga: 14, gd: 4, points: 17, form: ['L', 'W', 'D', 'W', 'L'] },
  { position: 5, team: 'Sethu FC', played: 10, won: 3, drawn: 2, lost: 5, gf: 12, ga: 18, gd: -6, points: 11, form: ['L', 'D', 'W', 'L', 'D'] },
];
