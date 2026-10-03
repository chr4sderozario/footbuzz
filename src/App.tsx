/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Main Application Root
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { ToastContainer } from './components/common/ToastContainer';
import { AuthModal } from './components/account/AuthModal';
import { IntroModal } from './components/common/IntroModal';
import { IntroLoadingScreen } from './components/common/IntroLoadingScreen';

import { HomePage } from './components/home/HomePage';
import { MatchesPage } from './components/matches/MatchesPage';
import { MatchCentre } from './components/matches/MatchCentre';
import { CompetitionsPage } from './components/competitions/CompetitionsPage';
import { CompetitionDetailPage } from './components/competitions/CompetitionDetailPage';
import { TeamsPage } from './components/teams/TeamsPage';
import { TeamDetailPage } from './components/teams/TeamDetailPage';
import { PlayersPage } from './components/players/PlayersPage';
import { PlayerDetailPage } from './components/players/PlayerDetailPage';
import { HistoryPage } from './components/history/HistoryPage';
import { ConceptDetailPage } from './components/history/ConceptDetailPage';
import { SearchPage } from './components/search/SearchPage';
import { AccountPage } from './components/account/AccountPage';
import { DiscoverPage } from './components/discover/DiscoverPage';
import { LiveScoreTicker } from './components/common/LiveScoreTicker';
import { FootBuzzLiveModeModal } from './components/matches/FootBuzzLiveModeModal';

import { footballApi } from './services/footballApi';

const MainContent: React.FC = () => {
  const {
    currentTab,
    selectedMatchId,
    selectedTeamId,
    selectedPlayerId,
    selectedCompetitionId,
    selectedConceptId,
  } = useApp();

  // Render view based on active navigation tab
  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {currentTab === 'home' && <HomePage />}
      {currentTab === 'matches' && <MatchesPage />}
      {currentTab === 'discover' && <DiscoverPage />}
      {currentTab === 'match-centre' && (
        <MatchCentre
          match={
            footballApi.getMatchById(selectedMatchId || 'match-live-mci-ars') ||
            footballApi.getAllMatches()[0]
          }
        />
      )}
      {currentTab === 'competitions' && <CompetitionsPage />}
      {currentTab === 'competition-detail' && (
        <CompetitionDetailPage competitionId={selectedCompetitionId || 'comp-pl'} />
      )}
      {currentTab === 'teams' && <TeamsPage />}
      {currentTab === 'team-detail' && (
        <TeamDetailPage teamId={selectedTeamId || 'team-mancity'} />
      )}
      {currentTab === 'players' && <PlayersPage />}
      {currentTab === 'player-detail' && (
        <PlayerDetailPage playerId={selectedPlayerId || 'player-haaland'} />
      )}
      {currentTab === 'history' && <HistoryPage />}
      {currentTab === 'concept-detail' && (
        <ConceptDetailPage conceptId={selectedConceptId || 'concept-433'} />
      )}
      {currentTab === 'search' && <SearchPage />}
      {currentTab === 'account' && <AccountPage />}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-[#f1f3f6] text-slate-900 selection:bg-emerald-500/30 selection:text-emerald-900 transition-colors">
        <IntroLoadingScreen />
        <Header />
        <LiveScoreTicker />
        <MainContent />
        <Footer />
        <MobileBottomNav />
        <ToastContainer />
        <AuthModal />
        <IntroModal />
        <FootBuzzLiveModeModal />
      </div>
    </AppProvider>
  );
}
