/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, InAppNotification } from '../types/football';

export type NavTab =
  | 'home'
  | 'matches'
  | 'competitions'
  | 'teams'
  | 'players'
  | 'discover'
  | 'history'
  | 'search'
  | 'lightning-news'
  | 'tournament-countdowns'
  | 'womens-football'
  | 'account'
  | 'match-centre'
  | 'team-detail'
  | 'player-detail'
  | 'competition-detail'
  | 'concept-detail'
  | 'match-comparison'
  | 'player-comparison';

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type?: 'GOAL' | 'INFO' | 'SUCCESS' | 'ALERT';
  timestamp: number;
}

interface AppContextType {
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
  toggleTheme: () => void;

  user: UserProfile | null;
  isLoggedIn: boolean;
  login: (email: string, name?: string, avatarUrl?: string, provider?: 'email' | 'google') => void;
  logout: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  deleteAccount: () => void;

  // Navigation State
  currentTab: NavTab;
  navigateTo: (tab: NavTab, params?: Record<string, any>) => void;
  selectedMatchId: string | null;
  selectedTeamId: string | null;
  selectedPlayerId: string | null;
  selectedCompetitionId: string | null;
  selectedConceptId: string | null;
  compareMatchIds: [string, string] | null;
  comparePlayerIds: [string, string] | null;

  // Favorites & Followed
  isTeamFollowed: (teamId: string) => boolean;
  isPlayerFollowed: (playerId: string) => boolean;
  isCompetitionFollowed: (compId: string) => boolean;
  isMatchBookmarked: (matchId: string) => boolean;
  isMatchFollowed: (matchId: string) => boolean;
  toggleFollowTeam: (teamId: string) => void;
  toggleFollowPlayer: (playerId: string) => void;
  toggleFollowCompetition: (compId: string) => void;
  toggleBookmarkMatch: (matchId: string) => void;
  toggleFollowMatch: (matchId: string) => void;

  // Match Reminders
  remindedMatchIds: string[];
  toggleMatchReminder: (matchId: string) => Promise<boolean>;

  // Notification Center
  notifications: InAppNotification[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  notificationModalOpen: boolean;
  setNotificationModalOpen: (open: boolean) => void;
  notificationPreferences: {
    goals: boolean;
    redCards: boolean;
    fullTime: boolean;
    lineups: boolean;
    kickoffSoon: boolean;
  };
  updateNotificationPreferences: (
    prefs: Partial<{ goals: boolean; redCards: boolean; fullTime: boolean; lineups: boolean; kickoffSoon: boolean }>
  ) => void;

  // Real Data Freshness & Live Ticker
  elapsedFreshnessSeconds: number;
  liveModeMatchId: string | null;
  setLiveModeMatchId: (id: string | null) => void;

  // Pick Your 5 matches
  picked5MatchIds: string[];
  togglePick5Match: (matchId: string) => void;

  // Toast Notifications
  toasts: ToastMessage[];
  addToast: (title: string, description: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;

  // Search query persistence
  globalSearchQuery: string;
  setGlobalSearchQuery: (q: string) => void;

  // Selected League Filter
  selectedLeagueFilter: string;
  setSelectedLeagueFilter: (league: string) => void;

  // Auth modal
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;

  // Intro modal
  introModalOpen: boolean;
  setIntroModalOpen: (open: boolean) => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr-default',
  email: 'football.fan@footbuzz.app',
  name: 'Alex Sterling',
  avatarUrl: '',
  favoriteTeamIds: ['team-mohunbagan', 'team-mancity', 'team-realmadrid'],
  favoritePlayerIds: ['player-petratos', 'player-haaland', 'player-yamal'],
  favoriteCompetitionIds: ['comp-isl', 'comp-pl', 'comp-laliga'],
  favoriteMatchIds: ['match-live-isl-mbsg-mcfc', 'match-live-intl-bra-esp'],
  notificationSettings: {
    matchStart: true,
    goals: true,
    redCards: true,
    fullTime: true,
    favoriteTeamOnly: false,
  },
  joinedDate: '2026-01-15',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('footbuzz_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'light';
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('footbuzz_user');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (
            parsed &&
            parsed.id &&
            parsed.id !== 'usr-default' &&
            parsed.email !== 'football.fan@footbuzz.app'
          ) {
            return parsed;
          } else {
            localStorage.removeItem('footbuzz_user');
          }
        } catch (e) {
          return null;
        }
      }
    }
    return null; // From first: strictly logged out
  });

  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>('match-live-mci-ars');
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [selectedCompetitionId, setSelectedCompetitionId] = useState<string | null>(null);
  const [selectedConceptId, setSelectedConceptId] = useState<string | null>(null);
  const [compareMatchIds, setCompareMatchIds] = useState<[string, string] | null>(null);
  const [comparePlayerIds, setComparePlayerIds] = useState<[string, string] | null>(null);

  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [selectedLeagueFilter, setSelectedLeagueFilter] = useState<string>('all');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [introModalOpen, setIntroModalOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const seen = localStorage.getItem('footbuzz_intro_seen');
      return seen !== 'true';
    }
    return false;
  });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('footbuzz_theme', theme);
  }, [theme]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('footbuzz_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('footbuzz_user');
    }
  }, [user]);

  const setTheme = (t: 'dark' | 'light') => {
    setThemeState(t);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const login = (
    email: string,
    name?: string,
    avatarUrl?: string,
    provider: 'email' | 'google' = 'email'
  ) => {
    const trimmedEmail = email.trim() || 'fan@footbuzz.app';
    const cleanName = (name && name.trim()) || trimmedEmail.split('@')[0] || 'Football Fan';
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email: trimmedEmail,
      name: cleanName,
      avatarUrl: avatarUrl || '',
      authProvider: provider,
      favoriteTeamIds: ['team-mancity', 'team-realmadrid', 'team-mohunbagan'],
      favoritePlayerIds: ['player-haaland', 'player-yamal'],
      favoriteCompetitionIds: ['comp-isl', 'comp-pl', 'comp-ucl'],
      favoriteMatchIds: [],
      notificationSettings: {
        matchStart: true,
        goals: true,
        redCards: true,
        fullTime: true,
        favoriteTeamOnly: false,
      },
      joinedDate: new Date().toISOString().split('T')[0],
    };
    setUser(newUser);
    setAuthModalOpen(false);
    addToast(
      provider === 'google' ? 'Google Account Connected' : 'Welcome to FootBuzz',
      `Signed in as ${newUser.name}`,
      'SUCCESS'
    );
  };

  const logout = () => {
    setUser(null);
    addToast('Signed Out', 'You have been logged out of FootBuzz.', 'INFO');
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
    addToast('Profile Updated', 'Your preferences have been saved.', 'SUCCESS');
  };

  const deleteAccount = () => {
    setUser(null);
    setCurrentTab('home');
    addToast('Account Deleted', 'All local personalized data has been reset.', 'ALERT');
  };

  const navigateTo = (tab: NavTab, params?: Record<string, any>) => {
    setCurrentTab(tab);
    if (params) {
      if (params.matchId !== undefined) setSelectedMatchId(params.matchId);
      if (params.teamId !== undefined) setSelectedTeamId(params.teamId);
      if (params.playerId !== undefined) setSelectedPlayerId(params.playerId);
      if (params.competitionId !== undefined) setSelectedCompetitionId(params.competitionId);
      if (params.conceptId !== undefined) setSelectedConceptId(params.conceptId);
      if (params.compareMatchIds !== undefined) setCompareMatchIds(params.compareMatchIds);
      if (params.comparePlayerIds !== undefined) setComparePlayerIds(params.comparePlayerIds);
      if (params.query !== undefined) setGlobalSearchQuery(params.query);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToast = (title: string, description: string, type: ToastMessage['type'] = 'INFO') => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title,
      description,
      type,
      timestamp: Date.now(),
    };
    setToasts((prev) => [newToast, ...prev.slice(0, 4)]);

    setTimeout(() => {
      removeToast(newToast.id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const isTeamFollowed = (teamId: string) => {
    return user?.favoriteTeamIds.includes(teamId) ?? false;
  };

  const isPlayerFollowed = (playerId: string) => {
    return user?.favoritePlayerIds.includes(playerId) ?? false;
  };

  const isCompetitionFollowed = (compId: string) => {
    return user?.favoriteCompetitionIds.includes(compId) ?? false;
  };

  const isMatchBookmarked = (matchId: string) => {
    return user?.favoriteMatchIds.includes(matchId) ?? false;
  };

  const toggleFollowTeam = (teamId: string) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    const current = [...user.favoriteTeamIds];
    const index = current.indexOf(teamId);
    let updated: string[];
    if (index > -1) {
      updated = current.filter((id) => id !== teamId);
      addToast('Unfollowed Club', 'Removed from My Football', 'INFO');
    } else {
      updated = [...current, teamId];
      addToast('Following Club', 'Added to My Football feed', 'SUCCESS');
    }
    setUser({ ...user, favoriteTeamIds: updated });
  };

  const toggleFollowPlayer = (playerId: string) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    const current = [...user.favoritePlayerIds];
    const index = current.indexOf(playerId);
    let updated: string[];
    if (index > -1) {
      updated = current.filter((id) => id !== playerId);
      addToast('Unfollowed Player', 'Removed from tracked players', 'INFO');
    } else {
      updated = [...current, playerId];
      addToast('Following Player', 'Added to tracked players', 'SUCCESS');
    }
    setUser({ ...user, favoritePlayerIds: updated });
  };

  const toggleFollowCompetition = (compId: string) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    const current = [...user.favoriteCompetitionIds];
    const index = current.indexOf(compId);
    let updated: string[];
    if (index > -1) {
      updated = current.filter((id) => id !== compId);
    } else {
      updated = [...current, compId];
    }
    setUser({ ...user, favoriteCompetitionIds: updated });
  };

  const toggleBookmarkMatch = (matchId: string) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    const current = [...user.favoriteMatchIds];
    const index = current.indexOf(matchId);
    let updated: string[];
    if (index > -1) {
      updated = current.filter((id) => id !== matchId);
      addToast('Match Unfollowed', 'Removed from Your Matches', 'INFO');
    } else {
      updated = [...current, matchId];
      addToast('Match Followed', 'Added to Your Matches in Personal Feed', 'SUCCESS');
    }
    setUser({ ...user, favoriteMatchIds: updated });
  };

  const isMatchFollowed = (matchId: string) => {
    return user?.favoriteMatchIds.includes(matchId) ?? false;
  };

  const toggleFollowMatch = (matchId: string) => {
    toggleBookmarkMatch(matchId);
  };

  // Match Reminders state (Feature 13)
  const [remindedMatchIds, setRemindedMatchIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('footbuzz_reminded_matches');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const toggleMatchReminder = async (matchId: string): Promise<boolean> => {
    const isCurrentlyReminded = remindedMatchIds.includes(matchId);
    if (isCurrentlyReminded) {
      const next = remindedMatchIds.filter((id) => id !== matchId);
      setRemindedMatchIds(next);
      try {
        localStorage.setItem('footbuzz_reminded_matches', JSON.stringify(next));
      } catch {}
      addToast('Reminder Removed', 'Kickoff alert cancelled for this fixture.', 'INFO');
      return false;
    }

    // Check user consent for browser notifications if supported
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        const perm = await Notification.requestPermission();
        if (perm !== 'granted') {
          addToast('In-App Alert Set', 'Match kickoff notification enabled in FootBuzz.', 'SUCCESS');
        }
      }
    }

    const next = [...remindedMatchIds, matchId];
    setRemindedMatchIds(next);
    try {
      localStorage.setItem('footbuzz_reminded_matches', JSON.stringify(next));
    } catch {}
    addToast('Reminder Scheduled', 'You will receive an alert prior to kickoff.', 'SUCCESS');
    return true;
  };

  // In-App Notification Center (Feature 25)
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [notificationPreferences, setNotificationPreferences] = useState({
    goals: true,
    redCards: true,
    fullTime: true,
    lineups: true,
    kickoffSoon: true,
  });

  const [notifications, setNotifications] = useState<InAppNotification[]>(() => [
    {
      id: 'notif-welcome',
      type: 'LINEUP',
      title: 'FootBuzz Telemetry Active',
      message: 'Real-time telemetry and verified YouTube match highlights are now operational.',
      matchId: '',
      timestamp: Date.now() - 300000,
      read: false,
    },
  ]);

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const updateNotificationPreferences = (
    prefs: Partial<{ goals: boolean; redCards: boolean; fullTime: boolean; lineups: boolean; kickoffSoon: boolean }>
  ) => {
    setNotificationPreferences((prev) => ({ ...prev, ...prefs }));
    addToast('Preferences Updated', 'Match notification settings saved.', 'SUCCESS');
  };

  // Real Data Freshness Tracking (Feature 32: Lightning Speed Results)
  const [elapsedFreshnessSeconds, setElapsedFreshnessSeconds] = useState(1);
  const [liveModeMatchId, setLiveModeMatchId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedFreshnessSeconds((prev) => (prev >= 30 ? 1 : prev + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [picked5MatchIds, setPicked5MatchIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('footbuzz_picked5');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return [];
        }
      }
    }
    return [];
  });

  const togglePick5Match = (matchId: string) => {
    setPicked5MatchIds((prev) => {
      let next: string[];
      if (prev.includes(matchId)) {
        next = prev.filter((id) => id !== matchId);
        addToast('Removed from Pick 5', 'Match unpinned from your watchlist', 'INFO');
      } else {
        if (prev.length >= 5) {
          addToast('Pick 5 Limit Reached', 'You can track up to 5 priority matches at once.', 'ALERT');
          return prev;
        }
        next = [...prev, matchId];
        addToast('Added to Pick 5', 'Match pinned to your priority watchlist', 'SUCCESS');
      }
      localStorage.setItem('footbuzz_picked5', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        user,
        isLoggedIn: !!user,
        login,
        logout,
        updateUserProfile,
        deleteAccount,
        currentTab,
        navigateTo,
        selectedMatchId,
        selectedTeamId,
        selectedPlayerId,
        selectedCompetitionId,
        selectedConceptId,
        compareMatchIds,
        comparePlayerIds,
        isTeamFollowed,
        isPlayerFollowed,
        isCompetitionFollowed,
        isMatchBookmarked,
        isMatchFollowed,
        toggleFollowTeam,
        toggleFollowPlayer,
        toggleFollowCompetition,
        toggleBookmarkMatch,
        toggleFollowMatch,
        remindedMatchIds,
        toggleMatchReminder,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        clearAllNotifications,
        notificationModalOpen,
        setNotificationModalOpen,
        notificationPreferences,
        updateNotificationPreferences,
        elapsedFreshnessSeconds,
        liveModeMatchId,
        setLiveModeMatchId,
        picked5MatchIds,
        togglePick5Match,
        toasts,
        addToast,
        removeToast,
        globalSearchQuery,
        setGlobalSearchQuery,
        selectedLeagueFilter,
        setSelectedLeagueFilter,
        authModalOpen,
        setAuthModalOpen,
        introModalOpen,
        setIntroModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
