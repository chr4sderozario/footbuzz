/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Match Share Card Modal
 * Generates formatted match scorecards, shareable summaries, and quick link copy.
 */

import React, { useState } from 'react';
import { Share2, Copy, Check, X, Trophy, Calendar, MapPin, Sparkles } from 'lucide-react';
import { Match } from '../../types/football';
import { ClubCrest } from '../common/ClubCrest';
import { generateMatchShareText, getMatchMood } from '../../utils/footballUtils';
import { useApp } from '../../context/AppContext';

interface MatchShareModalProps {
  match: Match | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MatchShareModal: React.FC<MatchShareModalProps> = ({ match, isOpen, onClose }) => {
  const { addToast } = useApp();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !match) return null;

  const mood = getMatchMood(match);
  const isFinished = match.status === 'FINISHED';
  const isLive = match.status === 'LIVE' || match.status === 'HT';

  const shareText = generateMatchShareText(match);

  const handleCopyText = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      addToast('Copied to Clipboard', 'Match scorecard summary copied.', 'SUCCESS');
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${match.homeTeam.name} vs ${match.awayTeam.name} — FootBuzz`,
          text: shareText,
          url: window.location.href,
        });
      } catch {
        handleCopyText();
      }
    } else {
      handleCopyText();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-[#0a231b] to-[#009270] text-white p-5 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-mono font-bold tracking-wide">
            <Share2 className="w-3.5 h-3.5 text-emerald-300" />
            <span>SHARE MATCH SCORECARD</span>
          </div>

          <h2 className="text-xl font-black font-display mt-2 text-white">
            Share Match Card
          </h2>
          <p className="text-xs text-emerald-100/90 mt-0.5">
            Share live scores, fixture timings, and telemetry with fellow supporters.
          </p>
        </div>

        {/* Card Preview */}
        <div className="p-5 space-y-4">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-[#04281f] text-white border border-emerald-500/30 shadow-lg space-y-4">
            {/* Top Bar */}
            <div className="flex items-center justify-between text-xs pb-3 border-b border-white/10">
              <span className="font-bold text-emerald-300 truncate max-w-[200px]">
                {match.competitionName}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${mood.badgeStyle}`}>
                {mood.emoji} {mood.label}
              </span>
            </div>

            {/* Score Showcase */}
            <div className="grid grid-cols-3 items-center gap-3 text-center">
              <div className="space-y-2 flex flex-col items-center min-w-0">
                <ClubCrest name={match.homeTeam.name} code={match.homeTeam.code} crestUrl={match.homeTeam.crestUrl} size="lg" />
                <span className="font-bold text-xs sm:text-sm text-white truncate max-w-full">
                  {match.homeTeam.name}
                </span>
              </div>

              <div className="space-y-1">
                {isLive || isFinished ? (
                  <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
                    {match.score.home ?? 0} – {match.score.away ?? 0}
                  </div>
                ) : (
                  <div className="text-lg font-black font-mono text-amber-300">
                    {match.time}
                  </div>
                )}
                <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  {match.status === 'LIVE' ? `LIVE ${match.minute || 45}'` : match.status === 'HT' ? 'HALFTIME' : match.status === 'FINISHED' ? 'FULL TIME' : match.date}
                </div>
              </div>

              <div className="space-y-2 flex flex-col items-center min-w-0">
                <ClubCrest name={match.awayTeam.name} code={match.awayTeam.code} crestUrl={match.awayTeam.crestUrl} size="lg" />
                <span className="font-bold text-xs sm:text-sm text-white truncate max-w-full">
                  {match.awayTeam.name}
                </span>
              </div>
            </div>

            {/* Bottom Venue & Branding */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-white/10">
              <span className="truncate max-w-[180px]">{match.venue || 'Stadium'}</span>
              <span className="font-display font-black text-white text-xs">
                foot<span className="text-emerald-400">buzz</span>
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyText}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-slate-200"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Card Copied!' : 'Copy Score Text'}</span>
            </button>

            <button
              onClick={handleNativeShare}
              className="flex-1 py-2.5 rounded-xl bg-[#009270] hover:bg-[#028060] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Card</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
