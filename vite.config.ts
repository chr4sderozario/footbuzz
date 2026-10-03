import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { fetchRealProviderMatches, fetchRealMatchSummary, normalizeQuery } from './src/server/apiHandler';
import { searchRealMatchVideos } from './src/server/youtubeService';
import { generateDefaultMatches } from './src/data/matches';

function safeViteServerShimPlugin(): Plugin {
  return {
    name: 'safe-vite-server-shim',
    enforce: 'pre',
    configureServer(server) {
      if (!(server as any).ws) {
        (server as any).ws = {
          send: () => {},
          on: () => {},
          off: () => {},
          close: () => {},
        };
      }
      if (!(server as any).hot) {
        (server as any).hot = {
          send: () => {},
          on: () => {},
          off: () => {},
          close: () => {},
        };
      }
    },
  };
}

function footballApiDevPlugin(): Plugin {
  return {
    name: 'football-api-dev-plugin',
    configureServer(server) {
      if (!(server as any).ws) {
        (server as any).ws = {
          send: () => {},
          on: () => {},
          off: () => {},
          close: () => {},
        };
      }

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
              const results = await Promise.allSettled(promises);
              results.forEach((r) => {
                if (r.status === 'fulfilled' && Array.isArray(r.value)) {
                  allMatches.push(...r.value);
                }
              });
            } else if (horizon === '30days') {
              const promises: Promise<any[]>[] = [];
              for (let i = 0; i < 14; i++) {
                const d = new Date();
                d.setDate(d.getDate() + i);
                promises.push(fetchRealProviderMatches(d.toISOString().split('T')[0]));
              }
              const results = await Promise.allSettled(promises);
              results.forEach((r) => {
                if (r.status === 'fulfilled' && Array.isArray(r.value)) {
                  allMatches.push(...r.value);
                }
              });
            } else {
              allMatches = await fetchRealProviderMatches(requestedDate);
            }

            // Deduplicate matches
            const seen = new Set<string>();
            allMatches = allMatches.filter((m) => {
              if (seen.has(m.id)) return false;
              seen.add(m.id);
              return true;
            });

            // If empty, fall back to verified default matches
            if (allMatches.length === 0) {
              const defaults = generateDefaultMatches();
              if (horizon === 'tomorrow') {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                const tomorrowStr = tomorrow.toISOString().split('T')[0];
                const dayMatches = defaults.filter((m) => m.date === tomorrowStr);
                allMatches = dayMatches.length > 0 ? dayMatches : defaults;
              } else if (horizon === '7days' || horizon === '30days') {
                allMatches = defaults;
              } else {
                const dayMatches = defaults.filter((m) => m.date === requestedDate);
                allMatches = dayMatches.length > 0 ? dayMatches : defaults;
              }
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
              const defaults = generateDefaultMatches();
              const fallback = defaults.find((m) => m.id === matchId);
              if (fallback) {
                res.end(
                  JSON.stringify({
                    summary: {
                      header: {
                        id: fallback.id,
                        league: fallback.competitionName,
                        venue: fallback.venue,
                        status: fallback.status,
                      },
                      boxscore: {
                        teams: [
                          { team: fallback.homeTeam, score: fallback.score.home },
                          { team: fallback.awayTeam, score: fallback.score.away },
                        ],
                      },
                    },
                    status: 'SUCCESS',
                  })
                );
                return;
              }
              res.end(JSON.stringify({ summary: null, status: 'SUCCESS' }));
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
      safeViteServerShimPlugin(),
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
          enabled: false,
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
      hmr: false,
      watch: null,
    },
  };
});
