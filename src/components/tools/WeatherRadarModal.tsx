/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Matchday Weather & Pitch Conditions Radar
 */

import React from 'react';
import { CloudRain, Wind, Droplets, Thermometer, X, Shield, Sparkles } from 'lucide-react';

interface WeatherRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
  stadiumName?: string;
  city?: string;
}

export const WeatherRadarModal: React.FC<WeatherRadarModalProps> = ({
  isOpen,
  onClose,
  stadiumName = 'Salt Lake Stadium',
  city = 'Kolkata, India',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-[#132e3a] to-[#0284c7] text-white p-6 relative shrink-0 space-y-2">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-mono font-bold tracking-wide">
            <CloudRain className="w-3.5 h-3.5 text-sky-300" />
            <span>METEOROLOGY & SURFACE RADAR</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-display text-white">
            Matchday Weather & Pitch Radar
          </h2>

          <p className="text-xs text-sky-100/90 leading-relaxed">
            Atmospheric conditions, pitch dampness index, and wind drag impact for {stadiumName}.
          </p>
        </div>

        {/* Current Conditions Card */}
        <div className="p-6 space-y-4">
          <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-200 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-sky-700 font-bold">
                Live Ground Climate
              </span>
              <div className="text-3xl font-black text-slate-900 font-mono">27°C</div>
              <div className="text-xs text-slate-600 font-medium">Partly Cloudy · Moderate Breeze</div>
            </div>
            <div className="text-4xl">⛅</div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <Droplets className="w-4 h-4 text-sky-600 mx-auto mb-1" />
              <div className="text-[10px] text-slate-400">Humidity</div>
              <div className="font-mono font-black text-slate-800">64%</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <Wind className="w-4 h-4 text-sky-600 mx-auto mb-1" />
              <div className="text-[10px] text-slate-400">Wind Velocity</div>
              <div className="font-mono font-black text-slate-800">14 km/h</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <Thermometer className="w-4 h-4 text-sky-600 mx-auto mb-1" />
              <div className="text-[10px] text-slate-400">Pitch Bounce</div>
              <div className="font-mono font-black text-[#009270]">Optimal</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1 text-slate-600">
            <strong className="text-slate-900">Tactical Impact Report:</strong>
            <p className="text-[11px] leading-relaxed">
              Fast natural turf surface with pre-kickoff sprinkler treatment. Low rain risk expected during both halves; favorable for high-tempo passing and ground-level linkup play.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>{city} · Telemetry Feed</span>
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
