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
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { footballApi } from '../../services/footballApi';
import { ClubCrest } from '../common/ClubCrest';

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
  const [notifSettings, setNotifSettings] = useState(
    user?.notificationSettings || {
      matchStart: true,
      goals: true,
      redCards: true,
      fullTime: true,
      favoriteTeamOnly: false,
    }
  );

  if (!user) {
    return (
      <div className="p-12 text-center rounded-3xl bg-white border border-slate-200/90 shadow-xs max-w-lg mx-auto space-y-4">
        <User className="w-12 h-12 text-[#009270] mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 font-display">Sign In to Personalize FootBuzz</h2>
        <p className="text-xs text-slate-500">
          Save favorite clubs, track player statistics, and customize real-time match alerts.
        </p>
        <button
          onClick={() => setAuthModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-[#009270] hover:bg-[#028060] text-white font-bold text-xs transition-colors shadow-xs"
        >
          Open Sign In
        </button>
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
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-display">
            <User className="w-4 h-4 text-[#009270]" /> User Profile Information
          </h2>

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
    </div>
  );
};
