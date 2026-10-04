/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FootballConcept } from '../types/football.js';

export const FOOTBALL_CONCEPTS: FootballConcept[] = [
  {
    id: 'concept-433',
    name: '4-3-3 System',
    category: 'formation',
    shortDesc: 'A balanced attacking structure emphasizing wing play, triangles, and midfield control.',
    explanation: 'The 4-3-3 consists of four defenders (two fullbacks and two centre-backs), three central midfielders (typically one deep pivot and two interior 8s), and three forwards (two wingers hugging the touchline or cutting inside, and a central striker). It is the backbone of modern positional play.',
    origin: 'Popularized in Dutch Total Football and Brazilian World Cup winning sides in the 1960s and 1970s.',
    keyPrinciples: [
      'Natural passing triangles across all thirds of the pitch',
      'High pressing with front three closing down opposing backlines',
      'Wide wingers isolating fullbacks in 1v1 duels',
      'Deep pivot anchoring transitions and recycling possession',
    ],
    famousTeamsOrManagers: ['Pep Guardiola (Barcelona / Man City)', 'Jürgen Klopp (Liverpool)', 'Rinus Michels (Ajax / Netherlands)'],
    formationStructure: '4-3-3',
  },
  {
    id: 'concept-false9',
    name: 'The False Nine',
    category: 'player_role',
    shortDesc: 'A centre-forward who drops deep into midfield rather than pinning the opposition centre-backs.',
    explanation: 'Unlike a traditional target man who stays high against the defensive line, a False 9 drops into the space between the midfield and defence ("the hole"). This creates a dilemma for centre-backs: step out of position to follow the striker (leaving space behind for wingers to exploit) or stay back and concede numerical superiority in midfield.',
    origin: 'Pioneered by Matthias Sindelar in the 1930s Austrian Wunderteam, Nandor Hidegkuti with Hungary 1953, and modernized by Pep Guardiola with Lionel Messi in 2009.',
    keyPrinciples: [
      'Creates 4v3 or 5v3 numerical overloads in the central midfield zone',
      'Wide wingers make diagonal penetrating runs into vacated central space',
      'Requires elite first touch, vision, and passing range from the centre-forward',
    ],
    famousTeamsOrManagers: ['Lionel Messi under Pep Guardiola (2009–2012)', 'Roberto Firmino at Liverpool', 'Cesc Fàbregas for Spain (Euro 2012)'],
  },
  {
    id: 'concept-gegenpressing',
    name: 'Gegenpressing (Counter-Pressing)',
    category: 'tactical_philosophy',
    shortDesc: 'Immediately hunting and winning the ball back within seconds of losing possession.',
    explanation: 'Instead of retreating into a defensive shape after losing the ball, the team instantly swarms the ball carrier with 3 to 4 players within 5–8 seconds. The rationale is that the opponent is at their most vulnerable disorganization immediately after regaining possession.',
    origin: 'Developed in Germany by Ralf Rangnick, Wolfgang Frank, and perfected by Jürgen Klopp at Borussia Dortmund and Liverpool.',
    keyPrinciples: [
      'Immediate hunting impulse within the "5-second rule"',
      'Cut off passing escape lanes rather than merely tackling',
      '"No playmaker in the world can be as good as a good counter-pressing situation" — Jürgen Klopp',
    ],
    famousTeamsOrManagers: ['Jürgen Klopp (Borussia Dortmund & Liverpool)', 'Ralf Rangnick', 'Marcelo Bielsa'],
  },
  {
    id: 'concept-box-midfield',
    name: 'Box Midfield (3-2-4-1)',
    category: 'formation',
    shortDesc: 'A dual-pivot and dual-number-10 midfield rectangle dominating the central channel.',
    explanation: 'In possession, a full-back or centre-back steps up into midfield to form a 2-man base alongside the holding midfielder, while the two attacking midfielders push high in the half-spaces behind the striker. This forms a 3-2-4-1 or 3-2-2-3 structure that overloads 4v2 or 4v3 against traditional midfield lines.',
    origin: 'Derived from Herbert Chapman’s 1920s W-M formation, modernly resurrected by Pep Guardiola at Manchester City.',
    keyPrinciples: [
      'Inverting a defender (e.g. John Stones or Trent Alexander-Arnold) into midfield',
      'Dominates half-spaces between opposition midfield and defense',
      'Rest-defense security with 3 center-backs and 2 pivots stopping counters',
    ],
    famousTeamsOrManagers: ['Pep Guardiola (Man City 2022/23 Treble)', 'Mikel Arteta (Arsenal)', 'Xabi Alonso (Bayer Leverkusen)'],
  },
  {
    id: 'concept-low-block',
    name: 'Low Block & Defensive Rest',
    category: 'tactical_philosophy',
    shortDesc: 'A compact defensive shape positioned deep inside one\'s own defensive third.',
    explanation: 'A team using a low block sets their defensive and midfield lines deep near their 18-yard box, minimizing space between lines and denying the opponent room to run in behind. The goal is to force the opposition out wide into low-probability crosses, then strike via rapid vertical counter-attacks.',
    origin: 'Italian Catenaccio traditions, perfected in modern eras by José Mourinho and Diego Simeone.',
    keyPrinciples: [
      'Extreme vertical and horizontal compactness (< 25 meters between front and back lines)',
      'Protect central channels and penalty area at all costs',
      'Rapid vertical transitions upon winning the ball',
    ],
    famousTeamsOrManagers: ['Diego Simeone (Atlético Madrid)', 'José Mourinho (Inter Milan 2010 / Chelsea 2004–2006)', 'Claudio Ranieri (Leicester City 2016)'],
  },
  {
    id: 'concept-inverted-fullback',
    name: 'Inverted Fullback',
    category: 'player_role',
    shortDesc: 'A wide defender who moves into central midfield zones during attacking build-up.',
    explanation: 'Rather than bombing down the touchline to cross, the inverted fullback drifts centrally next to the defensive midfielder during possession. This frees up the central midfielders to push higher, protects against central counters, and allows the true wingers to stay wide and isolate defenders.',
    origin: 'Introduced in modern form by Pep Guardiola with Philipp Lahm and David Alaba at Bayern Munich, expanded at Manchester City with Cancelo and Lewis.',
    keyPrinciples: [
      'Controls central tempo and adds extra passing angles in the first phase',
      'Provides immediate central counter-pressing cover upon losing the ball',
      'Unlocks width for pure 1v1 wingers',
    ],
    famousTeamsOrManagers: ['Philipp Lahm (Bayern Munich)', 'Oleksandr Zinchenko & Jurrien Timber (Arsenal)', 'Rico Lewis (Man City)'],
  },
];
