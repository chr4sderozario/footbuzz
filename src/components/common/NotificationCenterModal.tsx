/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz In-App Notification Center & Preferences Modal
 * Real-time event notifications for goals, red cards, lineups, and match kickoffs.
 */

import React, { useState } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  X,
  Sliders,
  Radio,
  Flame,
  Clock,
  Shield,
  Volume2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationCenterModal: React.FC = () => {
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    clearAllNotifications,
    notificationModalOpen,
    setNotificationModalOpen,
    notificationPreferences,
    updateNotificationPreferences,
    navigateTo,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'ALERTS' | 'PREFERENCES'>('ALERTS');

  if (!notificationModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-[#0a231b] to-[#009270] text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={() => setNotificationModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-mono font-bold tracking-wide">
            <Bell className="w-3.5 h-3.5 text-amber-300" />
            <span>MATCHDAY TELEMETRY NOTIFICATIONS</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-display mt-2 text-white flex items-center gap-2">
            <span>Notification Center</span>
            {unreadNotificationsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-xs font-black font-mono">
                {unreadNotificationsCount} NEW
              </span>
            )}
          </h2>

          <p className="text-xs text-emerald-100/90 mt-1 leading-relaxed">
            Real-time alerts for goals, red cards, starting lineups, and followed match kickoffs.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab('ALERTS')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              activeTab === 'ALERTS'
                ? 'border-[#009270] text-[#009270] bg-white font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            🔔 Live Alerts ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab('PREFERENCES')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              activeTab === 'PREFERENCES'
                ? 'border-[#009270] text-[#009270] bg-white font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            ⚙️ Notification Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3">
          {activeTab === 'ALERTS' ? (
            <>
              {notifications.length > 0 ? (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
                    <span>Recent match updates</span>
                    <button
                      onClick={clearAllNotifications}
                      className="text-rose-600 hover:underline flex items-center gap-1 font-bold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear All</span>
                    </button>
                  </div>

                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationAsRead(notif.id);
                        if (notif.matchId) {
                          setNotificationModalOpen(false);
                          navigateTo('match-centre', { matchId: notif.matchId });
                        }
                      }}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                        notif.read
                          ? 'bg-slate-50 border-slate-200 text-slate-700'
                          : 'bg-emerald-50/50 border-emerald-300 text-slate-900 shadow-2xs'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm ${
                          notif.type === 'GOAL'
                            ? 'bg-emerald-500 text-white'
                            : notif.type === 'RED_CARD'
                            ? 'bg-rose-600 text-white'
                            : 'bg-[#009270] text-white'
                        }`}
                      >
                        {notif.type === 'GOAL' ? '⚽' : notif.type === 'RED_CARD' ? '🟥' : '📋'}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-extrabold text-xs sm:text-sm truncate">
                            {notif.title}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400 shrink-0">
                            {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                          {notif.message}
                        </p>
                      </div>

                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                    <Bell className="w-6 h-6 opacity-40" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-700">No New Notifications</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Live match events and kickoff alarms will appear here as fixtures unfold.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Event Subscriptions
              </div>

              {[
                { key: 'goals', label: '⚽ Goal Alerts', desc: 'Notify immediately when a goal or penalty is scored.' },
                { key: 'redCards', label: '🟥 Red Card Alerts', desc: 'Notify on straight red cards and second yellow ejections.' },
                { key: 'lineups', label: '📋 Starting Lineups', desc: 'Notify 60 minutes before kickoff when official starting XIs drop.' },
                { key: 'kickoffSoon', label: '⏰ Kickoff Reminders', desc: 'Alert 15 minutes before followed matches kick off.' },
                { key: 'fullTime', label: '🏁 Full-Time Scores', desc: 'Final score summary when the referee blows the full-time whistle.' },
              ].map((item) => {
                const isEnabled = (notificationPreferences as any)[item.key];
                return (
                  <div
                    key={item.key}
                    onClick={() => updateNotificationPreferences({ [item.key]: !isEnabled })}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-400 transition-all flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <div>
                      <div className="font-extrabold text-xs sm:text-sm text-slate-900">{item.label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                    </div>

                    <div
                      className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 shrink-0 ${
                        isEnabled ? 'bg-[#009270]' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                          isEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Synced with your local match session</span>
          <button
            onClick={() => setNotificationModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
