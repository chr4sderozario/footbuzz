/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Lightning Footy News - Top Footballer Live News Banner
 * Displays genuine verified news and automatically cycles/pops up a new headline every 10 seconds.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Sparkles,
  Radio,
  Flame,
  User,
} from 'lucide-react';
import { FootballNewsItem } from '../../types/football';
import { useApp } from '../../context/AppContext';

export const LightningFootyNewsBanner: React.FC = () => {
  const { navigateTo } = useApp();
  const [articles, setArticles] = useState<FootballNewsItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100% over 10 seconds
  const [loading, setLoading] = useState(true);

  // Fetch verified news from backend
  useEffect(() => {
    let isMounted = true;
    fetch('/api/news')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data && Array.isArray(data.articles) && data.articles.length > 0) {
          setArticles(data.articles);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Failed to load Lightning Footy News:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // 10-Second Auto-Popup Engine
  useEffect(() => {
    if (articles.length === 0 || isPaused) return;

    const intervalTime = 100; // update progress every 100ms
    const totalDuration = 10000; // 10 seconds total
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

  if (loading && articles.length === 0) {
    return null;
  }

  if (articles.length === 0) {
    return null;
  }

  const currentArticle = articles[currentIndex] || articles[0];

  const handleNext = () => {
    setCurrentIndex((idx) => (idx + 1) % articles.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentIndex((idx) => (idx - 1 + articles.length) % articles.length);
    setProgress(0);
  };

  const secondsRemaining = Math.max(1, Math.ceil((100 - progress) / 10));

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-[#0a1a14] to-slate-950 border border-emerald-500/30 shadow-md text-white mb-6">
      {/* 10-Second Countdown Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-10">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-emerald-300 transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left: Branding & Countdown Indicator */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigateTo('lightning-news')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-black text-xs transition-all shadow-xs cursor-pointer group"
            title="Open Dedicated Lightning Footy News Channel"
          >
            <Zap className="w-4 h-4 fill-current text-amber-950 group-hover:scale-110 transition-transform" />
            <span className="tracking-wide uppercase font-display">Lightning Footy News</span>
          </button>

          {/* 10-Second Live Pop Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="hidden sm:inline">Pops in</span>
            <span className="font-bold text-white">{secondsRemaining}s</span>
          </div>

          {/* Pause / Resume Controls */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
            title={isPaused ? 'Resume auto 10s popup' : 'Pause auto popup'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Center: Live Footballer Breaking Story */}
        <div className="flex-1 min-w-0 flex items-center gap-3.5 animate-in fade-in slide-in-from-right-3 duration-300">
          {currentArticle.imageUrl && (
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border border-white/20 shadow-xs bg-slate-900">
              <img
                src={currentArticle.imageUrl}
                alt={currentArticle.headline}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {currentArticle.footballer && (
                <div className="absolute bottom-0 inset-x-0 bg-emerald-950/90 text-emerald-300 text-[9px] font-bold text-center py-0.5 truncate px-1">
                  {currentArticle.footballer}
                </div>
              )}
            </div>
          )}

          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap text-[11px]">
              {currentArticle.footballer ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black uppercase text-[10px] tracking-wider">
                  <User className="w-3 h-3 fill-current" />
                  {currentArticle.footballer}
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-md bg-emerald-900/60 text-emerald-300 font-bold uppercase text-[10px] border border-emerald-500/30">
                  {currentArticle.category || 'Top Footballer'}
                </span>
              )}
              <span className="text-slate-400 font-mono text-[10px]">
                {new Date(currentArticle.published).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                · Verified ESPN Wire
              </span>
            </div>

            <h3
              onClick={() => navigateTo('lightning-news')}
              className="text-xs sm:text-sm font-bold text-white hover:text-emerald-300 transition-colors line-clamp-1 sm:line-clamp-2 cursor-pointer font-display"
            >
              {currentArticle.headline}
            </h3>

            <p className="text-slate-300 text-xs line-clamp-1 hidden lg:block leading-snug">
              {currentArticle.description}
            </p>
          </div>
        </div>

        {/* Right: Next / Prev & Dedicated Channel Trigger */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          <div className="flex items-center rounded-xl bg-white/5 border border-white/10 p-0.5">
            <button
              onClick={handlePrev}
              className="p-1 rounded-lg hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
              title="Previous headline"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono font-bold px-1.5 text-slate-400">
              {currentIndex + 1}/{articles.length}
            </span>
            <button
              onClick={handleNext}
              className="p-1 rounded-lg hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
              title="Next headline"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => navigateTo('lightning-news')}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all flex items-center gap-1.5 shrink-0"
            title="Open Lightning Footy News Channel"
          >
            <span>Live Channel</span>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
