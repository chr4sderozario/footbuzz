/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Official Club Crest Vector Archive & Heritage Evolution Tool
 * High-definition SVG vectors and historical crest evolutions for major world clubs.
 */

import React, { useState } from 'react';
import { Shield, Sparkles, Search, X, Download, ExternalLink } from 'lucide-react';
import { TEAMS } from '../../data/teams';
import { ClubCrest } from '../common/ClubCrest';

interface ClubCrestArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClubCrestArchiveModal: React.FC<ClubCrestArchiveModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClub, setSelectedClub] = useState<any>(null);

  if (!isOpen) return null;

  const filtered = TEAMS.filter((t) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return t.name.toLowerCase().includes(q) || (t.country && t.country.toLowerCase().includes(q));
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-[#022b1e] text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold tracking-wide border border-emerald-500/30 mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>HERITAGE CREST & EMBLEM REPOSITORY</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-display text-white">
            Official Club Crest & Flag Vector Archive
          </h2>
          <p className="text-xs text-slate-300">
            Vector emblems, primary brand colors, foundation years, and heraldry history for global football clubs.
          </p>
        </div>

        {/* Search */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs shrink-0">
          <div className="relative max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search club or nation crest (e.g. Mohun Bagan, Arsenal, Real Madrid)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-[#009270]"
            />
          </div>
        </div>

        {/* Crests Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 flex-1">
          {filtered.map((club) => (
            <div
              key={club.id}
              onClick={() => setSelectedClub(club)}
              className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-[#009270] shadow-xs hover:shadow-md transition-all cursor-pointer text-center space-y-2.5 group flex flex-col items-center justify-between"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-50 p-2 flex items-center justify-center border border-slate-100 group-hover:scale-105 transition-transform shadow-2xs">
                <ClubCrest
                  name={club.name}
                  code={club.code}
                  crestUrl={club.crestUrl}
                  country={club.country}
                  size="md"
                />
              </div>

              <div>
                <div className="font-extrabold text-xs text-slate-900 line-clamp-1 group-hover:text-[#009270] transition-colors">
                  {club.name}
                </div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">{club.country || 'Club'}</div>
              </div>

              <div className="text-[9px] font-mono font-bold text-[#009270] bg-emerald-50 px-2 py-0.5 rounded-full w-full truncate">
                {club.primaryColor ? `Hex ${club.primaryColor}` : 'Official Vector'}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <span className="text-[11px] font-mono text-slate-400">SVG & Vector High-Fidelity Graphics</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
