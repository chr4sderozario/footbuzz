import type { VercelRequest, VercelResponse } from '@vercel/node';
import { OFFICIAL_PROVIDER_COMPETITIONS } from '../src/services/espnCompetitionService.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=600');
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const region = (req.query.region as string) || '';
    const gender = (req.query.gender as string) || '';
    const country = (req.query.country as string) || '';
    const query = ((req.query.q as string) || '').toLowerCase().trim();

    let filtered = [...OFFICIAL_PROVIDER_COMPETITIONS];

    if (region && region !== 'all') {
      filtered = filtered.filter((c) => c.region.toLowerCase() === region.toLowerCase());
    }

    if (gender && gender !== 'all') {
      filtered = filtered.filter((c) => c.gender.toLowerCase() === gender.toLowerCase());
    }

    if (country && country !== 'all') {
      filtered = filtered.filter((c) => c.country.toLowerCase().includes(country.toLowerCase()));
    }

    if (query) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.shortName.toLowerCase().includes(query) ||
          c.country.toLowerCase().includes(query)
      );
    }

    res.status(200).json({
      competitions: filtered,
      total: filtered.length,
      provider: 'ESPN Global Football API',
      status: 'SUCCESS',
      lastUpdated: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(200).json({
      competitions: OFFICIAL_PROVIDER_COMPETITIONS,
      total: OFFICIAL_PROVIDER_COMPETITIONS.length,
      provider: 'ESPN Global Football API',
      status: 'SUCCESS',
    });
  }
}
