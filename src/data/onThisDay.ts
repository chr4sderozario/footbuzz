/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OnThisDayEvent } from '../types/football.js';

export const ON_THIS_DAY_EVENTS: OnThisDayEvent[] = [
  {
    id: 'otd-1',
    dateStr: '10-03',
    year: 1965,
    title: 'Pelé Scores 4 Goals for Santos Against Portuguesa Santista',
    type: 'MATCH',
    description: 'In a breathtaking display of football mastery in the Campeonato Paulista, Pelé scored four goals in a single match, showcasing his unmatched heading ability and 30-yard free-kicks.',
    relatedPlayerId: 'player-pele',
  },
  {
    id: 'otd-2',
    dateStr: '10-03',
    year: 2015,
    title: 'Sergio Agüero Scores 5 Goals in 20 Minutes vs Newcastle',
    type: 'RECORD',
    description: 'Manchester City striker Sergio Agüero equaled the Premier League record by scoring five sensational goals against Newcastle United in just 20 minutes (42nd to 62nd minute).',
    relatedTeamId: 'team-mancity',
  },
  {
    id: 'otd-3',
    dateStr: '10-03',
    year: 1999,
    title: 'Arsenal Snatches North London Derby with Kanu Wonder Goal',
    type: 'MATCH',
    description: 'Nwankwo Kanu flicked the ball over defender Luke Young with his back to goal before volleying into the top corner in an unforgettable North London Derby moment.',
    relatedTeamId: 'team-arsenal',
  },
  {
    id: 'otd-4',
    dateStr: '10-03',
    year: 2021,
    title: 'Liverpool & Man City Play Out 2-2 Premier League Masterpiece',
    type: 'MATCH',
    description: 'Mohamed Salah produced one of the greatest individual solo goals in Premier League history, dancing past four City defenders at Anfield in an electrifying 2-2 draw.',
    relatedTeamId: 'team-liverpool',
  },
  {
    id: 'otd-5',
    dateStr: '10-04',
    year: 2008,
    title: 'Cristiano Ronaldo Scores 100th Goal for Manchester United',
    type: 'RECORD',
    description: 'Cristiano Ronaldo curled in two blistering free-kicks against Stoke City to reach his centenary milestone of 100 goals for Manchester United.',
    relatedPlayerId: 'player-ronaldo-cr7',
  },
  {
    id: 'otd-6',
    dateStr: '10-02',
    year: 1982,
    title: 'Diego Maradona Scores His First Hat-Trick in Europe for Barcelona',
    type: 'MATCH',
    description: 'In only his fifth appearance in Spanish football, Diego Maradona netted a scintillating hat-trick for Barcelona against Las Palmas.',
    relatedPlayerId: 'player-maradona',
  },
];
