/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz PWA App Download & Installation Trigger Button
 */

import React, { useState } from 'react';
import { Download, Smartphone, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

interface PWAInstallButtonProps {
  variant?: 'header' | 'banner' | 'pill';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'header',
  className = '',
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [modalOpen, setModalOpen] = useState(false);

  const handleClick = () => {
    setModalOpen(true);
  };

  if (variant === 'banner') {
    return (
      <>
        <div
          onClick={handleClick}
          className={`p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-[#04281f] border border-emerald-500/30 text-white flex items-center justify-between gap-4 cursor-pointer hover:border-emerald-400/60 transition-all shadow-md group ${className}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30 group-hover:scale-105 transition-transform">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-white flex items-center gap-1.5">
                <span>Download FootBuzz App</span>
                <span className="px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 text-[9px] font-black uppercase">
                  PWA
                </span>
              </div>
              <div className="text-xs text-slate-300">
                Install as a full app on Android, iPhone, or Desktop for offline scores
              </div>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            className="px-4 py-2 rounded-xl bg-[#009270] hover:bg-[#028060] text-white text-xs font-black shrink-0 transition-colors shadow-xs"
          >
            Download App
          </button>
        </div>

        <PWAInstallModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={`flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 text-xs font-black text-white hover:text-white transition-all shrink-0 active:scale-95 shadow-2xs ${className}`}
        title="Download & Install FootBuzz App"
      >
        <Download className="w-3.5 h-3.5 text-emerald-300" />
        <span className="hidden sm:inline">Download App</span>
        <span className="sm:hidden">App</span>
      </button>

      <PWAInstallModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};
