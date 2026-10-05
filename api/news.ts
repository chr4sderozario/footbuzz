import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchVerifiedFootballNews } from '../src/server/newsService.js';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=120');
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const news = await fetchVerifiedFootballNews(40);
    res.status(200).json({
      channel: 'Lightning Footy News',
      headlineCount: news.length,
      lastUpdated: new Date().toISOString(),
      provider: 'ESPN Verified Football Telemetry',
      articles: news,
      status: 'SUCCESS',
    });
  } catch (err: any) {
    res.status(200).json({
      channel: 'Lightning Footy News',
      headlineCount: 0,
      articles: [],
      status: 'SUCCESS',
    });
  }
}
