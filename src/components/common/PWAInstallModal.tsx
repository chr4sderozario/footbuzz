/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Complete Progressive Web App (PWA) Install Modal
 * Interactive platform-specific installation guide for Desktop, Android & iOS.
 */

import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  Monitor,
  X,
  CheckCircle2,
  Share,
  PlusSquare,
  Sparkles,
  Zap,
  WifiOff,
  ShieldCheck,
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [platformTab, setPlatformTab] = useState<'AUTO' | 'IOS' | 'ANDROID' | 'DESKTOP'>(
    isIOS ? 'IOS' : 'AUTO'
  );

  if (!isOpen) return null;

  const handleDirectInstall = async () => {
    if (isInstallable) {
      await install();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#009270] via-[#028060] to-[#091f16] text-white p-6 relative shrink-0 space-y-2">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-mono font-bold tracking-wide">
            <Download className="w-3.5 h-3.5" />
            <span>STANDALONE APPLICATION</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-display text-white">
            Download & Install FootBuzz App
          </h2>

          <p className="text-xs text-emerald-100/90 leading-relaxed">
            Install FootBuzz directly on your phone, tablet, or desktop with instant launch, offline score caching, and fullscreen match immersion.
          </p>
        </div>

        {/* Platform Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold shrink-0">
          <button
            onClick={() => setPlatformTab('AUTO')}
            className={`flex-1 py-3 px-2 text-center border-b-2 transition-colors ${
              platformTab === 'AUTO'
                ? 'border-[#009270] text-[#009270] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            ⚡ Quick Install
          </button>
          <button
            onClick={() => setPlatformTab('IOS')}
            className={`flex-1 py-3 px-2 text-center border-b-2 transition-colors ${
              platformTab === 'IOS'
                ? 'border-[#009270] text-[#009270] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            🍎 iPhone / iPad
          </button>
          <button
            onClick={() => setPlatformTab('ANDROID')}
            className={`flex-1 py-3 px-2 text-center border-b-2 transition-colors ${
              platformTab === 'ANDROID'
                ? 'border-[#009270] text-[#009270] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            🤖 Android
          </button>
          <button
            onClick={() => setPlatformTab('DESKTOP')}
            className={`flex-1 py-3 px-2 text-center border-b-2 transition-colors ${
              platformTab === 'DESKTOP'
                ? 'border-[#009270] text-[#009270] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            💻 PC / Mac
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Quick Install Tab */}
          {platformTab === 'AUTO' && (
            <div className="space-y-4">
              {isInstallable ? (
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#009270] text-white flex items-center justify-center mx-auto shadow-md">
                    <Download className="w-6 h-6 animate-bounce" />
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900">Your Browser Supports 1-Click Install</h3>
                  <p className="text-xs text-slate-600">
                    Click the button below to prompt direct app installation to your device's home screen or desktop taskbar.
                  </p>
                  <button
                    onClick={handleDirectInstall}
                    className="w-full py-3 rounded-xl bg-[#009270] hover:bg-[#028060] text-white text-xs font-black transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download App Now</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#009270]" />
                      <span>Native Web App Architecture</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      FootBuzz is built with Progressive Web App (PWA) standards. It does not require bloated 100MB downloads from the App Store or Play Store—you get the full standalone app directly from this browser!
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <WifiOff className="w-4 h-4 text-[#009270] mb-1" />
                      <div className="font-bold text-slate-800">Offline Caching</div>
                      <div className="text-[11px] text-slate-500">View saved matches with no signal</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <ShieldCheck className="w-4 h-4 text-[#009270] mb-1" />
                      <div className="font-bold text-slate-800">Zero Storage Lag</div>
                      <div className="text-[11px] text-slate-500">Takes under 2MB of memory</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* iOS Safari Guide */}
          {platformTab === 'IOS' && (
            <div className="space-y-3 text-xs leading-relaxed text-slate-700">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                <strong>Apple iOS Requirement:</strong> Apple requires using <strong>Safari browser</strong> to install Progressive Web Apps on iPhones and iPads.
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-6 h-6 rounded-full bg-[#009270] text-white flex items-center justify-center font-bold text-xs shrink-0">1</span>
                  <div>
                    <div className="font-bold text-slate-900">Tap the Share Icon</div>
                    <div className="text-slate-500 text-[11px]">At the bottom of your Safari screen, tap the square icon with the upward arrow (Share).</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-6 h-6 rounded-full bg-[#009270] text-white flex items-center justify-center font-bold text-xs shrink-0">2</span>
                  <div>
                    <div className="font-bold text-slate-900">Select "Add to Home Screen"</div>
                    <div className="text-slate-500 text-[11px]">Scroll down in the action sheet and select <strong>Add to Home Screen</strong> (with the plus sign icon).</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-6 h-6 rounded-full bg-[#009270] text-white flex items-center justify-center font-bold text-xs shrink-0">3</span>
                  <div>
                    <div className="font-bold text-slate-900">Tap "Add" in Top Right</div>
                    <div className="text-slate-500 text-[11px]">FootBuzz will be placed on your home screen as a standalone football app icon!</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Android Chrome Guide */}
          {platformTab === 'ANDROID' && (
            <div className="space-y-3 text-xs leading-relaxed text-slate-700">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-[#009270] text-white flex items-center justify-center font-bold text-xs shrink-0">1</span>
                <div>
                  <div className="font-bold text-slate-900">Open Chrome Menu</div>
                  <div className="text-slate-500 text-[11px]">Tap the three vertical dots (⋮) in the top-right corner of Google Chrome.</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-[#009270] text-white flex items-center justify-center font-bold text-xs shrink-0">2</span>
                <div>
                  <div className="font-bold text-slate-900">Tap "Install App" or "Add to Home screen"</div>
                  <div className="text-slate-500 text-[11px]">Android will generate a verified WebAPK that integrates seamlessly with your notification shade.</div>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Guide */}
          {platformTab === 'DESKTOP' && (
            <div className="space-y-3 text-xs leading-relaxed text-slate-700">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-[#009270] text-white flex items-center justify-center font-bold text-xs shrink-0">1</span>
                <div>
                  <div className="font-bold text-slate-900">Check Your Address Bar</div>
                  <div className="text-slate-500 text-[11px]">Look for the computer/down-arrow icon on the right side of the address bar in Chrome or Edge.</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-[#009270] text-white flex items-center justify-center font-bold text-xs shrink-0">2</span>
                <div>
                  <div className="font-bold text-slate-900">Click "Install FootBuzz"</div>
                  <div className="text-slate-500 text-[11px]">Launches in its own dedicated distraction-free window with taskbar pinning.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] font-mono text-slate-400">PWA v2.4 Compliant</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
