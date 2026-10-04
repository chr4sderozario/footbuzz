/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, Sparkles, Trophy, Heart, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PWAInstallButton } from '../common/PWAInstallButton';

export const Footer: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <footer className="border-t border-slate-200 bg-[#182230] text-slate-300 text-xs mt-12 py-10">
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
