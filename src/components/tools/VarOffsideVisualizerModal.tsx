/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * VAR Review & 3D Offside Line Visualizer Tool
 * Interactive calibrated offside line projection with frame-by-frame scrubbing and official IFAB rule explanations.
 */

import React, { useState } from 'react';
import { Eye, ShieldAlert, CheckCircle2, XCircle, X, Sliders, Sparkles, Video } from 'lucide-react';

interface VarOffsideVisualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VarOffsideVisualizerModal: React.FC<VarOffsideVisualizerModalProps> = ({ isOpen, onClose }) => {
  const [offsideLineX, setOffsideLineX] = useState<number>(54); // percentage across pitch
  const [attackerShoulderX, setAttackerShoulderX] = useState<number>(55.2);
  const [frameIndex, setFrameIndex] = useState<number>(18);
  const [scenario, setScenario] = useState<'TIGHT_OFFSIDE' | 'GOAL_CONFIRMED' | 'HANDBALL_REVIEW'>('TIGHT_OFFSIDE');

  if (!isOpen) return null;

  const isOffside = attackerShoulderX > offsideLineX;
  const deltaMm = Math.round(Math.abs(attackerShoulderX - offsideLineX) * 28);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-[#1e1304] to-slate-950 text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold tracking-wide border border-amber-500/30 mb-2">
            <Eye className="w-3.5 h-3.5" />
            <span>HAWK-EYE 3D OFFSHIDE CALIBRATOR</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-display text-white">
            VAR Review & Offside Line Projector
          </h2>
          <p className="text-xs text-slate-300">
            Simulate calibrated 3D geometric vanishing lines, contact point freeze-frames, and IFAB Law 11 rulings.
          </p>
        </div>

        {/* Visualizer Canvas Area */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Virtual Pitch Canvas */}
          <div className="relative w-full aspect-video bg-gradient-to-b from-[#1b4332] via-[#2d6a4f] to-[#1b4332] rounded-2xl border-4 border-slate-800 overflow-hidden shadow-inner flex items-center justify-center select-none">
            {/* Perspective Pitch Strips */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Defender Last Part Line (Blue) */}
            <div
              style={{ left: `${offsideLineX}%` }}
              className="absolute inset-y-0 w-0.5 bg-blue-400 z-20 shadow-[0_0_12px_#60a5fa]"
            >
              <span className="absolute top-2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-mono px-1.5 py-0.5 rounded font-bold">
                Defender Last Boot
              </span>
            </div>

            {/* Attacker Lead Line (Red) */}
            <div
              style={{ left: `${attackerShoulderX}%` }}
              className="absolute inset-y-0 w-0.5 bg-rose-500 z-20 shadow-[0_0_12px_#f43f5e]"
            >
              <span className="absolute bottom-2 -translate-x-1/2 bg-rose-600 text-white text-[9px] font-mono px-1.5 py-0.5 rounded font-bold">
                Attacker Shoulder
              </span>
            </div>

            {/* Decision Stamp Overlay */}
            <div className="absolute top-4 right-4 z-30">
              {isOffside ? (
                <div className="px-3 py-1.5 rounded-xl bg-rose-600/90 text-white font-black font-mono text-xs flex items-center gap-1.5 shadow-lg animate-bounce">
                  <XCircle className="w-4 h-4" />
                  <span>OFFSIDE (+{deltaMm}mm)</span>
                </div>
              ) : (
                <div className="px-3 py-1.5 rounded-xl bg-emerald-600/90 text-white font-black font-mono text-xs flex items-center gap-1.5 shadow-lg animate-bounce">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ONSIDE / GOAL (-{deltaMm}mm)</span>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Calibration Controls */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold text-slate-700">
                <span>Attacker Lead Position (Red Line):</span>
                <span className="font-mono text-rose-600">{attackerShoulderX.toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="45"
                max="65"
                step="0.1"
                value={attackerShoulderX}
                onChange={(e) => setAttackerShoulderX(parseFloat(e.target.value))}
                className="w-full accent-rose-600"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between font-bold text-slate-700">
                <span>Defender Calibrated Line (Blue Line):</span>
                <span className="font-mono text-blue-600">{offsideLineX.toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="45"
                max="65"
                step="0.1"
                value={offsideLineX}
                onChange={(e) => setOffsideLineX(parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            {/* Frame Scrubber */}
            <div className="space-y-1.5 pt-1 border-t border-slate-200">
              <div className="flex justify-between font-bold text-slate-700">
                <span>Pass Contact Point Frame (50 FPS):</span>
                <span className="font-mono text-amber-600">Frame #{frameIndex}</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={frameIndex}
                onChange={(e) => setFrameIndex(parseInt(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
          </div>

          {/* IFAB Law 11 Explanation Box */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
            <div className="font-extrabold text-[11px] flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
              <span>IFAB Law 11 & Semi-Automated Offside Technology (SAOT)</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-800">
              The hands and arms of all players, including goalkeepers, are not considered. For the purpose of determining offside, the upper boundary of the arm is in line with the bottom of the armpit.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <span className="text-[11px] font-mono text-slate-400">Hawk-Eye Official Protocol Simulator</span>
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
