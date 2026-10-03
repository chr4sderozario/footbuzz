/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Cricbuzz-style Football Command Centre Header
 */

import React, { useState } from 'react';
import { Search, User, Menu, X, Globe, Trophy, ChevronRight, Sparkles, Layers } from 'lucide-react';
import { NavTab, useApp } from '../../context/AppContext';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { FootballToolHubModal } from '../tools/FootballToolHubModal';

export const Header: React.FC = () => {
  const {
    currentTab,
    navigateTo,
    user,
    setAuthModalOpen,
    setIntroModalOpen,
    setSelectedLeagueFilter,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolHubOpen, setToolHubOpen] = useState(false);

  const mainNavItems: { id: NavTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'matches', label: 'Live Scores & Fixtures' },
    { id: 'discover', label: 'Discover' },
    { id: 'competitions', label: 'Competitions' },
    { id: 'teams', label: 'Teams' },
    { id: 'players', label: 'Players' },
    { id: 'history', label: 'Time Machine' },
  ];

  const subNavQuickFilters = [
    { label: '🇮🇳 ISL 2026/27', compId: 'comp-isl' },
    { label: '🌎 Copa América', compId: 'comp-copa-america' },
    { label: '🇪🇺 UEFA Euro', compId: 'comp-euro' },
    { label: '🏆 World Cup', compId: 'comp-fifa-worldcup' },
    { label: '⭐ Champions League', compId: 'comp-ucl' },
    { label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League', compId: 'comp-pl' },
    { label: '🇩🇪 Bundesliga', compId: 'comp-bundesliga' },
    { label: '🇪🇸 La Liga', compId: 'comp-laliga' },
    { label: '🇮🇹 Serie A', compId: 'comp-seriea' },
    { label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 FA Cup', compId: 'comp-facup' },
    { label: '📜 Historic Classics', tab: 'history' as NavTab },
  ];

  return (
    <header className="sticky top-0 z-40 w-full shadow-md select-none">
      {/* Tier 1: Cricbuzz Signature Emerald Brand Bar */}
      <div className="bg-[#009270] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-white/90 hover:text-white rounded-lg hover:bg-black/10 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2 group text-left"
            >
              <div className="flex items-center">
                <span className="text-2xl font-black tracking-tight text-white font-display">
                  foot<span className="text-emerald-200 font-extrabold">buzz</span>
                </span>
                <span className="ml-2 hidden sm:inline-block px-1.5 py-0.5 rounded bg-white/20 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-100">
                  Live
                </span>
              </div>
            </button>
          </div>

          {/* Main Primary Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-xs font-semibold text-white/90">
            {mainNavItems.map((item) => {
              const isActive =
                currentTab === item.id ||
                (item.id === 'matches' && currentTab === 'match-centre') ||
                (item.id === 'teams' && currentTab === 'team-detail') ||
                (item.id === 'players' && currentTab === 'player-detail') ||
                (item.id === 'competitions' && currentTab === 'competition-detail') ||
                (item.id === 'history' && currentTab === 'concept-detail');

              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-black/20 text-white font-bold shadow-inner'
                      : 'hover:bg-white/10 text-white/90 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Primary Actions & User Auth */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Search trigger */}
            <button
              onClick={() => navigateTo('search')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/15 hover:bg-black/25 text-white text-xs font-medium transition-colors"
              title="Global Football Search"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search</span>
            </button>

            {/* Intro & League Guide Trigger */}
            <button
              onClick={() => setIntroModalOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-colors shadow-xs"
              title="FootBuzz League Guide & Tour"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>Guide</span>
            </button>

            {/* Advanced 20 Features Hub Trigger */}
            <button
              onClick={() => setToolHubOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-950 border border-emerald-400/40 text-emerald-200 hover:text-white text-xs font-black transition-all shadow-xs"
              title="Open FootBuzz 20 Advanced Features & Tools"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-300" />
              <span className="hidden sm:inline">Hub (20)</span>
            </button>

            {/* PWA Install Button */}
            <PWAInstallButton />

            {/* Account / Profile */}
            {user ? (
              <button
                onClick={() => navigateTo('account')}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-xs font-bold text-white transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-white text-[#009270] flex items-center justify-center font-black text-[10px]">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-[80px] truncate">{user.name}</span>
              </button>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-[#009270] hover:bg-emerald-50 text-xs font-black transition-colors shadow-xs"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In / Sign Up</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tier 2: Cricbuzz Sub-Navigation Quick Leagues Strip */}
      <div className="bg-[#028060] text-emerald-50 text-xs border-t border-emerald-600/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center gap-4 overflow-x-auto no-scrollbar font-medium">
          <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-100 bg-black/15 px-2 py-0.5 rounded shrink-0 border border-emerald-500/30">
            <span>📅 {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>

          <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Trophy className="w-3 h-3 text-amber-300" /> Leagues:
          </span>

          {subNavQuickFilters.map((sub) => (
            <button
              key={sub.label}
              onClick={() => {
                if (sub.compId) {
                  navigateTo('competition-detail', { competitionId: sub.compId });
                } else if (sub.tab) {
                  navigateTo(sub.tab);
                }
              }}
              className="hover:text-white transition-colors whitespace-nowrap hover:underline underline-offset-4 shrink-0 text-xs"
            >
              {sub.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-emerald-700 bg-[#009270] text-white px-4 pt-2 pb-4 space-y-1 shadow-xl">
          {mainNavItems.map((item) => (
            <button
              key={`mob-${item.id}`}
              onClick={() => {
                navigateTo(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-between ${
                currentTab === item.id ? 'bg-black/20 text-white font-bold' : 'hover:bg-white/10'
              }`}
            >
              <span>{item.label}</span>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </button>
          ))}
        </div>
      )}

      {/* 20 Features Hub Modal */}
      <FootballToolHubModal isOpen={toolHubOpen} onClose={() => setToolHubOpen(false)} />
    </header>
  );
};
