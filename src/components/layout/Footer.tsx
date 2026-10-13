/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, Sparkles, Trophy, Heart, Download, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PWAInstallButton } from '../common/PWAInstallButton';

export const Footer: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <footer className="border-t border-slate-200 bg-[#182230] text-slate-300 text-xs mt-12 py-10 pb-28 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-700/60">
          <div className="space-y-2 max-w-sm">
            <div className="flex items-center gap-2 font-display text-lg font-bold text-white">
              <span className="w-2.5 h-2.5 rounded-full bg-[#009270]" />
              <span>Foot<span className="text-emerald-400">Buzz</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Everything Football. One Place. The ultimate football command centre for live scores, tactical pitch analytics, and football history.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <PWAInstallButton />
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('footbuzz_video_intro_seen');
                    window.location.reload();
                  }
                }}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Replay FootBuzz Video Intro"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Play Intro Video</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-xs font-semibold text-slate-300">
            <button onClick={() => navigateTo('home')} className="hover:text-emerald-400 transition-colors">
              Home
            </button>
            <button onClick={() => navigateTo('matches')} className="hover:text-emerald-400 transition-colors">
              Live Scores & Fixtures
            </button>
            <button onClick={() => navigateTo('competitions')} className="hover:text-emerald-400 transition-colors">
              Competitions
            </button>
            <button onClick={() => navigateTo('teams')} className="hover:text-emerald-400 transition-colors">
              Clubs & Teams
            </button>
            <button onClick={() => navigateTo('players')} className="hover:text-emerald-400 transition-colors">
              Players
            </button>
            <button onClick={() => navigateTo('history')} className="hover:text-emerald-400 transition-colors">
              Time Machine
            </button>
            <button onClick={() => navigateTo('search')} className="hover:text-emerald-400 transition-colors">
              Search
            </button>
          </div>
        </div>

        {/* Creator & Location Attribution Card with Animation */}
        <div className="pt-2">
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-800/80 to-slate-900/90 border border-emerald-500/30 p-4 sm:p-5 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-emerald-400/60 hover:shadow-emerald-500/10">
            {/* Background animated subtle glow */}
            <div className="pointer-events-none absolute -inset-full bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 -rotate-12 animate-pulse" />

            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              {/* "Made By John Christiano Rozario" with vibrant animation */}
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 via-[#009270] to-teal-800 text-white shadow-md shadow-emerald-950/60 shrink-0">
                  <span className="text-xl animate-bounce select-none">⚽</span>
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                    <span className="text-xs text-slate-300 font-medium">Made by</span>
                    <span className="font-extrabold text-sm sm:text-base tracking-wide bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200 bg-clip-text text-transparent drop-shadow-xs transition-all duration-300 group-hover:scale-[1.02] inline-block font-display">
                      John Christiano Rozario
                    </span>
                    <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-500 animate-pulse ml-0.5 inline-block" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Crafted with passion for world & Indian football
                  </p>
                </div>
              </div>

              {/* "Based In Kolkata West Bengal India" with pulsing location beacon */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-emerald-500/30 shadow-inner text-xs text-slate-300">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-medium text-slate-300">
                  Based In <span className="text-white font-bold">Kolkata West Bengal India</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} FootBuzz. Everything Football. One Place.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> Verified ESPN Football Data
            </span>
            <span>·</span>
            <span>Progressive Web App (PWA)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
