/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Stadium Directory & Seat View Guide
 */

import React, { useState } from 'react';
import { MapPin, Navigation, Users, X, Search, Shield, Info } from 'lucide-react';

interface StadiumGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface StadiumInfo {
  id: string;
  name: string;
  city: string;
  country: string;
  capacity: number;
  homeTeams: string[];
  openedYear: number;
  pitchSize: string;
  metroTransit: string;
  gateAdvice: string;
}

const STADIUMS: StadiumInfo[] = [
  {
    id: 'stad-saltlake',
    name: 'Vivekananda Yuba Bharati Krirangan (Salt Lake Stadium)',
    city: 'Kolkata, West Bengal',
    country: 'India',
    capacity: 68000,
    homeTeams: ['Mohun Bagan Super Giant', 'East Bengal FC', 'India National Team'],
    openedYear: 1984,
    pitchSize: '105m × 68m (Natural Grass)',
    metroTransit: 'Salt Lake Stadium Metro Station (Green Line Exit 2)',
    gateAdvice: 'Gates 1 & 2 for VIP/Hospitality; Gate 3 for Block C/D North Stand general admission.',
  },
  {
    id: 'stad-kanteerava',
    name: 'Sree Kanteerava Outdoor Stadium',
    city: 'Bengaluru, Karnataka',
    country: 'India',
    capacity: 25810,
    homeTeams: ['Bengaluru FC ("The Fortress")'],
    openedYear: 1997,
    pitchSize: '105m × 68m',
    metroTransit: 'Vidhana Soudha / Cubbon Park Metro Stations (Purple Line)',
    gateAdvice: 'West Block Blues enter via Gate 2; East Stand Family section via Gate 1.',
  },
  {
    id: 'stad-bernabeu',
    name: 'Estadio Santiago Bernabéu',
    city: 'Madrid',
    country: 'Spain',
    capacity: 84000,
    homeTeams: ['Real Madrid C.F.'],
    openedYear: 1947,
    pitchSize: '105m × 68m (Retractable Hybrid Pitch)',
    metroTransit: 'Santiago Bernabéu Metro Station (Line 10)',
    gateAdvice: 'Retractable roof operates on rain forecast; Gate 44 for Tour & Trophy Museum access.',
  },
  {
    id: 'stad-etihad',
    name: 'Etihad Stadium (City of Manchester)',
    city: 'Manchester',
    country: 'England',
    capacity: 53400,
    homeTeams: ['Manchester City'],
    openedYear: 2002,
    pitchSize: '105m × 68m (SISGrass Hybrid)',
    metroTransit: 'Etihad Campus Metrolink Tram Stop',
    gateAdvice: 'Colin Bell Stand via Entrance M; turnstiles open 2 hours prior to kickoff.',
  },
];

export const StadiumGuideModal: React.FC<StadiumGuideModalProps> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = STADIUMS.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase()) ||
      s.homeTeams.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-[#1b3a2f] to-[#009270] text-white p-6 relative shrink-0 space-y-2">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-mono font-bold tracking-wide">
            <MapPin className="w-3.5 h-3.5" />
            <span>GROUND DIRECTORY & SEAT GUIDE</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-display text-white">
            Stadium Guide & Transit Directions
          </h2>

          <p className="text-xs text-emerald-100/90 leading-relaxed">
            Capacity records, pitch surface specifications, metro transit routes, and gate advice for major football grounds.
          </p>
        </div>

        {/* Search */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by stadium, city (Kolkata, Madrid), or home team..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-hidden"
          />
        </div>

        {/* List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#009270] hover:shadow-md transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">{s.name}</h3>
                  <div className="text-xs text-slate-500 font-medium">
                    {s.city}, {s.country} · Opened {s.openedYear}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Capacity</span>
                  <div className="text-sm font-black font-mono text-[#009270]">
                    {s.capacity.toLocaleString()} seats
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-600">
                <strong>Home Teams: </strong>
                <span>{s.homeTeams.join(' · ')}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <Navigation className="w-3.5 h-3.5 text-[#009270] shrink-0 mt-0.5" />
                  <span><strong>Transit: </strong>{s.metroTransit}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Gate Entry: </strong>{s.gateAdvice}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Official Stadium Access Standards</span>
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
