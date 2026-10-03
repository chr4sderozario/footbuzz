/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Football Discovery Hub
 * Surfaces curated categories generated strictly from real provider schedules and verified player databases.
 */

import React, { useState } from 'react';
import {
  Compass,
  Flame,
  Globe,
  Trophy,
  Star,
  Clock,
  Calendar,
  History,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { footballApi } from '../../services/footballApi';
import { MatchCard } from '../matches/MatchCard';
import { PlayerAvatar } from '../common/PlayerAvatar';
import { PlayerModal } from '../players/PlayerModal';
import { Player } from '../../types/football';

export const DiscoverPage: React.FC = () => {
  const { navigateTo } = useApp();
  const allMatches = footballApi.getAllMatches();
  const allPlayers = footballApi.getPlayers();
  const historicTournaments = footballApi.getHistoricTournaments();

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  // 1. 🔥 Big Matches (derbies, UCL, high-profile fixtures)
  const bigMatches = allMatches.filter((m) => {
    const text = `${m.competitionName} ${m.homeTeam.name} ${m.awayTeam.name}`.toLowerCase();
    return (
      text.includes('derby') ||
      text.includes('clasico') ||
      text.includes('champions') ||
      text.includes('arsenal') ||
      text.includes('manchester') ||
      text.includes('real madrid') ||
      text.includes('barcelona') ||
      text.includes('mohun bagan') ||
      text.includes('east bengal') ||
      m.status === 'LIVE'
    );
  }).slice(0, 6);

  // 2. 🌍 International
  const internationalMatches = allMatches.filter((m) => {
    const text = `${m.competitionName} ${m.competitionCategory}`.toLowerCase();
    return (
      text.includes('friendly') ||
      text.includes('international') ||
      text.includes('world cup') ||
      text.includes('copa') ||
      text.includes('euro') ||
      m.competitionCategory === 'international'
    );
  }).slice(0, 6);

  // 3. 🏆 Knockout Football
  const knockoutMatches = allMatches.filter((m) => {
    const round = (m.round || '').toLowerCase();
    return (
      round.includes('final') ||
      round.includes('semi') ||
      round.includes('quarter') ||
      round.includes('knockout') ||
      round.includes('round of') ||
      m.competitionCategory === 'cup'
    );
  }).slice(0, 6);

  // 4. ⭐ Players to Watch
  const playersToWatch = allPlayers
    .filter((p) => p.seasonStats.goals >= 3 || p.isLegend || p.seasonStats.rating >= 8.0)
    .slice(0, 8);

  // 5. 📅 Tonight (matches for today's date)
  const todayStr = new Date().toISOString().split('T')[0];
  const tonightMatches = allMatches.filter((m) => m.date === todayStr).slice(0, 6);

  // 6. 📅 This Weekend
  const weekendMatches = allMatches.filter((m) => {
    try {
      const d = new Date(m.date);
      const day = d.getDay();
      return day === 0 || day === 6; // Sunday or Saturday
    } catch {
      return false;
    }
  }).slice(0, 6);

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-200 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#009270] text-xs font-bold font-mono uppercase tracking-wider mb-2">
              <Compass className="w-4 h-4 text-[#009270]" />
              <span>DISCOVER FOOTBALL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
              Curated Football Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Explore big match derbies, international heavyweights, knockout drama, marquee players, and iconic football history — generated exclusively from real provider data.
            </p>
          </div>

          <button
            onClick={() => navigateTo('matches')}
            className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-[#009270] hover:bg-[#028060] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0"
          >
            <span>Full Match Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 1. 🔥 Big Matches */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-600" />
            <h2 className="text-base sm:text-lg font-black text-slate-900 font-display">
              Big Matches & High-Stakes Clashes
            </h2>
          </div>
          <button
            onClick={() => navigateTo('matches')}
            className="text-xs font-bold text-[#009270] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {bigMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bigMatches.map((match) => (
              <MatchCard key={`big-${match.id}`} match={match} />
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
            No active derby or marquee fixtures found in current provider schedule.
          </div>
        )}
      </section>

      {/* 2. 🌍 International */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-teal-600" />
            <h2 className="text-base sm:text-lg font-black text-slate-900 font-display">
              International Football & Continental Showcases
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">Verified National Teams</span>
        </div>

        {internationalMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {internationalMatches.map((match) => (
              <MatchCard key={`intl-${match.id}`} match={match} />
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
            No international matches currently scheduled for this matchday.
          </div>
        )}
      </section>

      {/* 3. 🏆 Knockout Football */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="text-base sm:text-lg font-black text-slate-900 font-display">
              Knockout Ties & Cup Elimination
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">Cup Finals & Play-offs</span>
        </div>

        {knockoutMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {knockoutMatches.map((match) => (
              <MatchCard key={`ko-${match.id}`} match={match} />
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
            No knockout matches scheduled for this specific date window.
          </div>
        )}
      </section>

      {/* 4. ⭐ Players to Watch */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-current" />
            <h2 className="text-base sm:text-lg font-black text-slate-900 font-display">
              Players to Watch
            </h2>
          </div>
          <button
            onClick={() => navigateTo('players')}
            className="text-xs font-bold text-[#009270] hover:underline flex items-center gap-1"
          >
            <span>All Players</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {playersToWatch.map((player) => (
            <div
              key={`ptw-${player.id}`}
              onClick={() => setSelectedPlayer(player)}
              className="p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 hover:border-[#009270] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
            >
              <div className="flex items-center gap-3">
                <PlayerAvatar
                  id={player.id}
                  name={player.name}
                  photoUrl={player.photoUrl}
                  number={player.shirtNumber}
                  size="md"
                />
                <div className="min-w-0">
                  <div className="font-extrabold text-sm text-slate-900 group-hover:text-[#009270] transition-colors truncate">
                    {player.name}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {player.currentTeamName} · #{player.shirtNumber}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center text-[11px]">
                <div className="bg-slate-50 p-1.5 rounded-lg">
                  <div className="font-mono font-bold text-slate-900">{player.seasonStats.goals}</div>
                  <div className="text-slate-400 text-[10px]">Goals</div>
                </div>
                <div className="bg-slate-50 p-1.5 rounded-lg">
                  <div className="font-mono font-bold text-slate-900">{player.seasonStats.assists}</div>
                  <div className="text-slate-400 text-[10px]">Assists</div>
                </div>
                <div className="bg-slate-50 p-1.5 rounded-lg">
                  <div className="font-mono font-bold text-[#009270]">{player.seasonStats.appearances}</div>
                  <div className="text-slate-400 text-[10px]">Apps</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. 📅 Tonight */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base sm:text-lg font-black text-slate-900 font-display">
              Tonight's Action
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">Today: {todayStr}</span>
        </div>

        {tonightMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tonightMatches.map((match) => (
              <MatchCard key={`tonight-${match.id}`} match={match} />
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
            No matches scheduled for tonight in the current provider feed.
          </div>
        )}
      </section>

      {/* 6. 📅 This Weekend */}
      {weekendMatches.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base sm:text-lg font-black text-slate-900 font-display">
                This Weekend's Football
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">Saturday & Sunday Fixtures</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {weekendMatches.map((match) => (
              <MatchCard key={`weekend-${match.id}`} match={match} />
            ))}
          </div>
        </section>
      )}

      {/* 7. 🕰️ Football History */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-700" />
            <h2 className="text-base sm:text-lg font-black text-slate-900 font-display">
              Football History & Archive Vault
            </h2>
          </div>
          <button
            onClick={() => navigateTo('history')}
            className="text-xs font-bold text-[#009270] hover:underline flex items-center gap-1"
          >
            <span>Time Machine</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {historicTournaments.slice(0, 4).map((t) => (
            <div
              key={`hist-${t.year}`}
              onClick={() => navigateTo('history')}
              className="p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 hover:border-amber-500 hover:shadow-md transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xl font-black text-amber-700">{t.year}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {t.host || t.hostCountry}
                </span>
              </div>
              <div className="font-black text-sm text-slate-900 group-hover:text-amber-800 transition-colors">
                {t.name}
              </div>
              <p className="text-xs text-slate-500 line-clamp-2">{t.summary}</p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-[#009270]">
                <span>Champion: {t.champion}</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Player Modal */}
      <PlayerModal
        player={selectedPlayer}
        isOpen={Boolean(selectedPlayer)}
        onClose={() => setSelectedPlayer(null)}
      />
    </div>
  );
};
