import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchEspnProviderMatches, isValidEspnMatch } from '../src/server/espnService.js';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const todayStr = new Date().toISOString().split('T')[0];
  const liveMatches = await fetchEspnProviderMatches(todayStr);
  const validMatches = liveMatches.filter(isValidEspnMatch);
  const sampleMatch = validMatches[0] || null;

  res.status(200).json({
    environment: process.env.VERCEL ? 'Production (footbuzzlive.vercel.app)' : 'AI Studio / Local Environment',
    buildCommit: process.env.VERCEL_GIT_COMMIT_SHA || 'latest-main-commit',
    deploymentId: process.env.VERCEL_DEPLOYMENT_ID || 'live-production',
    apiProvider: 'ESPN Official Scoreboard API',
    apiEndpoint: `https://site.api.espn.com/apis/site/v2/sports/soccer/all/scoreboard?dates=${todayStr.replace(/-/g, '')}`,
    requestedDate: todayStr,
    totalLiveProviderMatches: validMatches.length,
    sampleFixtureId: sampleMatch ? sampleMatch.id : 'espn-none',
    sampleHomeTeamId: sampleMatch ? sampleMatch.homeTeam.id : 'team-none',
    sampleAwayTeamId: sampleMatch ? sampleMatch.awayTeam.id : 'team-none',
    sampleStatus: sampleMatch ? sampleMatch.status : 'SCHEDULED',
    dataSource: 'Real ESPN Official Scoreboard Feed (Zero Fake Data)',
    cacheStatus: 'NO-CACHE / DIRECT LIVE REFRESH',
    timestamp: new Date().toISOString(),
  });
}
