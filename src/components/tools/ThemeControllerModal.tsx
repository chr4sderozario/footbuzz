/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Theme & Stadium Display Controller
 */

import React from 'react';
import { Sun, Moon, Sparkles, X, Check, Sliders } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ThemeControllerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeControllerModal: React.FC<ThemeControllerModalProps> = ({ isOpen, onClose }) => {
  const { theme, toggleTheme, addToast } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-[#132e24] to-[#009270] text-white p-6 relative shrink-0 space-y-2">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-mono font-bold tracking-wide">
            <Sliders className="w-3.5 h-3.5" />
            <span>DISPLAY & ATMOSPHERE</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-display text-white">
            Display Mode & Atmosphere
          </h2>

          <p className="text-xs text-emerald-100/90 leading-relaxed">
            Customize contrast and stadium theme for night match watching.
          </p>
        </div>

        {/* Options */}
        <div className="p-6 space-y-3">
          <button
            onClick={() => {
              if (theme === 'dark') toggleTheme();
              addToast('Daylight Match Mode', 'Activated bright daylight display.', 'INFO');
            }}
            className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
              theme === 'light'
                ? 'border-[#009270] bg-emerald-50 text-[#009270] ring-2 ring-[#009270]/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <Sun className="w-5 h-5 text-amber-500" />
              <div>
                <div className="font-bold text-sm text-slate-900">Daylight Match (Clean White)</div>
                <div className="text-xs text-slate-500">Cricbuzz-inspired bright readability</div>
              </div>
            </div>
            {theme === 'light' && <Check className="w-5 h-5 text-[#009270]" />}
          </button>

          <button
            onClick={() => {
              if (theme === 'light') toggleTheme();
              addToast('Floodlight Night Mode', 'Activated high-contrast floodlight stadium theme.', 'INFO');
            }}
            className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
              theme === 'dark'
                ? 'border-[#009270] bg-slate-900 text-white ring-2 ring-[#009270]/40'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-indigo-400" />
              <div>
                <div className="font-bold text-sm text-slate-900">Floodlit Stadium (Dark Mode)</div>
                <div className="text-xs text-slate-500">Deep obsidian arena mode for night games</div>
              </div>
            </div>
            {theme === 'dark' && <Check className="w-5 h-5 text-emerald-400" />}
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Instant Display Preferences</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
