import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchEspnMultiLeagueMatches, fetchEspnEventSummary, isValidEspnMatch } from '../src/server/espnService.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const matchId = (req.query.id as string) || '';
  if (matchId) {
    try {
      const match = await fetchEspnEventSummary(matchId);
      return res.status(200).json({
        match,
        summary: match,
        status: 'SUCCESS',
      });
    } catch (e) {
      return res.status(200).json({ match: null, summary: null, status: 'SUCCESS' });
    }
  }

  try {
    const requestedDate = (req.query.date as string) || new Date().toISOString().split('T')[0];
    const providerMatches = await fetchEspnMultiLeagueMatches(requestedDate);
    const validMatches = providerMatches.filter(isValidEspnMatch);

    res.status(200).json({
      matches: validMatches,
      lastUpdated: new Date().toISOString(),
      provider: 'ESPN Official Scoreboard API',
      status: 'SUCCESS',
    });
  } catch (err: any) {
    res.status(200).json({
      matches: [],
      lastUpdated: new Date().toISOString(),
      provider: 'ESPN Official Scoreboard API',
      status: 'SUCCESS',
    });
  }
}
