/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  User,
  Heart,
  Bell,
  Trash2,
  LogOut,
  Shield,
  Save,
  Check,
  Smartphone,
  Crown,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { footballApi } from '../../services/footballApi';
import { ClubCrest } from '../common/ClubCrest';
import { SubscriptionPlansModal } from '../common/SubscriptionPlansModal';

export const AccountPage: React.FC = () => {
  const {
    user,
    logout,
    updateUserProfile,
    deleteAccount,
    navigateTo,
    toggleFollowTeam,
    toggleFollowPlayer,
    setAuthModalOpen,
  } = useApp();

  const [name, setName] = useState(user?.name || '');
  const [subModalOpen, setSubModalOpen] = useState(false);
  const [notifSettings, setNotifSettings] = useState(
    user?.notificationSettings || {
      matchStart: true,
      goals: true,
      redCards: true,
      fullTime: true,
      favoriteTeamOnly: false,
    }
  );

  React.useEffect(() => {
    if (user) {
      setName(user.name);
      if (user.notificationSettings) {
        setNotifSettings(user.notificationSettings);
      }
    }
  }, [user]);

  if (!user) {
    return (
      <div className="p-8 sm:p-12 text-center rounded-3xl bg-white border border-slate-200/90 shadow-xs max-w-lg mx-auto space-y-5 animate-in fade-in">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#009270] flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display">Sign In or Create Account</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            You are currently browsing as a guest. Sign in or create an account with any email, password, or Google account you want to follow clubs, track players, and customize live match notifications.
          </p>
        </div>

        <div className="flex flex-col gap-2.5 max-w-xs mx-auto pt-2">
          <button
            onClick={() => setAuthModalOpen(true)}
            className="w-full py-2.5 px-4 rounded-xl bg-[#009270] hover:bg-[#028060] text-white font-bold text-xs transition-colors shadow-xs"
          >
            Sign In / Create Account
          </button>

          <button
            onClick={() => setAuthModalOpen(true)}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google Account</span>
          </button>
        </div>

        {/* Subscriptions Teaser Card for Guest */}
        <div className="pt-3 border-t border-slate-100 max-w-xs mx-auto">
          <button
            onClick={() => setSubModalOpen(true)}
            className="w-full p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 hover:border-amber-300 text-left transition-all group flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold shadow-xs">
                <Crown className="w-4 h-4 fill-current" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-slate-900">FootBuzz Subscriptions</span>
                  <span className="text-[9px] font-mono font-black uppercase px-1.5 py-0.2 rounded-full bg-slate-900 text-amber-300">
                    Soon
                  </span>
                </div>
                <p className="text-[10px] text-slate-600 font-medium">
                  Plus · Pro · Max perks & priority waitlist
                </p>
              </div>
            </div>
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Subscription Plans Modal */}
        <SubscriptionPlansModal isOpen={subModalOpen} onClose={() => setSubModalOpen(false)} />
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      notificationSettings: notifSettings,
    });
  };

  const followedTeams = user.favoriteTeamIds
    .map((id) => footballApi.getTeamById(id))
    .filter(Boolean);

  const followedPlayers = user.favoritePlayerIds
    .map((id) => footballApi.getPlayerById(id))
    .filter(Boolean);

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-200 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-display">
            Account & Personalization
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your followed football clubs, player watchlists, and live match alerts.
          </p>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-rose-50 hover:border-rose-300 text-xs font-semibold text-rose-600 transition-colors self-start"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-display">
              <User className="w-4 h-4 text-[#009270]" /> User Profile Information
            </h2>
            {user.authProvider === 'google' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold">
                <svg className="w-3 h-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google Account</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#009270] text-[10px] font-bold">
                <Check className="w-3 h-3" />
                <span>FootBuzz Verified</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-[#009270]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-display">
            <Bell className="w-4 h-4 text-amber-500" /> Match Day Alert Preferences
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              { key: 'matchStart', label: 'Match Kickoff Starting' },
              { key: 'goals', label: 'Live Goals & Penalties' },
              { key: 'redCards', label: 'Red Card Warnings' },
              { key: 'fullTime', label: 'Full Time Final Score' },
            ].map((setting) => (
              <label
                key={setting.key}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer hover:border-emerald-500 transition-colors"
              >
                <span className="text-slate-800 font-medium">{setting.label}</span>
                <input
                  type="checkbox"
                  checked={(notifSettings as any)[setting.key]}
                  onChange={(e) =>
                    setNotifSettings({
                      ...notifSettings,
                      [setting.key]: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded text-[#009270] bg-white border-slate-300 focus:ring-0 cursor-pointer accent-[#009270]"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#009270] hover:bg-[#028060] text-white font-bold text-xs transition-colors shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>

      {/* Followed Clubs & Players Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Followed Clubs */}
        <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-display">
            <Heart className="w-4 h-4 text-rose-500" /> Followed Clubs ({followedTeams.length})
          </h2>

          {followedTeams.length === 0 ? (
            <p className="text-xs text-slate-500 py-3">No clubs followed yet.</p>
          ) : (
            <div className="space-y-2">
              {followedTeams.map((t) => (
                <div
                  key={`ft-${t!.id}`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <div
                    onClick={() => navigateTo('team-detail', { teamId: t!.id })}
                    className="flex items-center gap-2.5 cursor-pointer hover:text-[#009270]"
                  >
                    <ClubCrest name={t!.name} code={t!.code} primaryColor={t!.primaryColor} size="xs" />
                    <span className="font-bold text-slate-900">{t!.name}</span>
                  </div>
                  <button
                    onClick={() => toggleFollowTeam(t!.id)}
                    className="text-[11px] text-rose-600 hover:underline font-semibold"
                  >
                    Unfollow
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Followed Players */}
        <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-display">
            <User className="w-4 h-4 text-sky-600" /> Tracked Players ({followedPlayers.length})
          </h2>

          {followedPlayers.length === 0 ? (
            <p className="text-xs text-slate-500 py-3">No players tracked yet.</p>
          ) : (
            <div className="space-y-2">
              {followedPlayers.map((p) => (
                <div
                  key={`fp-${p!.id}`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <div
                    onClick={() => navigateTo('player-detail', { playerId: p!.id })}
                    className="cursor-pointer hover:text-[#009270]"
                  >
                    <span className="font-bold text-slate-900">{p!.name}</span>
                    <span className="text-slate-500 ml-1.5 font-mono text-[10px]">({p!.currentTeamName})</span>
                  </div>
                  <button
                    onClick={() => toggleFollowPlayer(p!.id)}
                    className="text-[11px] text-rose-600 hover:underline font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Subscriptions Teaser Card for Logged In User */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-emerald-500/10 border border-amber-300/60 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold">
              <Crown className="w-4 h-4 fill-current" />
            </div>
            <h3 className="text-sm font-black text-slate-900 font-display">
              FootBuzz Subscriptions · Plus · Pro · Max
            </h3>
            <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full bg-slate-900 text-amber-300">
              Coming Soon
            </span>
          </div>
          <p className="text-xs text-slate-600 max-w-xl">
            Upgrade your football universe with ad-free live updates, deep xG radar, 30-year Head-to-Head archives, and unlimited FootAI intelligence.
          </p>
        </div>

        <button
          onClick={() => setSubModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs transition-all shadow-xs shrink-0 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>View Plans Teaser</span>
        </button>
      </div>

      {/* Danger Zone: Account Deletion */}
      <div className="rounded-2xl bg-rose-50 border border-rose-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-rose-900 flex items-center gap-2 font-display">
            <Trash2 className="w-4 h-4 text-rose-600" /> Reset Account & Local Data
          </h3>
          <p className="text-xs text-rose-700/80 mt-0.5">
            Permanently erase your local profile, preferences, and saved favorites.
          </p>
        </div>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to delete your FootBuzz profile?')) {
              deleteAccount();
            }
          }}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shrink-0 shadow-xs"
        >
          Delete Account
        </button>
      </div>

      {/* Subscription Plans Modal */}
      <SubscriptionPlansModal isOpen={subModalOpen} onClose={() => setSubModalOpen(false)} />
    </div>
  );
};
