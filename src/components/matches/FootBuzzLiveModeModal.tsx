/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Live Mode Component
 * Immersive stadium-grade distraction-free live match experience.
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Zap,
  Volume2,
  VolumeX,
  Flame,
  Clock,
  Radio,
  ExternalLink,
  Share2,
  Repeat,
  Shield,
  Activity,
} from 'lucide-react';
import { Match, MatchEvent } from '../../types/football';
import { footballApi } from '../../services/footballApi';
import { useApp } from '../../context/AppContext';
import { ClubCrest } from '../common/ClubCrest';
import { getMatchMood } from '../../utils/footballUtils';

export const FootBuzzLiveModeModal: React.FC = () => {
  const { liveModeMatchId, setLiveModeMatchId, navigateTo, addToast } = useApp();
  const [match, setMatch] = useState<Match | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioPlayedEvents, setAudioPlayedEvents] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!liveModeMatchId) {
      setMatch(null);
      return;
    }

    const currentMatch =
      footballApi.getMatchById(liveModeMatchId) ||
      footballApi.getLiveMatches()[0] ||
      footballApi.getAllMatches().find((m) => m.id === liveModeMatchId) ||
      null;

    setMatch(currentMatch);

    const unsubscribe = footballApi.subscribe(() => {
      const updated =
        footballApi.getMatchById(liveModeMatchId) ||
        footballApi.getAllMatches().find((m) => m.id === liveModeMatchId) ||
        null;
      setMatch(updated);
    });

    return unsubscribe;
  }, [liveModeMatchId]);

  if (!liveModeMatchId || !match) return null;

  const mood = getMatchMood(match);
  const isLive = match.status === 'LIVE' || match.status === 'HT';

  const events: MatchEvent[] = Array.isArray(match.events) ? match.events : [];
  const goalEvents = events.filter((e) => e.type === 'GOAL' || e.type === 'PENALTY_GOAL');
  const cardEvents = events.filter((e) => e.type === 'YELLOW_CARD' || e.type === 'RED_CARD');
  const subEvents = events.filter((e) => e.type === 'SUBSTITUTION');

  const triggerStadiumChant = () => {
    try {
      if (typeof window !== 'undefined' && 'AudioContext' in window) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch {
      // Audio fallback
    }
    addToast('Stadium Atmosphere', 'Crowd resonance synthesized', 'INFO');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070b12] text-white flex flex-col justify-between overflow-hidden animate-in fade-in duration-300">
      {/* Top Floodlight Bar */}
      <div className="bg-gradient-to-b from-emerald-950/60 to-transparent p-4 sm:p-6 flex items-center justify-between border-b border-emerald-500/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-600/90 text-white font-mono text-xs font-black shadow-lg shadow-rose-950/50">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>FOOTBUZZ LIVE MODE</span>
          </div>

          <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${mood.badgeStyle}`}>
            {mood.emoji} {mood.label}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setAudioEnabled(!audioEnabled);
              if (!audioEnabled) triggerStadiumChant();
            }}
            className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
              audioEnabled
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
            }`}
            title={audioEnabled ? 'Stadium sound enabled' : 'Enable crowd audio atmosphere'}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{audioEnabled ? 'Sound On' : 'Sound Off'}</span>
          </button>

          <button
            onClick={() => {
              setLiveModeMatchId(null);
              navigateTo('match-centre', { matchId: match.id });
            }}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-1.5"
          >
            <span>Standard View</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setLiveModeMatchId(null)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Exit Live Mode"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Central Stadium Scoreboard */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto w-full px-4 py-6 space-y-8">
        <div className="text-center space-y-1">
          <div className="text-xs sm:text-sm font-mono uppercase tracking-widest text-emerald-400 font-bold">
            {match.competitionName} {match.round ? `· ${match.round}` : ''}
          </div>
          <div className="text-xs text-slate-400">
            {match.venue || 'Stadium'} · {match.city || 'Match Venue'}
          </div>
        </div>

        {/* Big Score Block */}
        <div className="w-full grid grid-cols-3 items-center gap-4 sm:gap-8 bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-blue-500/5 pointer-events-none" />

          {/* Home Team */}
          <div className="flex flex-col items-center text-center space-y-3 relative z-10">
            <ClubCrest name={match.homeTeam.name} code={match.homeTeam.code} crestUrl={match.homeTeam.crestUrl} size="xl" />
            <div>
              <h2 className="text-lg sm:text-2xl font-black font-display text-white">
                {match.homeTeam.name}
              </h2>
              <p className="text-xs text-slate-400">{match.homeTeam.country}</p>
            </div>
          </div>

          {/* Scores & Clock */}
          <div className="flex flex-col items-center justify-center space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono text-xs sm:text-sm font-black">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-live" />
              <span>{match.status === 'HT' ? 'HALF TIME' : match.minute ? `${match.minute}'` : 'LIVE'}</span>
            </div>

            <div className="flex items-center justify-center gap-4">
              <span className="font-mono text-5xl sm:text-7xl font-black text-white tabular-nums tracking-tighter">
                {match.score.home ?? 0}
              </span>
              <span className="font-mono text-3xl sm:text-5xl text-slate-500 font-light">–</span>
              <span className="font-mono text-5xl sm:text-7xl font-black text-white tabular-nums tracking-tighter">
                {match.score.away ?? 0}
              </span>
            </div>

            {match.score.penalties && (
              <div className="text-xs font-mono text-amber-300 font-bold">
                Penalties: {match.score.penalties.home} – {match.score.penalties.away}
              </div>
            )}
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center text-center space-y-3 relative z-10">
            <ClubCrest name={match.awayTeam.name} code={match.awayTeam.code} crestUrl={match.awayTeam.crestUrl} size="xl" />
            <div>
              <h2 className="text-lg sm:text-2xl font-black font-display text-white">
                {match.awayTeam.name}
              </h2>
              <p className="text-xs text-slate-400">{match.awayTeam.country}</p>
            </div>
          </div>
        </div>

        {/* Live Timeline Ticker */}
        <div className="w-full max-w-3xl bg-black/40 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
            <span className="font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" /> Real Provider Telemetry Stream
            </span>
            <span className="text-[11px] font-mono text-emerald-400">
              {events.length} Recorded Match Event{events.length === 1 ? '' : 's'}
            </span>
          </div>

          {events.length > 0 ? (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className={`px-3 py-1.5 rounded-xl border text-xs flex items-center gap-2 shrink-0 ${
                    ev.type === 'GOAL' || ev.type === 'PENALTY_GOAL'
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200'
                      : ev.type === 'RED_CARD'
                      ? 'bg-rose-500/20 border-rose-500/50 text-rose-200'
                      : 'bg-white/5 border-white/10 text-slate-200'
                  }`}
                >
                  <span className="font-mono font-black text-amber-400">{ev.minute}'</span>
                  <span className="font-bold">
                    {ev.type === 'GOAL' ? '⚽' : ev.type === 'YELLOW_CARD' ? '🟨' : ev.type === 'RED_CARD' ? '🔴' : '🔄'} {ev.playerName}
                  </span>
                  <span className="text-slate-400 text-[10px]">({ev.teamName})</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-2 text-xs text-slate-500">
              No live goals or cards recorded yet in this fixture.
            </div>
          )}
        </div>
      </div>

      {/* Bottom Atmosphere Bar */}
      <div className="p-4 bg-black/60 border-t border-white/10 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Real-time polling active (every 20s) · Official sports provider telemetry</span>
        </div>

        <button
          onClick={triggerStadiumChant}
          className="px-3 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 font-bold border border-emerald-500/30 transition-colors flex items-center gap-1.5"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>Synthesize Crowd Roar</span>
        </button>
      </div>
    </div>
  );
};
