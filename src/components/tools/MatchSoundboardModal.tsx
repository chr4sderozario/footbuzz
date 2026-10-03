/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Stadium Soundboard & Live Audio Effects
 * Web Audio API synthesized matchday sounds: whistle, goal airhorn, crowd roar, VAR chime.
 */

import React, { useState } from 'react';
import { Volume2, VolumeX, X, Play, Radio, Flame, Sparkles, Bell } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MatchSoundboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MatchSoundboardModal: React.FC<MatchSoundboardModalProps> = ({ isOpen, onClose }) => {
  const { addToast } = useApp();
  const [activeSound, setActiveSound] = useState<string | null>(null);

  if (!isOpen) return null;

  // Synthesize realistic matchday sounds using Web Audio API
  const playSynthesizedSound = (type: 'WHISTLE' | 'GOAL_HORN' | 'CROWD_ROAR' | 'VAR_CHIME') => {
    setActiveSound(type);
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === 'WHISTLE') {
        // High-pitched referee whistle trill (two sine waves with slight frequency beating)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'triangle';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(2600, ctx.currentTime);
        osc2.frequency.setValueAtTime(2640, ctx.currentTime);

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 0.8);
        osc2.stop(ctx.currentTime + 0.8);
      } else if (type === 'GOAL_HORN') {
        // Deep resonant stadium foghorn
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(110, ctx.currentTime); // Low A
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 1.2);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.8);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.8);
      } else if (type === 'VAR_CHIME') {
        // Futuristic double chime
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.2); // A5
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.7);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.7);
      } else if (type === 'CROWD_ROAR') {
        // Noise buffer simulation
        const bufferSize = ctx.sampleRate * 1.5;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.8));
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.3, ctx.currentTime);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
      }
    } catch {
      // Audio not permitted or supported
    }

    setTimeout(() => setActiveSound(null), 1200);
  };

  const soundItems = [
    {
      id: 'WHISTLE',
      title: 'Referee Match Whistle',
      description: 'Official 2.6kHz trill used for kickoff, fouls, and full-time.',
      icon: '📢',
      color: 'bg-amber-50 border-amber-200 text-amber-900',
    },
    {
      id: 'GOAL_HORN',
      title: 'Stadium Goal Foghorn',
      description: 'Deafening European arena goal siren for celebrations.',
      icon: '🚨',
      color: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    },
    {
      id: 'CROWD_ROAR',
      title: 'Stadium Atmosphere Roar',
      description: '60,000+ supporter roar simulation for goal moments.',
      icon: '🏟️',
      color: 'bg-blue-50 border-blue-200 text-blue-900',
    },
    {
      id: 'VAR_CHIME',
      title: 'VAR Decision Review Chime',
      description: 'Official audio broadcast indicator for video review checks.',
      icon: '📺',
      color: 'bg-purple-50 border-purple-200 text-purple-900',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-[#004e38] to-[#009270] text-white p-6 relative shrink-0 space-y-2">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-mono font-bold tracking-wide">
            <Volume2 className="w-3.5 h-3.5" />
            <span>STADIUM AUDIO ENGINE</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-display text-white">
            Live Match Soundboard & Atmosphere
          </h2>

          <p className="text-xs text-emerald-100/90 leading-relaxed">
            Real-time synthesized stadium audio effects. Test referee whistles, goal celebration foghorns, and crowd acoustics right in your browser.
          </p>
        </div>

        {/* Sound List */}
        <div className="p-6 space-y-3">
          {soundItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                activeSound === item.id
                  ? 'border-[#009270] bg-emerald-50 ring-2 ring-[#009270]/40 scale-[1.01]'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl">{item.icon}</span>
                <div className="min-w-0">
                  <div className="font-extrabold text-sm text-slate-900">{item.title}</div>
                  <div className="text-xs text-slate-500 leading-snug">{item.description}</div>
                </div>
              </div>

              <button
                onClick={() => playSynthesizedSound(item.id as any)}
                className="px-4 py-2 rounded-xl bg-[#009270] hover:bg-[#028060] text-white text-xs font-black shrink-0 transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Play</span>
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Synthesized via HTML5 Web Audio API</span>
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
