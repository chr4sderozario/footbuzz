import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { fetchRealProviderMatches, fetchRealMatchSummary, normalizeQuery } from './src/server/apiHandler';
import { searchRealMatchVideos } from './src/server/youtubeService';

function footballApiDevPlugin(): Plugin {
  return {
    name: 'football-api-dev-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        try {
          const urlObj = new URL(req.url, 'http://localhost:3000');
          const pathname = urlObj.pathname;

          if (pathname === '/api/matches') {
            const todayDateStr = new Date().toISOString().split('T')[0];
            const requestedDate = urlObj.searchParams.get('date') || todayDateStr;
            const horizon = urlObj.searchParams.get('horizon') || 'today';
            const league = urlObj.searchParams.get('league');
            const status = urlObj.searchParams.get('status');

            let allMatches: any[] = [];
            if (horizon === 'today') {
              allMatches = await fetchRealProviderMatches(requestedDate);
            } else if (horizon === 'tomorrow') {
              const tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);
              allMatches = await fetchRealProviderMatches(tomorrow.toISOString().split('T')[0]);
            } else if (horizon === '7days') {
              const promises: Promise<any[]>[] = [];
              for (let i = 0; i < 7; i++) {
                const d = new Date();
                d.setDate(d.getDate() + i);
                promises.push(fetchRealProviderMatches(d.toISOString().split('T')[0]));
              }
              const results = await Promise.all(promises);
              results.forEach((list) => allMatches.push(...list));
            } else if (horizon === '30days') {
              const promises: Promise<any[]>[] = [];
              for (let i = 0; i < 14; i++) {
                const d = new Date();
                d.setDate(d.getDate() + i);
                promises.push(fetchRealProviderMatches(d.toISOString().split('T')[0]));
              }
              const results = await Promise.all(promises);
              results.forEach((list) => allMatches.push(...list));
            } else {
              allMatches = await fetchRealProviderMatches(requestedDate);
            }

            if (league && league !== 'all') {
              allMatches = allMatches.filter((m) => m.competitionId === league);
            }
            if (status && status !== 'ALL') {
              if (status === 'LIVE') {
                allMatches = allMatches.filter((m) => m.status === 'LIVE' || m.status === 'HT');
              } else {
                allMatches = allMatches.filter((m) => m.status === status);
              }
            }

            const liveCount = allMatches.filter((m) => m.status === 'LIVE' || m.status === 'HT').length;

            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                matches: allMatches,
                date: requestedDate,
                horizon,
                liveCount,
                total: allMatches.length,
                lastUpdated: new Date().toISOString(),
                status: 'SUCCESS',
              })
            );
            return;
          }

          if (pathname.startsWith('/api/matches/')) {
            const matchId = pathname.replace('/api/matches/', '');
            const summary = await fetchRealMatchSummary(matchId);
            res.setHeader('Content-Type', 'application/json');
            if (!summary) {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'Match details unavailable from data provider.' }));
              return;
            }
            res.end(JSON.stringify({ summary, status: 'SUCCESS' }));
            return;
          }

          if (pathname === '/api/youtube/match-videos') {
            const home = urlObj.searchParams.get('homeTeam') || '';
            const away = urlObj.searchParams.get('awayTeam') || '';
            const comp = urlObj.searchParams.get('competition') || '';
            const date = urlObj.searchParams.get('date') || '';

            const videos = await searchRealMatchVideos({
              homeTeamName: home,
              awayTeamName: away,
              competitionName: comp,
              date,
            });

            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                videos,
                status: videos.length > 0 ? 'SUCCESS' : 'NO_VERIFIED_VIDEOS',
                message: videos.length > 0 ? undefined : 'No verified YouTube video found yet.',
              })
            );
            return;
          }

          if (pathname === '/api/search') {
            const rawQuery = urlObj.searchParams.get('q') || '';
            const normalized = normalizeQuery(rawQuery);

            if (!normalized) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ query: rawQuery, normalizedQuery: '', matches: [], teams: [] }));
              return;
            }

            const todayStr = new Date().toISOString().split('T')[0];
            const todayMatches = await fetchRealProviderMatches(todayStr);

            const tokens = normalized.split(' ').filter(Boolean);
            const matchedMatches: any[] = [];
            const matchedTeamsMap = new Map<string, any>();

            for (const match of todayMatches) {
              const homeNorm = normalizeQuery(match.homeTeam.name + ' ' + match.homeTeam.shortName + ' ' + match.homeTeam.code);
              const awayNorm = normalizeQuery(match.awayTeam.name + ' ' + match.awayTeam.shortName + ' ' + match.awayTeam.code);
              const compNorm = normalizeQuery(match.competitionName);
              const fullText = `${homeNorm} ${awayNorm} ${compNorm}`;

              const allTokensMatch = tokens.every((tok) => fullText.includes(tok));
              const pairMatch =
                tokens.length >= 2 &&
                ((tokens.some((t) => homeNorm.includes(t)) && tokens.some((t) => awayNorm.includes(t))) ||
                  (tokens.some((t) => awayNorm.includes(t)) && tokens.some((t) => homeNorm.includes(t))));

              if (allTokensMatch || pairMatch || fullText.includes(normalized)) {
                matchedMatches.push(match);
              }
              if (tokens.some((t) => homeNorm.includes(t))) {
                matchedTeamsMap.set(match.homeTeam.id, match.homeTeam);
              }
              if (tokens.some((t) => awayNorm.includes(t))) {
                matchedTeamsMap.set(match.awayTeam.id, match.awayTeam);
              }
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                query: rawQuery,
                normalizedQuery: normalized,
                matches: matchedMatches,
                teams: Array.from(matchedTeamsMap.values()),
                status: 'SUCCESS',
              })
            );
            return;
          }

          if (pathname === '/api/health') {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ status: 'ok', time: new Date().toISOString() }));
            return;
          }

          next();
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err?.message || 'Server error', matches: [] }));
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      footballApiDevPlugin(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['icon.svg'],
        manifest: {
          id: '/',
          name: 'FootBuzz — Everything Football. One Place.',
          short_name: 'FootBuzz',
          description: 'Premium football command centre for live scores, fixtures, tactical analytics, and football discovery.',
          theme_color: '#009270',
          background_color: '#f1f3f6',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/icon.svg',
              sizes: '192x192 512x512',
              type: 'image/svg+xml',
              purpose: 'any',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
