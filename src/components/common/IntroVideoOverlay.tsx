/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Cinematic Video Intro Overlay
 * Always plays the high-impact video intro sequence on website arrival:
 * Speedlines -> 3D Spinning Soccer Ball -> Pulsing Halo Ring -> Official 'fb FootBuzz' Logo Reveal with Confetti
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { FastForward, Sparkles, ArrowRight, Play } from 'lucide-react';

export const IntroVideoOverlay: React.FC<{
  forceShow?: boolean;
  onComplete?: () => void;
}> = ({ forceShow = false, onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [phase, setStage] = useState<'SPEEDLINES' | 'BALL_ZOOM' | 'RING_PULSE' | 'LOGO_REVEAL'>('SPEEDLINES');

  useEffect(() => {
    // Phase 1 -> Ball Zoom at 0.8s
    const t1 = setTimeout(() => {
      setStage('BALL_ZOOM');
    }, 800);

    // Phase 2 -> Ring Pulse at 2.2s
    const t2 = setTimeout(() => {
      setStage('RING_PULSE');
    }, 2200);

    // Phase 3 -> Logo Reveal & Confetti at 3.8s
    const t3 = setTimeout(() => {
      setStage('LOGO_REVEAL');
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#009270', '#22c55e', '#ffffff', '#fbbf24'],
        });
      } catch (e) {
        // ignore fallback
      }
    }, 3800);

    // Phase 4 -> Fade Out at 6.8s
    const t4 = setTimeout(() => {
      setIsFadingOut(true);
    }, 6800);

    // Phase 5 -> Close overlay at 7.3s
    const t5 = setTimeout(() => {
      finishIntro();
    }, 7300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  const finishIntro = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 400);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#052e1e] text-white select-none overflow-hidden font-sans transition-opacity duration-500 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* 1. Tactical Pitch Grid Background with Speedlines */}
      <div className="absolute inset-0 bg-[#074732] overflow-hidden pointer-events-none">
        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#031c12_100%)] opacity-85 z-10" />

        {/* Pulsing Concentric Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full border border-emerald-400/20 opacity-30 animate-ping duration-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full border border-emerald-300/30 opacity-40" />

        {/* Speedlines Effect */}
        <div className="absolute inset-0 flex items-center justify-center opacity-50">
          {[...Array(24)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 bg-gradient-to-t from-emerald-300 via-white to-transparent h-[160%]"
              style={{
                transform: `rotate(${i * 15}deg)`,
                opacity: phase === 'SPEEDLINES' ? 0.9 : 0.4,
                transition: 'opacity 0.4s ease',
              }}
            />
          ))}
        </div>

        {/* Floating Geometry Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/5 text-emerald-300/50 text-2xl animate-bounce">▲</div>
          <div className="absolute top-2/3 right-1/4 text-emerald-200/40 text-3xl animate-pulse">◆</div>
          <div className="absolute bottom-1/4 left-1/3 text-emerald-400/50 text-xl animate-spin">▲</div>
        </div>
      </div>

      {/* Top Header Controls: Skip / Enter App */}
      <div className="absolute top-6 right-6 z-30 flex items-center gap-3">
        <button
          onClick={finishIntro}
          className="px-5 py-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white font-bold text-xs border border-white/30 backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer shadow-xl active:scale-95"
        >
          <span>Enter App</span>
          <FastForward className="w-4 h-4 text-emerald-400" />
        </button>
      </div>

      {/* Main Video Animation Stage Container */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center p-6 max-w-md w-full">
        {/* STAGE 1: Speedlines */}
        {phase === 'SPEEDLINES' && (
          <div className="animate-in fade-in zoom-in duration-300 flex flex-col items-center space-y-4">
            <div className="w-24 h-24 rounded-full border-4 border-emerald-400/50 border-t-emerald-200 animate-spin flex items-center justify-center shadow-2xl">
              <span className="text-4xl">⚽</span>
            </div>
            <div className="text-xs font-mono font-bold tracking-widest text-emerald-200 uppercase animate-pulse">
              FootBuzz Live Match Engine
            </div>
          </div>
        )}

        {/* STAGE 2: 3D Spinning Soccer Ball Zooming In */}
        {phase === 'BALL_ZOOM' && (
          <div className="relative flex items-center justify-center animate-in slide-in-from-left-full duration-500 ease-out">
            <div className="relative">
              {/* White Energy Trail */}
              <div className="absolute -left-36 top-1/2 -translate-y-1/2 w-36 h-14 bg-gradient-to-r from-transparent via-white to-emerald-300 rounded-full blur-xs animate-pulse" />
              <div className="text-8xl sm:text-9xl drop-shadow-[0_0_40px_rgba(255,255,255,1)] animate-spin duration-500">
                ⚽
              </div>
            </div>
          </div>
        )}

        {/* STAGE 3: Ring Pulse */}
        {phase === 'RING_PULSE' && (
          <div className="relative flex items-center justify-center animate-in zoom-in duration-400">
            <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-full border-8 border-white bg-emerald-600/90 shadow-[0_0_60px_rgba(255,255,255,0.9)] flex items-center justify-center animate-pulse">
              <div className="w-44 h-40 rounded-full border-4 border-emerald-100 border-dashed animate-spin flex items-center justify-center">
                <span className="text-7xl sm:text-8xl">⚽</span>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 4: Official 'fb FootBuzz' Logo Reveal */}
        {phase === 'LOGO_REVEAL' && (
          <div className="flex flex-col items-center space-y-6 animate-in zoom-in-75 duration-500">
            {/* Circular Official FootBuzz Logo Emblem from Video */}
            <div className="relative group">
              <div className="absolute inset-0 rounded-full bg-white/50 blur-2xl animate-pulse" />
              <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-white border-8 border-[#009270] shadow-2xl flex flex-col items-center justify-center p-4 relative overflow-hidden text-emerald-800">
                {/* Soccer ball wireframe background */}
                <div className="absolute inset-2 rounded-full border-2 border-[#009270]/30 flex items-center justify-center pointer-events-none">
                  <div className="w-28 h-28 border border-[#009270]/20 rounded-full" />
                </div>

                {/* 'fb' typography */}
                <div className="font-black text-6xl sm:text-7xl tracking-tighter text-[#009270] font-display italic drop-shadow-sm">
                  fb
                </div>

                {/* 'FootBuzz' wordmark */}
                <div className="font-extrabold text-xl sm:text-2xl tracking-tight text-[#009270] font-sans border-t-2 border-[#009270]/40 pt-1 mt-1">
                  FootBuzz
                </div>
              </div>
            </div>

            {/* Subtitle */}
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display">
                Everything Football. One Place.
              </h2>
              <p className="text-xs text-emerald-200 font-medium">
                Live Scores · Tactical Pitch Analytics · Football History
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Progress Bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-64 h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/30">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 via-white to-amber-300 transition-all duration-300"
          style={{
            width:
              phase === 'SPEEDLINES'
                ? '25%'
                : phase === 'BALL_ZOOM'
                ? '50%'
                : phase === 'RING_PULSE'
                ? '75%'
                : '100%',
          }}
        />
      </div>
    </div>
  );
};
