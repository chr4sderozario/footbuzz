/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Complete Device Selection & Direct Download Modal
 * Allows users to choose their device (Android APK, Windows PC EXE, macOS, iOS, Linux)
 * and directly download packages or install seamlessly to their home screen / desktop.
 */

import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  Monitor,
  Apple,
  X,
  CheckCircle2,
  Share,
  PlusSquare,
  Sparkles,
  Zap,
  WifiOff,
  ShieldCheck,
  Terminal,
  ArrowRight,
  ExternalLink,
  Laptop,
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { useApp } from '../../context/AppContext';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type DevicePlatform = 'ANDROID' | 'WINDOWS' | 'IOS' | 'MACOS' | 'LINUX';

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { addToast } = useApp();

  // Auto-detect default platform
  const [selectedDevice, setSelectedDevice] = useState<DevicePlatform>(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent.toLowerCase();
      if (/android/.test(ua)) return 'ANDROID';
      if (/iphone|ipad|ipod/.test(ua)) return 'IOS';
      if (/macintosh|mac os x/.test(ua)) return 'MACOS';
      if (/linux/.test(ua)) return 'LINUX';
      if (/windows|win32/.test(ua)) return 'WINDOWS';
    }
    return 'ANDROID';
  });

  const [downloadingPlatform, setDownloadingPlatform] = useState<string | null>(null);

  if (!isOpen) return null;

  const triggerDownload = (url: string, filename: string, platformName: string) => {
    setDownloadingPlatform(platformName);
    addToast(
      `Downloading ${filename}`,
      `Your browser is downloading the ${platformName} application package.`,
      'INFO'
    );

    // Direct browser download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloadingPlatform(null);
      addToast(
        'Download Complete',
        `${filename} saved to your downloads! Open it to complete setup.`,
        'SUCCESS'
      );
    }, 1500);
  };

  const handleNativePWAInstall = async () => {
    if (isInstallable) {
      try {
        await install();
        addToast('Install Prompt Opened', 'Check your screen to confirm adding to Home Screen.', 'SUCCESS');
        onClose();
      } catch (err) {
        console.warn('Install error:', err);
      }
    } else {
      addToast('Direct Install', 'Please use the direct download option below or your browser menu.', 'INFO');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900 overflow-hidden flex flex-col max-h-[92vh]">
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
            <span>DIRECT DEVICE DOWNLOAD & INSTALL</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-display text-white">
            Select Your Device to Download FootBuzz
          </h2>

          <p className="text-xs text-emerald-100/90 leading-relaxed">
            Choose your device below to download the native package format (.apk for Android, .exe for Windows PC, .zip for Mac, or install directly to your home screen).
          </p>
        </div>

        {/* Device Platform Selector Ribbon */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setSelectedDevice('ANDROID')}
            className={`flex-1 py-3 px-3 text-center border-b-2 whitespace-nowrap transition-colors flex items-center justify-center gap-1.5 ${
              selectedDevice === 'ANDROID'
                ? 'border-[#009270] text-[#009270] bg-white font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>🤖 Android (.apk)</span>
          </button>

          <button
            onClick={() => setSelectedDevice('WINDOWS')}
            className={`flex-1 py-3 px-3 text-center border-b-2 whitespace-nowrap transition-colors flex items-center justify-center gap-1.5 ${
              selectedDevice === 'WINDOWS'
                ? 'border-[#009270] text-[#009270] bg-white font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>💻 Windows PC (.exe)</span>
          </button>

          <button
            onClick={() => setSelectedDevice('IOS')}
            className={`flex-1 py-3 px-3 text-center border-b-2 whitespace-nowrap transition-colors flex items-center justify-center gap-1.5 ${
              selectedDevice === 'IOS'
                ? 'border-[#009270] text-[#009270] bg-white font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Apple className="w-4 h-4" />
            <span>🍎 iPhone / iPad</span>
          </button>

          <button
            onClick={() => setSelectedDevice('MACOS')}
            className={`flex-1 py-3 px-3 text-center border-b-2 whitespace-nowrap transition-colors flex items-center justify-center gap-1.5 ${
              selectedDevice === 'MACOS'
                ? 'border-[#009270] text-[#009270] bg-white font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>🍏 Mac (.zip)</span>
          </button>

          <button
            onClick={() => setSelectedDevice('LINUX')}
            className={`flex-1 py-3 px-3 text-center border-b-2 whitespace-nowrap transition-colors flex items-center justify-center gap-1.5 ${
              selectedDevice === 'LINUX'
                ? 'border-[#009270] text-[#009270] bg-white font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>🐧 Linux</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* ANDROID DEVICE CONTENT */}
          {selectedDevice === 'ANDROID' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <div className="flex items-center gap-2 font-black text-sm text-emerald-950">
                  <Smartphone className="w-5 h-5 text-[#009270]" />
                  <span>Android Package & WebAPK Setup</span>
                </div>
                <p className="text-xs text-emerald-900/80 leading-relaxed">
                  You can download the direct <strong>FootBuzz-Football-v2.0.apk</strong> package to install locally, or add it to your home screen with 1 click!
                </p>
              </div>

              {/* Action 1: Direct APK Download */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-extrabold text-sm text-slate-900">
                      Option 1: Direct APK Download (.apk)
                    </div>
                    <div className="text-xs text-slate-500">
                      Standard package installer for all Android phones (Samsung, Xiaomi, OnePlus, Pixel, etc.)
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-[#009270] font-bold">
                    v2.4.0 APK
                  </span>
                </div>

                <button
                  onClick={() => triggerDownload('/api/download/android', 'FootBuzz-Football-v2.0.apk', 'Android')}
                  disabled={Boolean(downloadingPlatform)}
                  className="w-full py-3 rounded-xl bg-[#009270] hover:bg-[#028060] text-white text-xs font-black transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {downloadingPlatform === 'Android'
                      ? 'Downloading FootBuzz APK...'
                      : 'Download FootBuzz Android Package (.apk)'}
                  </span>
                </button>
              </div>

              {/* Action 2: Direct 1-Click Home Screen Install */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-extrabold text-sm text-slate-900">
                      Option 2: Add to Home Screen (Instant WebAPK)
                    </div>
                    <div className="text-xs text-slate-500">
                      Seamless Android integration with zero storage overhead and automatic background updates.
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold">
                    1-Click
                  </span>
                </div>

                <button
                  onClick={handleNativePWAInstall}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PlusSquare className="w-4 h-4 text-emerald-400" />
                  <span>Add Directly to Android Home Screen</span>
                </button>
              </div>

              {/* Instructions */}
              <div className="space-y-2 pt-1 text-xs text-slate-600">
                <div className="font-bold text-slate-800">How to install after downloading APK:</div>
                <div className="space-y-1.5 pl-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-mono font-bold text-[10px]">1</span>
                    <span>Tap on the downloaded <strong>FootBuzz-Football-v2.0.apk</strong> in your browser notifications.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-mono font-bold text-[10px]">2</span>
                    <span>If prompted, tap <strong>Allow from this source</strong> to enable app installation.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-mono font-bold text-[10px]">3</span>
                    <span>Tap <strong>Install</strong>. The FootBuzz Football app icon will appear directly on your home screen!</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* WINDOWS PC CONTENT */}
          {selectedDevice === 'WINDOWS' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
                <div className="flex items-center gap-2 font-black text-sm text-blue-950">
                  <Monitor className="w-5 h-5 text-blue-600" />
                  <span>Windows Desktop Setup (.exe)</span>
                </div>
                <p className="text-xs text-blue-900/80 leading-relaxed">
                  Download the official <strong>FootBuzz-Setup.exe</strong> launcher or install the desktop web app for Windows 10 & 11.
                </p>
              </div>

              {/* Action 1: Direct EXE Download */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-extrabold text-sm text-slate-900">
                      Option 1: Download Windows Executable (.exe)
                    </div>
                    <div className="text-xs text-slate-500">
                      Pre-packaged desktop launcher for Windows PC. Launches FootBuzz in app window mode.
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold">
                    Win 10/11 .exe
                  </span>
                </div>

                <button
                  onClick={() => triggerDownload('/api/download/windows', 'FootBuzz-Setup.exe', 'Windows PC')}
                  disabled={Boolean(downloadingPlatform)}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {downloadingPlatform === 'Windows PC'
                      ? 'Downloading FootBuzz-Setup.exe...'
                      : 'Download for Windows PC (.exe format)'}
                  </span>
                </button>
              </div>

              {/* Action 2: Desktop PWA Install */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-extrabold text-sm text-slate-900">
                      Option 2: Install Desktop App (Chrome / Edge)
                    </div>
                    <div className="text-xs text-slate-500">
                      Docks into your Windows Start Menu, Taskbar, and runs without browser chrome.
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                    Taskbar Pin
                  </span>
                </div>

                <button
                  onClick={handleNativePWAInstall}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PlusSquare className="w-4 h-4 text-emerald-400" />
                  <span>Install Desktop App to Taskbar</span>
                </button>
              </div>

              {/* Step info */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="font-bold text-slate-800">Desktop Shortcut Tip:</div>
                <p className="text-[11px] leading-relaxed">
                  Run <strong>FootBuzz-Setup.exe</strong> after download. It creates a dedicated desktop shortcut that opens FootBuzz directly with hardware acceleration and live match push alerts.
                </p>
              </div>
            </div>
          )}

          {/* APPLE IOS IPHONE / IPAD CONTENT */}
          {selectedDevice === 'IOS' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                <div className="flex items-center gap-2 font-black text-sm text-amber-950">
                  <Apple className="w-5 h-5 text-amber-600" />
                  <span>Apple iOS iPhone & iPad Setup</span>
                </div>
                <p className="text-xs text-amber-900/80 leading-relaxed">
                  Apple requires installing through <strong>Safari</strong> or by downloading the official Apple Web Clip profile.
                </p>
              </div>

              {/* Option 1: Safari 3-Step Guide */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="font-extrabold text-sm text-slate-900">
                  Option 1: Add to Home Screen via Safari (Recommended)
                </div>

                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-[#009270] text-white flex items-center justify-center font-bold text-[11px] shrink-0">1</span>
                    <div>
                      <div className="font-bold text-slate-900">Tap the Share Icon</div>
                      <div className="text-slate-500 text-[11px]">At the bottom of Safari, tap the box with the upward arrow (Share).</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-[#009270] text-white flex items-center justify-center font-bold text-[11px] shrink-0">2</span>
                    <div>
                      <div className="font-bold text-slate-900">Tap "Add to Home Screen"</div>
                      <div className="text-slate-500 text-[11px]">Scroll down in the action sheet and select <strong>Add to Home Screen</strong>.</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-[#009270] text-white flex items-center justify-center font-bold text-[11px] shrink-0">3</span>
                    <div>
                      <div className="font-bold text-slate-900">Tap "Add" in Top Right</div>
                      <div className="text-slate-500 text-[11px]">FootBuzz will be placed on your home screen as a standalone app!</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Option 2: Download MobileConfig Profile */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-extrabold text-sm text-slate-900">
                      Option 2: Apple Web Clip Profile (.mobileconfig)
                    </div>
                    <div className="text-xs text-slate-500">
                      Direct configuration profile for instant home screen placement.
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                    iOS Profile
                  </span>
                </div>

                <button
                  onClick={() => triggerDownload('/api/download/ios', 'FootBuzz.mobileconfig', 'Apple iOS Profile')}
                  disabled={Boolean(downloadingPlatform)}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Download iOS Web Clip (.mobileconfig)</span>
                </button>
              </div>
            </div>
          )}

          {/* MACOS APPLE MAC CONTENT */}
          {selectedDevice === 'MACOS' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 space-y-1">
                <div className="flex items-center gap-2 font-black text-sm text-slate-950">
                  <Laptop className="w-5 h-5 text-slate-800" />
                  <span>macOS Desktop Package (.zip)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Download the standalone <strong>FootBuzz.app</strong> package for Mac with Dock integration and macOS notification support.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-extrabold text-sm text-slate-900">
                      Download FootBuzz for macOS
                    </div>
                    <div className="text-xs text-slate-500">
                      Includes FootBuzz.app for Apple Silicon (M1/M2/M3) and Intel Macs.
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold">
                    macOS App
                  </span>
                </div>

                <button
                  onClick={() => triggerDownload('/api/download/macos', 'FootBuzz-macOS.zip', 'macOS')}
                  disabled={Boolean(downloadingPlatform)}
                  className="w-full py-3 rounded-xl bg-[#009270] hover:bg-[#028060] text-white text-xs font-black transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {downloadingPlatform === 'macOS'
                      ? 'Downloading FootBuzz-macOS.zip...'
                      : 'Download FootBuzz for Mac (.zip)'}
                  </span>
                </button>
              </div>

              {/* Instructions */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="font-bold text-slate-800">Quick Mac Setup:</div>
                <p className="text-[11px] leading-relaxed">
                  Double-click the downloaded <strong>FootBuzz-macOS.zip</strong> to extract <strong>FootBuzz.app</strong>, then drag it into your Applications folder or pin to your Dock!
                </p>
              </div>
            </div>
          )}

          {/* LINUX CONTENT */}
          {selectedDevice === 'LINUX' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 space-y-1">
                <div className="flex items-center gap-2 font-black text-sm text-slate-950">
                  <Terminal className="w-5 h-5 text-emerald-600" />
                  <span>Linux Desktop Package</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Includes the Linux desktop entry, installation script, and launcher for Ubuntu, Fedora, Debian, and Arch.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <button
                  onClick={() => triggerDownload('/api/download/linux', 'FootBuzz-Linux.zip', 'Linux')}
                  disabled={Boolean(downloadingPlatform)}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>
                    {downloadingPlatform === 'Linux'
                      ? 'Downloading Linux Package...'
                      : 'Download Linux Desktop Package (.zip)'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Offline & Performance Feature Highlights */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <WifiOff className="w-4 h-4 text-[#009270] mb-1" />
              <div className="font-bold text-slate-800">Offline Caching</div>
              <div className="text-[11px] text-slate-500">Access saved matches with no signal</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <ShieldCheck className="w-4 h-4 text-[#009270] mb-1" />
              <div className="font-bold text-slate-800">Instant Launch</div>
              <div className="text-[11px] text-slate-500">Zero lag · Fullscreen match immersion</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] font-mono text-slate-400">FootBuzz v2.4.0 Multi-Platform Ready</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
