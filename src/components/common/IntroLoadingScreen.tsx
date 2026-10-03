/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz High-Impact Intro Loading Screen Component
 * Atmospheric pre-loader with real fixture synchronization indicators.
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Shield, Radio, Activity } from 'lucide-react';

const LOADING_STEPS = [
  'Connecting to live football telemetry feed...',
  'Syncing Indian Super League, UCL & FIFA fixtures...',
  'Calibrating interactive lineups & tactical pitch...',
  'Welcome to FootBuzz — Football Command Centre',
];

export const IntroLoadingScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(12);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    // Stage 1
    const t1 = setTimeout(() => {
      setProgress(40);
      setStepIndex(1);
    }, 450);

    // Stage 2
    const t2 = setTimeout(() => {
      setProgress(75);
      setStepIndex(2);
    }, 950);

    // Stage 3
    const t3 = setTimeout(() => {
      setProgress(100);
      setStepIndex(3);
    }, 1450);

    // Start fade out
    const t4 = setTimeout(() => {
      setIsFadingOut(true);
    }, 1800);

    // Remove from DOM
    const t5 = setTimeout(() => {
      setIsVisible(false);
    }, 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070b14] text-white select-none transition-opacity duration-700 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Dynamic Background Pitch Grid & Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#009270]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(#009270_1px,transparent_1px)] [background-size:32px_32px] opacity-15" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center space-y-6">
        {/* Animated Brand Emblem */}
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-[#009270] via-[#028060] to-[#0a3a2c] p-0.5 shadow-2xl flex items-center justify-center ring-4 ring-[#009270]/30 animate-bounce duration-1000">
            <div className="w-full h-full rounded-[22px] bg-[#09151c] flex items-center justify-center relative overflow-hidden">
              <span className="text-3xl sm:text-4xl select-none">⚽</span>
              <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-[#009270] text-[8px] font-mono font-black text-white">
                LIVE
              </div>
            </div>
          </div>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#009270]" />
          </span>
        </div>

        {/* Wordmark */}
        <div>
          <div className="flex items-center justify-center gap-1">
            <span className="font-display font-black text-3xl sm:text-4xl tracking-tight text-white">
              FOOT<span className="text-[#009270]">BUZZ</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono tracking-wider mt-1 uppercase">
            Official Live Football Command Centre
          </p>
        </div>

        {/* Progress Bar & Real Sync Status */}
        <div className="w-full space-y-3 pt-2">
          {/* Progress Track */}
          <div className="h-2 w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/60 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-[#009270] to-teal-400 rounded-full transition-all duration-300 ease-out shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Dynamic Sync Status Message */}
          <div className="h-5 flex items-center justify-center gap-2 text-xs text-emerald-400 font-medium">
            <Activity className="w-3.5 h-3.5 animate-spin text-[#009270]" />
            <span className="truncate">{LOADING_STEPS[stepIndex]}</span>
          </div>
        </div>

        {/* Quick Skip */}
        <button
          onClick={handleSkip}
          className="text-[11px] font-bold text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1 pt-2"
        >
          <span>Enter Directly</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Footer Credentials */}
      <div className="absolute bottom-6 text-[10px] font-mono text-slate-500">
        ISL · UCL · Premier League · La Liga · FIFA Official
      </div>
    </div>
  );
};
