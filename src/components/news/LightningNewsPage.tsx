/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Lightning Footy News - Dedicated Live Football News Channel
 * Displays genuine, verified footballer stories with a 10-second live auto-popup engine.
 */

import React, { useState, useEffect } from 'react';
import {
  Zap,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Sparkles,
  Search,
  Filter,
  User,
  ShieldCheck,
  RefreshCw,
  Share2,
} from 'lucide-react';
import { FootballNewsItem } from '../../types/football';
import { useApp } from '../../context/AppContext';

export const LightningNewsPage: React.FC = () => {
  const { navigateTo, addToast } = useApp();
  const [articles, setArticles] = useState<FootballNewsItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFootballer, setSelectedFootballer] = useState<string>('all');

  const fetchNews = () => {
    setLoading(true);
    fetch('/api/news')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.articles)) {
          setArticles(data.articles);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching Lightning Footy News:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // 10-Second Auto-Popup Engine
  useEffect(() => {
    if (articles.length === 0 || isPaused) return;

    const intervalTime = 100;
    const totalDuration = 10000;
    const step = (intervalTime / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev + step >= 100) {
          setCurrentIndex((idx) => (idx + 1) % articles.length);
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [articles.length, isPaused]);

  // Extract unique footballers from articles
  const footballersSet = new Set<string>();
  for (const a of articles) {
    if (a.footballer) footballersSet.add(a.footballer);
  }
  const topFootballers = Array.from(footballersSet);

  const filteredArticles = articles.filter((a) => {
    if (selectedFootballer !== 'all' && a.footballer !== selectedFootballer) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        a.headline.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        (a.footballer && a.footballer.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const featured = articles[currentIndex] || articles[0];
  const secondsRemaining = Math.max(1, Math.ceil((100 - progress) / 10));

  const handleShare = (art: FootballNewsItem) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(art.url);
      addToast('Story Copied', 'News link copied to clipboard.', 'SUCCESS');
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200 max-w-6xl mx-auto">
      {/* Channel Header Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-[#071912] to-slate-950 rounded-3xl border border-emerald-500/30 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-mono font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 fill-current text-amber-400" />
              <span>Dedicated Live News Channel</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white flex items-center gap-2.5">
              <span>Lightning Footy News</span>
              <span className="text-amber-400">⚡</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Genuine, verified football and top footballer news from official sports telemetry feeds. Live headlines auto-cycle every 10 seconds.
            </p>
          </div>

          {/* Quick Stats & Controls */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center min-w-[100px]">
              <div className="text-[10px] uppercase font-bold text-slate-400">Verified Stories</div>
              <div className="text-xl font-black text-emerald-400 font-mono">{articles.length}</div>
            </div>

            <button
              onClick={fetchNews}
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all cursor-pointer"
              title="Refresh News Feed"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* FEATURED: Live 10-Second Auto-Popup Story Card */}
      {featured && (
        <div className="relative overflow-hidden rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-4">
          {/* Top 10-Second Progress Line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-[#009270] transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between gap-3 text-xs pt-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-[#009270] font-black uppercase text-[11px] tracking-wider flex items-center gap-1.5 border border-emerald-200/60 font-mono">
                <Zap className="w-3.5 h-3.5 fill-current text-amber-500" />
                <span>Now Popping Up</span>
              </span>
              <span className="text-slate-500 font-mono text-xs">
                Next story in <strong className="text-slate-900">{secondsRemaining}s</strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1"
                title={isPaused ? 'Resume auto 10s popup' : 'Pause auto popup'}
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                <span>{isPaused ? 'Resume' : 'Pause'}</span>
              </button>

              <button
                onClick={() => {
                  setCurrentIndex((idx) => (idx - 1 + articles.length) % articles.length);
                  setProgress(0);
                }}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title="Previous story"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-xs font-mono font-bold text-slate-500 px-1">
                {currentIndex + 1} of {articles.length}
              </span>

              <button
                onClick={() => {
                  setCurrentIndex((idx) => (idx + 1) % articles.length);
                  setProgress(0);
                }}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title="Next story"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Featured Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2">
            {featured.imageUrl && (
              <div className="lg:col-span-5 relative rounded-2xl overflow-hidden shadow-md bg-slate-950 aspect-video lg:aspect-[4/3]">
                <img
                  src={featured.imageUrl}
                  alt={featured.headline}
                  className="w-full h-full object-cover"
                />
                {featured.footballer && (
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 fill-current" />
                    <span>{featured.footballer}</span>
                  </div>
                )}
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-white/90">
                  Verified ESPN Source
                </div>
              </div>
            )}

            <div className={`space-y-3 ${featured.imageUrl ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {new Date(featured.published).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}{' '}
                  ·{' '}
                  {new Date(featured.published).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                {featured.byline && <span>· By {featured.byline}</span>}
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug font-display">
                {featured.headline}
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                {featured.description}
              </p>

              <div className="pt-3 flex flex-wrap items-center gap-3">
                <a
                  href={featured.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-[#009270] hover:bg-[#028060] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>Read Official Report</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => handleShare(featured)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search verified news & footballer stories (e.g. Mbappé, Messi, Ronaldo, Haaland)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#009270] focus:bg-white transition-all shadow-xs"
          />
        </div>

        {/* Top Footballers Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setSelectedFootballer('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedFootballer === 'all'
                ? 'bg-[#009270] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ⭐ All News ({articles.length})
          </button>
          {topFootballers.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFootballer(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedFootballer === f
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              ⚽ {f}
            </button>
          ))}
        </div>
      </div>

      {/* News Grid (All 40+ Genuine Stories) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-slate-200 text-xs">
          <span className="font-black uppercase tracking-wider text-slate-800 font-display flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#009270]" />
            Verified Football Wire ({filteredArticles.length} Stories)
          </span>
          <span className="text-[11px] font-mono text-slate-400">ESPN Official Football Feeds</span>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 text-slate-500 text-xs">
            No football news found matching your query.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArticles.map((art, index) => (
              <div
                key={art.id || index}
                onClick={() => {
                  const targetIdx = articles.findIndex((a) => a.id === art.id);
                  if (targetIdx !== -1) {
                    setCurrentIndex(targetIdx);
                    setProgress(0);
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }
                }}
                className="group bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 hover:border-[#009270] p-4 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3"
              >
                {art.imageUrl && (
                  <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-900 shrink-0">
                    <img
                      src={art.imageUrl}
                      alt={art.headline}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    {art.footballer && (
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-xs">
                        {art.footballer}
                      </span>
                    )}
                  </div>
                )}

                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                    <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>
                      {new Date(art.published).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span>· Verified Wire</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#009270] transition-colors line-clamp-2 leading-snug font-display">
                    {art.headline}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {art.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-[#009270] font-bold">
                  <span>Pop to Featured</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
