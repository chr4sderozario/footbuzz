/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Transfer Market Hub & Contract Radar
 * Verified confirmed transfers, contract expiries, market valuations, and rumors.
 */

import React, { useState } from 'react';
import { ArrowRightLeft, DollarSign, Calendar, X, Search, Clock, TrendingUp } from 'lucide-react';
import { PlayerAvatar } from '../common/PlayerAvatar';

interface TransferHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TransferItem {
  id: string;
  playerName: string;
  fromTeam: string;
  toTeam: string;
  fee: string;
  contractUntil: string;
  status: 'CONFIRMED' | 'AGREED' | 'EXPIRING_SOON';
  date: string;
}

const TRANSFERS: TransferItem[] = [
  {
    id: 't-mbappe',
    playerName: 'Kylian Mbappé',
    fromTeam: 'Paris Saint-Germain',
    toTeam: 'Real Madrid',
    fee: 'Free Transfer (+ €150M Signing Bonus)',
    contractUntil: 'June 2029',
    status: 'CONFIRMED',
    date: '2024 Summer',
  },
  {
    id: 't-chhetri-ext',
    playerName: 'Sunil Chhetri',
    fromTeam: 'Bengaluru FC',
    toTeam: 'Bengaluru FC (Contract Extension)',
    fee: 'Contract Extended',
    contractUntil: 'May 2025',
    status: 'CONFIRMED',
    date: '2024 Season',
  },
  {
    id: 't-alvarez',
    playerName: 'Julián Álvarez',
    fromTeam: 'Manchester City',
    toTeam: 'Atlético Madrid',
    fee: '€75M + €20M Add-ons',
    contractUntil: 'June 2030',
    status: 'CONFIRMED',
    date: '2024 Summer',
  },
  {
    id: 't-olmo',
    playerName: 'Dani Olmo',
    fromTeam: 'RB Leipzig',
    toTeam: 'FC Barcelona',
    fee: '€55M + €7M Add-ons',
    contractUntil: 'June 2030',
    status: 'CONFIRMED',
    date: '2024 Summer',
  },
  {
    id: 't-apreah',
    playerName: 'Apuia (Lalengmawia Ralte)',
    fromTeam: 'Mumbai City FC',
    toTeam: 'Mohun Bagan Super Giant',
    fee: '₹6.2 Crore (Record ISL Domestic Transfer)',
    contractUntil: 'May 2029',
    status: 'CONFIRMED',
    date: '2024 Summer',
  },
];

export const TransferHubModal: React.FC<TransferHubModalProps> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = TRANSFERS.filter(
    (t) =>
      t.playerName.toLowerCase().includes(search.toLowerCase()) ||
      t.fromTeam.toLowerCase().includes(search.toLowerCase()) ||
      t.toTeam.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-[#1e1b4b] to-[#4338ca] text-white p-6 relative shrink-0 space-y-2">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-mono font-bold tracking-wide">
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>TRANSFER RADAR & CONTRACT MONITOR</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-display text-white">
            Transfer Market Hub & Value Tiers
          </h2>

          <p className="text-xs text-indigo-100/90 leading-relaxed">
            Confirmed signings, domestic record deals (ISL), European mega-transfers, and upcoming contract expiries.
          </p>
        </div>

        {/* Search */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search player, club, or league..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-hidden"
          />
        </div>

        {/* List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all space-y-2 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <PlayerAvatar name={item.playerName} size="sm" />
                  <div>
                    <h3 className="font-black text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {item.playerName}
                    </h3>
                    <div className="text-xs text-slate-500 font-semibold mt-0.5 flex items-center gap-1.5">
                      <span>{item.fromTeam}</span>
                      <span>→</span>
                      <strong className="text-slate-900">{item.toTeam}</strong>
                    </div>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#009270] text-[10px] font-bold border border-emerald-200">
                  {item.status}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-indigo-700">{item.fee}</span>
                <span className="text-[11px] text-slate-400">Contract until {item.contractUntil}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Verified Transfer Intelligence</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
