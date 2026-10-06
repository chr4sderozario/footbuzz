/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Verified Women's Football Global Hub & Command Centre
 * Direct coverage for Barclays WSL, UEFA Women's Champions League, NWSL, Liga F,
 * Indian Women's League (IWL), player spotlights, standings, and genuine scores.
 */

import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Calendar,
  Sparkles,
  ShieldCheck,
  Star,
  Users,
  Search,
  ExternalLink,
  ChevronRight,
  Flame,
  Globe,
  Award,
  Radio,
  Clock,
  ArrowRight,
  Activity,
} from 'lucide-react';
import {
  WOMENS_LEAGUES,
  WOMENS_SUPERSTARS,
  WOMENS_TOP_TEAMS,
  WSL_STANDINGS_2026,
  IWL_STANDINGS_2026,
  WomensPlayerSpotlight,
  WomensLeagueInfo,
} from '../../data/womensFootball';
import { useApp } from '../../context/AppContext';
import { footballApi } from '../../services/footballApi';
import { Match } from '../../types/football';
import { MatchCard } from '../matches/MatchCard';
import { ClubCrest } from '../common/ClubCrest';

export const WomensFootballPage: React.FC = () => {
  const { navigateTo } = useApp();
  const [activeTab, setActiveTab] = useState<'MATCHES' | 'STANDINGS' | 'STARS' | 'CLUBS' | 'LEAGUES'>('MATCHES');
  const [selectedLeague, setSelectedLeague] = useState<string>('eng.w.1');
  const [selectedStar, setSelectedStar] = useState<WomensPlayerSpotlight | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [liveWomensMatches, setLiveWomensMatches] = useState<Match[]>([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);

  // Fetch real women's league scoreboard
  useEffect(() => {
    let isMounted = true;
    setIsLoadingMatches(true);

    const todayStr = new Date().toISOString().split('T')[0];
    const slug = selectedLeague || 'eng.w.1';

    fetch(`/api/matches?league=${encodeURIComponent(slug)}&date=${encodeURIComponent(todayStr)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted) {
          if (data && Array.isArray(data.matches)) {
            setLiveWomensMatches(data.matches);
          } else {
            setLiveWomensMatches([]);
          }
          setIsLoadingMatches(false);
        }
      })
      .catch((err) => {
        console.warn('Womens matches fetch fallback:', err);
        if (isMounted) setIsLoadingMatches(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedLeague]);

  const filteredStars = WOMENS_SUPERSTARS.filter((p) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.club.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q) ||
        p.position.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-200">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#5a189a] via-[#7b2cbf] to-[#0d0221] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-mono font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-pink-300" />
            <span>AUTHENTIC WOMEN'S FOOTBALL HUB</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-display tracking-tight text-white">
            Women's Football Global Command Centre
          </h1>

          <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed">
            Live scores, verified standings, and complete coverage for Barclays Women's Super League (WSL), UEFA Women's Champions League (UWCL), NWSL, Liga F, and Indian Women's League (IWL).
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            <span className="px-3 py-1 rounded-xl bg-black/25 text-purple-200 text-xs font-mono font-bold border border-white/10">
              ⭐ Ballon d'Or Féminin: <strong>Aitana Bonmatí (2023 & 2024)</strong>
            </span>
            <span className="px-3 py-1 rounded-xl bg-black/25 text-purple-200 text-xs font-mono font-bold border border-white/10">
              🏆 UWCL Champions: <strong>FC Barcelona Femení</strong>
            </span>
            <span className="px-3 py-1 rounded-xl bg-black/25 text-purple-200 text-xs font-mono font-bold border border-white/10">
              🇮🇳 IWL Champions: <strong>Odisha FC / East Bengal</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Ribbon */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-2 shadow-xs flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('MATCHES')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'MATCHES'
                ? 'bg-[#7b2cbf] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Scores & Fixtures</span>
          </button>

          <button
            onClick={() => setActiveTab('STANDINGS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'STANDINGS'
                ? 'bg-[#7b2cbf] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>League Standings</span>
          </button>

          <button
            onClick={() => setActiveTab('STARS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'STARS'
                ? 'bg-[#7b2cbf] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Superstars & Golden Boot</span>
          </button>

          <button
            onClick={() => setActiveTab('CLUBS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'CLUBS'
                ? 'bg-[#7b2cbf] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Top Clubs</span>
          </button>

          <button
            onClick={() => setActiveTab('LEAGUES')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'LEAGUES'
                ? 'bg-[#7b2cbf] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Competitions Directory</span>
          </button>
        </div>
      </div>

      {/* TAB 1: REAL SCORES & FIXTURES */}
      {activeTab === 'MATCHES' && (
        <div className="space-y-6">
          {/* League Selector Ribbon */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {WOMENS_LEAGUES.map((l) => (
              <button
                key={l.id}
                onClick={() => setSelectedLeague(l.slug)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                  selectedLeague === l.slug
                    ? 'bg-purple-900 text-white border-purple-700 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300'
                }`}
              >
                <span>{l.flag}</span>
                <span>{l.shortName}</span>
              </button>
            ))}
          </div>

          {/* Matches List */}
          {isLoadingMatches ? (
            <div className="p-12 text-center text-slate-500 font-mono text-xs">
              Fetching live women's scores and schedule...
            </div>
          ) : liveWomensMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {liveWomensMatches.map((m) => (
                <MatchCard key={`wm-${m.id}`} match={m} />
              ))}
            </div>
          ) : (
            <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#7b2cbf] flex items-center justify-center mx-auto text-xl">
                ⚽
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-sm text-slate-900">
                  No Fixtures Today for Selected League
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Matches resume on upcoming matchdays. Explore league standings or superstar profiles below!
                </p>
              </div>
              <button
                onClick={() => setActiveTab('STANDINGS')}
                className="px-4 py-2 rounded-xl bg-[#7b2cbf] text-white text-xs font-bold shadow-xs hover:bg-purple-800 transition-colors"
              >
                View League Tables & Standings
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: STANDINGS & LEAGUE TABLES */}
      {activeTab === 'STANDINGS' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Barclays WSL Standings */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-lg">🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
                <div>
                  <h3 className="font-black text-sm text-slate-900 font-display">Barclays Women's Super League</h3>
                  <div className="text-[10px] font-mono text-slate-500">Official Table · Season 2026-27</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#009270] font-bold text-[10px]">
                Top 3 → UWCL
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400 uppercase font-mono">
                    <th className="py-2 px-1">#</th>
                    <th className="py-2 px-2">Club</th>
                    <th className="py-2 px-1 text-center">PL</th>
                    <th className="py-2 px-1 text-center">GD</th>
                    <th className="py-2 px-2 text-right">PTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {WSL_STANDINGS_2026.map((row) => (
                    <tr key={row.team} className="hover:bg-purple-50/50 transition-colors">
                      <td className="py-2.5 px-1 font-mono font-bold text-slate-500">{row.position}</td>
                      <td className="py-2.5 px-2 font-bold text-slate-900">{row.team}</td>
                      <td className="py-2.5 px-1 text-center font-mono text-slate-600">{row.played}</td>
                      <td className="py-2.5 px-1 text-center font-mono font-bold text-slate-700">+{row.gd}</td>
                      <td className="py-2.5 px-2 text-right font-mono font-black text-[#7b2cbf]">{row.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Indian Women's League (IWL) Standings */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-lg">🇮🇳</span>
                <div>
                  <h3 className="font-black text-sm text-slate-900 font-display">Indian Women’s League (IWL)</h3>
                  <div className="text-[10px] font-mono text-slate-500">Official AIFF Table · Season 2026-27</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 font-bold text-[10px]">
                Champion → AFC
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400 uppercase font-mono">
                    <th className="py-2 px-1">#</th>
                    <th className="py-2 px-2">Club</th>
                    <th className="py-2 px-1 text-center">PL</th>
                    <th className="py-2 px-1 text-center">GD</th>
                    <th className="py-2 px-2 text-right">PTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {IWL_STANDINGS_2026.map((row) => (
                    <tr key={row.team} className="hover:bg-orange-50/50 transition-colors">
                      <td className="py-2.5 px-1 font-mono font-bold text-slate-500">{row.position}</td>
                      <td className="py-2.5 px-2 font-bold text-slate-900">{row.team}</td>
                      <td className="py-2.5 px-1 text-center font-mono text-slate-600">{row.played}</td>
                      <td className="py-2.5 px-1 text-center font-mono font-bold text-slate-700">+{row.gd}</td>
                      <td className="py-2.5 px-2 text-right font-mono font-black text-orange-600">{row.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SUPERSTARS & GOLDEN BOOT */}
      {activeTab === 'STARS' && (
        <div className="space-y-6">
          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search star players by name, club, or nationality..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#7b2cbf]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredStars.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedStar(p)}
                className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 hover:border-[#7b2cbf] p-4 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-3">
                  <div className="relative h-44 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img
                      src={p.photoUrl}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white font-mono text-[10px] font-bold">
                      #{p.shirtNumber}
                    </div>
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-[#7b2cbf] text-white font-bold text-[10px]">
                      {p.countryFlag} {p.country}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-[#7b2cbf] transition-colors">
                      {p.name}
                    </h3>
                    <div className="text-xs text-slate-500 font-medium">
                      {p.club} · {p.position}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 p-2 rounded-xl bg-slate-50 text-center font-mono">
                    <div className="bg-white rounded-lg p-1 border border-slate-100">
                      <div className="text-xs font-black text-purple-700">{p.goalsSeason}</div>
                      <div className="text-[8px] uppercase font-bold text-slate-400">Goals</div>
                    </div>
                    <div className="bg-white rounded-lg p-1 border border-slate-100">
                      <div className="text-xs font-black text-slate-800">{p.assistsSeason}</div>
                      <div className="text-[8px] uppercase font-bold text-slate-400">Assists</div>
                    </div>
                  </div>
                </div>

                <button className="w-full py-1.5 rounded-lg bg-slate-100 group-hover:bg-[#7b2cbf] group-hover:text-white text-slate-700 text-xs font-bold transition-colors">
                  View Career & Honours
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: TOP CLUBS */}
      {activeTab === 'CLUBS' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {WOMENS_TOP_TEAMS.map((t) => (
            <div
              key={t.id}
              className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 hover:border-[#7b2cbf] p-4 shadow-xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 p-2 flex items-center justify-center shrink-0">
                    <img src={t.crestUrl} alt={t.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-sm text-slate-900 truncate">{t.name}</h3>
                    <div className="text-[11px] text-slate-500 font-medium truncate">{t.country}</div>
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1 pt-1">
                  <div className="font-semibold text-slate-800">🏟️ {t.stadium}</div>
                  <div className="text-[11px] text-purple-700 font-medium">🏆 {t.recentTitles}</div>
                  <div className="text-[11px] text-slate-500">👔 Manager: {t.manager}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-400">
                League: {t.league}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: LEAGUES DIRECTORY */}
      {activeTab === 'LEAGUES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {WOMENS_LEAGUES.map((l) => (
            <div
              key={l.id}
              className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{l.flag}</span>
                  <div>
                    <h3 className="font-black text-sm text-slate-900">{l.name}</h3>
                    <div className="text-xs text-slate-500 font-medium">{l.country} · {l.teamsCount} Teams</div>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{l.description}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-purple-900 font-semibold space-y-1">
                <div>👑 Reigning Champions: {l.currentChampions}</div>
                <div className="text-[10px] font-mono text-slate-500">Season: {l.season}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Player Modal */}
      {selectedStar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-[#5a189a] to-[#7b2cbf] text-white p-6 relative">
              <button
                onClick={() => setSelectedStar(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
              >
                ✕
              </button>
              <div className="flex items-center gap-4">
                <img
                  src={selectedStar.photoUrl}
                  alt={selectedStar.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white/40 shadow-md"
                />
                <div>
                  <div className="text-xs font-mono text-purple-200 uppercase font-bold">
                    {selectedStar.countryFlag} {selectedStar.country} · #{selectedStar.shirtNumber}
                  </div>
                  <h2 className="text-xl font-black font-display text-white">{selectedStar.name}</h2>
                  <div className="text-xs text-purple-100">{selectedStar.club} · {selectedStar.position}</div>
                </div>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700">
              <div>
                <div className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] mb-1">
                  Biography & Playing Style
                </div>
                <p className="leading-relaxed text-slate-600">{selectedStar.bio}</p>
              </div>

              <div>
                <div className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5">
                  Career Honours & Trophies
                </div>
                <div className="space-y-1.5">
                  {selectedStar.honours.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-purple-50 border border-purple-100 font-bold text-purple-900">
                      <Award className="w-4 h-4 text-[#7b2cbf] shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedStar(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
