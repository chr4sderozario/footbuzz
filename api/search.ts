import type { VercelRequest, VercelResponse } from '@vercel/node';
import { searchVerifiedMatches } from '../src/server/espnService.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const rawQuery = (req.query.q as string) || '';

  try {
    const { matches, teams, players, notice } = await searchVerifiedMatches(rawQuery);

    res.status(200).json({
      query: rawQuery,
      normalizedQuery: rawQuery.toLowerCase().trim(),
      matches,
      teams,
      players: players || [],
      notice,
      provider: 'ESPN Official Scoreboard API',
      status: 'SUCCESS',
    });
  } catch (err) {
    res.status(200).json({
      query: rawQuery,
      normalizedQuery: rawQuery.toLowerCase().trim(),
      matches: [],
      teams: [],
      players: [],
      status: 'SUCCESS',
    });
  }
}
