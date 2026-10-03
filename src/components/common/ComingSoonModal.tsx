/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Feature Preview & "Coming Soon" Modal
 * High-fidelity preview for Live AI Commentary, Audio Broadcasts & Live Match Chat.
 */

import React, { useState } from 'react';
import {
  X,
  Mic,
  MessageSquare,
  Sparkles,
  Radio,
  Bell,
  CheckCircle2,
  Volume2,
  Users,
  Zap,
  Bot,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export type ComingSoonFeatureType = 'ai-commentary' | 'live-chat' | 'ai-audio';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureType?: ComingSoonFeatureType;
  matchTitle?: string;
}

export const ComingSoonModal: React.FC<ComingSoonModalProps> = ({
  isOpen,
  onClose,
  featureType = 'ai-commentary',
  matchTitle,
}) => {
  const { addToast } = useApp();
  const [isNotified, setIsNotified] = useState(false);

  if (!isOpen) return null;

  const handleNotifyToggle = () => {
    setIsNotified(!isNotified);
    if (!isNotified) {
      addToast(
        'Notification Set!',
        'You will be notified when Live AI Commentary & Live Match Chat go live.',
        'SUCCESS'
      );
    }
  };

  const isAICommentary = featureType === 'ai-commentary' || featureType === 'ai-audio';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden text-slate-900 flex flex-col max-h-[92vh]">
        {/* Modal Hero Banner */}
        <div className="relative bg-gradient-to-br from-[#009270] via-[#028060] to-[#090d16] text-white p-6 sm:p-8 space-y-3">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 text-white/80 hover:text-white rounded-full bg-black/20 hover:bg-black/40 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[11px] font-mono font-black uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Coming Soon · Feature Preview</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-display text-white leading-tight">
            {isAICommentary
              ? 'Live AI Match Commentary & Audio Broadcast'
              : 'Live Match Chat & Fan Lounge'}
          </h2>

          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            {matchTitle ? `For ${matchTitle}` : 'Experience the next generation of football matchday engagement.'}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-slate-800">
          {/* Feature Highlights Grid */}
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2.5 text-xs font-black text-slate-900 uppercase tracking-wider font-mono">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-[#009270]">
                  <Mic className="w-4 h-4" />
                </div>
                <span>Real-Time AI Voice Commentary</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dynamic, multilingual ball-by-ball AI audio narration generated directly from verified live match telemetry and tactical shifts.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2.5 text-xs font-black text-slate-900 uppercase tracking-wider font-mono">
                <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <span>Live Match Fan Lounge & Chat</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect with passionate fans worldwide, participate in live score predictions, debate VAR decisions, and celebrate match milestones in real time.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2.5 text-xs font-black text-slate-900 uppercase tracking-wider font-mono">
                <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                  <Zap className="w-4 h-4" />
                </div>
                <span>Tactical Insights & Instant Replay AI</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                In-depth AI breakdown of team formations, pressing traps, expected goal (xG) swings, and player heat maps as the game unfolds.
              </p>
            </div>
          </div>

          {/* Development Status Box */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#009270] animate-ping" />
              <div>
                <div className="font-black text-emerald-950 font-display">In Final Engineering & Audio Testing</div>
                <div className="text-[11px] text-emerald-800">Target release in upcoming platform update</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            onClick={handleNotifyToggle}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 ${
              isNotified
                ? 'bg-emerald-100 text-[#009270] border border-emerald-300'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            {isNotified ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#009270]" />
                <span>You're on the early access list!</span>
              </>
            ) : (
              <>
                <Bell className="w-4 h-4 text-amber-300" />
                <span>Notify Me on Launch</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors"
          >
            Back to Match
          </button>
        </div>
      </div>
    </div>
  );
};
