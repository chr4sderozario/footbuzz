/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, CheckCircle, Info, AlertTriangle, Flame } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useOnlineStatus } from '../../hooks/usePWAInstall';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();
  const isOnline = useOnlineStatus();

  return (
    <>
      {/* Offline Status Warning Bar */}
      {!isOnline && (
        <div className="fixed top-16 left-0 right-0 z-50 bg-amber-500 text-slate-950 px-4 py-2 text-center text-xs font-bold shadow-lg flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-slate-950 animate-pulse" />
          <span>Offline Mode — Displaying cached football data.</span>
        </div>
      )}

      {/* Floating Toast Message Queue */}
      <div className="fixed bottom-16 md:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl bg-slate-900/95 border border-slate-700 shadow-2xl text-slate-100 backdrop-blur-md animate-in slide-in-from-bottom-2 fade-in"
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'GOAL' ? (
                <span className="text-base">⚽</span>
              ) : toast.type === 'SUCCESS' ? (
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              ) : toast.type === 'ALERT' ? (
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              ) : (
                <Info className="w-4 h-4 text-sky-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-white">{toast.title}</h4>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                {toast.description}
              </p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-0.5 shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </>
  );
};
