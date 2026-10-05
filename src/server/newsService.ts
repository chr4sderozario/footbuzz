/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Lightning Footy News - Real Verified Football & Footballer News Provider
 */

import { FootballNewsItem } from '../types/football.js';

// Prominent footballer names for tagging top footballer news
const TOP_FOOTBALLERS = [
  'Mbappé', 'Kylian Mbappé', 'Mbappe',
  'Messi', 'Lionel Messi',
  'Ronaldo', 'Cristiano Ronaldo',
  'Haaland', 'Erling Haaland',
  'Vinícius', 'Vinicius Jr', 'Vini Jr',
  'Bellingham', 'Jude Bellingham',
  'Yamal', 'Lamine Yamal',
  'Salah', 'Mohamed Salah',
  'Kane', 'Harry Kane',
  'De Bruyne', 'Kevin De Bruyne',
  'Saka', 'Bukayo Saka',
  'Rodri',
  'Foden', 'Phil Foden',
  'Palmer', 'Cole Palmer',
  'Sunil Chhetri', 'Chhetri',
  'Lewandowski', 'Robert Lewandowski',
  'Neymar',
  'Pedri',
  'Gavi',
  'Musiala', 'Jamal Musiala',
  'Wirtz', 'Florian Wirtz',
  'Son Heung-min', 'Son',
  'Mourinho', 'José Mourinho',
  'Guardiola', 'Pep Guardiola',
  'Arteta', 'Mikel Arteta',
  'Ancelotti', 'Carlo Ancelotti',
  'Slot', 'Arne Slot',
  'JJ Gabriel',
];

export async function fetchVerifiedFootballNews(limit: number = 40): Promise<FootballNewsItem[]> {
  const newsList: FootballNewsItem[] = [];
  const seenIds = new Set<string>();

  try {
    const urls = [
      `https://site.api.espn.com/apis/site/v2/sports/soccer/all/news?limit=${limit}`,
      `https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/news?limit=15`,
    ];

    const responses = await Promise.all(
      urls.map((u) =>
        fetch(u, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (FootBuzz Football Platform)',
            Accept: 'application/json',
          },
        }).then((r) => (r.ok ? r.json() : { articles: [] })).catch(() => ({ articles: [] }))
      )
    );

    for (const data of responses) {
      if (Array.isArray(data.articles)) {
        for (const a of data.articles) {
          const id = String(a.id || a.nowId || Math.random());
          if (seenIds.has(id)) continue;
          seenIds.add(id);

          const headline = a.headline || a.title || '';
          const desc = a.description || '';
          if (!headline) continue;

          // Detect if a top footballer is mentioned
          let footballer: string | undefined = undefined;
          const combinedText = `${headline} ${desc}`;
          for (const f of TOP_FOOTBALLERS) {
            const regex = new RegExp(`\\b${f}\\b`, 'i');
            if (regex.test(combinedText)) {
              footballer = f;
              break;
            }
          }

          const rawImg = a.images?.[0]?.url || a.images?.[0]?.href || undefined;
          const rawLink = a.links?.web?.href || a.link || `https://www.espn.com/soccer/story/_/id/${id}`;

          newsList.push({
            id,
            headline,
            description: desc,
            published: a.published || a.lastModified || new Date().toISOString(),
            imageUrl: rawImg,
            url: rawLink,
            byline: a.byline || 'ESPN Football Telemetry',
            category: footballer ? 'Top Footballer' : (a.type || 'Breaking Football'),
            footballer,
          });
        }
      }
    }
  } catch (err) {
    console.error('Lightning Footy News Fetch Error:', err);
  }

  // Sort by published timestamp descending
  newsList.sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());

  return newsList;
}
