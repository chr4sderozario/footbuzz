import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
  res.setHeader('Access-Control-Allow-Origin', '*');

  res.status(200).json({
    status: 'ok',
    environment: process.env.VERCEL ? 'production' : 'development',
    serverTime: new Date().toISOString(),
    timezone: 'UTC',
    provider: 'ESPN Official Scoreboard API',
  });
}
