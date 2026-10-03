/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Interactive Football Command Center Hub
 * Launcher for all 20 advanced platform tools & features.
 */

import React, { useState } from 'react';
import {
  Sparkles,
  HelpCircle,
  Swords,
  Target,
  Trophy,
  Layers,
  Eye,
  ArrowRightLeft,
  HeartPulse,
  LayoutGrid,
  MapPin,
  Volume2,
  CloudRain,
  Sliders,
  Globe,
  Download,
  X,
  Radio,
  Flame,
  Music,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { footballApi } from '../../services/footballApi';
import { MatchSoundboardModal } from './MatchSoundboardModal';
import { PenaltyShootoutModal } from './PenaltyShootoutModal';
import { TrophyRoomModal } from './TrophyRoomModal';
import { TacticalBoardModal } from './TacticalBoardModal';
import { RefereeRadarModal } from './RefereeRadarModal';
import { TransferHubModal } from './TransferHubModal';
import { H2HMatrixModal } from './H2HMatrixModal';
import { InjuryTrackerModal } from './InjuryTrackerModal';
import { MatchPredictorModal } from './MatchPredictorModal';
import { MultiMatchDashboard } from './MultiMatchDashboard';
import { StadiumGuideModal } from './StadiumGuideModal';
import { XGShotMapModal } from './XGShotMapModal';
import { WeatherRadarModal } from './WeatherRadarModal';
import { GlobalTimezoneModal } from './GlobalTimezoneModal';
import { ThemeControllerModal } from './ThemeControllerModal';
import { PWAInstallModal } from '../common/PWAInstallModal';
import { GoldenBootRaceModal } from './GoldenBootRaceModal';
import { ChantsJukeboxModal } from './ChantsJukeboxModal';
import { FanPulseModal } from './FanPulseModal';
import { FootballQuizModal } from './FootballQuizModal';

interface FootballToolHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FootballToolHubModal: React.FC<FootballToolHubModalProps> = ({ isOpen, onClose }) => {
  const { navigateTo } = useApp();
  const matches = footballApi.getAllMatches();

  const [activeModal, setActiveModal] = useState<string | null>(null);

  if (!isOpen && !activeModal) return null;

  const toolCards = [
    {
      id: 'trivia',
      title: 'Matchday Trivia & Rules Challenge',
      category: 'FOOTBALL IQ',
      desc: 'Interactive quiz testing knowledge on ISL, World Cup records, Champions League trivia, and IFAB rules.',
      icon: HelpCircle,
      color: 'bg-emerald-600 text-white',
      badge: 'Trivia Quiz',
      action: () => setActiveModal('trivia'),
    },
    {
      id: 'download-app',
      title: 'Download & Install Full App',
      category: 'PROGRESSIVE WEB APP',
      desc: 'Install FootBuzz directly on iOS Safari, Android, or PC for offline scores and native speed.',
      icon: Download,
      color: 'bg-indigo-600 text-white',
      badge: 'Standalone',
      action: () => setActiveModal('pwa'),
    },
    {
      id: 'soundboard',
      title: 'Live Stadium Soundboard',
      category: 'AUDIO ENGINE',
      desc: 'Real-time synthesized referee whistle, goal foghorn, crowd acoustics, and VAR audio.',
      icon: Volume2,
      color: 'bg-amber-500 text-white',
      badge: 'Web Audio',
      action: () => setActiveModal('soundboard'),
    },
    {
      id: 'penalty',
      title: 'Penalty Shootout Simulator',
      category: 'INTERACTIVE MINI-GAME',
      desc: 'Sudden-death penalty shootout game. Target high corners and outwit the goalkeeper.',
      icon: Target,
      color: 'bg-rose-600 text-white',
      badge: 'Mini-Game',
      action: () => setActiveModal('penalty'),
    },
    {
      id: 'h2h',
      title: 'Club Head-to-Head Matrix',
      category: 'HISTORIC METRICS',
      desc: 'Compare any two clubs in world football across trophies, head-to-head records, and managers.',
      icon: Swords,
      color: 'bg-blue-600 text-white',
      badge: 'Comparison',
      action: () => setActiveModal('h2h'),
    },
    {
      id: 'tactics',
      title: 'Tactical Pitch Whiteboard',
      category: 'TACTICAL ENGINE',
      desc: 'Interactive 11-player formation builder with Gegenpress and Tiki-Taka tactical setups.',
      icon: Layers,
      color: 'bg-emerald-600 text-white',
      badge: 'Tactics',
      action: () => setActiveModal('tactics'),
    },
    {
      id: 'trophy',
      title: 'Ballon d\'Or & Golden Roll',
      category: 'HALL OF FAME',
      desc: 'Complete chronological archive of all Ballon d\'Or champions from 1956 to present.',
      icon: Trophy,
      color: 'bg-amber-600 text-white',
      badge: 'History',
      action: () => setActiveModal('trophy'),
    },
    {
      id: 'referee',
      title: 'Referee & VAR Strictness Radar',
      category: 'REGULATORY',
      desc: 'Track referee cards per match, penalty tendencies, and VAR review overturn rates.',
      icon: Eye,
      color: 'bg-purple-600 text-white',
      badge: 'VAR Stats',
      action: () => setActiveModal('referee'),
    },
    {
      id: 'transfers',
      title: 'Transfer Market Hub',
      category: 'MARKET RADAR',
      desc: 'Confirmed blockbuster signings, domestic record deals, and contract expiry alarms.',
      icon: ArrowRightLeft,
      color: 'bg-cyan-600 text-white',
      badge: 'Transfers',
      action: () => setActiveModal('transfers'),
    },
    {
      id: 'injury',
      title: 'Injury & Suspension Ward',
      category: 'MEDICAL SQUAD',
      desc: 'Hamstring & ACL recovery timelines, training returns, and yellow card ban risks.',
      icon: HeartPulse,
      color: 'bg-red-600 text-white',
      badge: 'Medical',
      action: () => setActiveModal('injury'),
    },
    {
      id: 'predictor',
      title: 'Fan Prediction League',
      category: 'COMMUNITY',
      desc: 'Predict upcoming fixture outcomes, earn leaderboard points, and maintain your streak.',
      icon: Flame,
      color: 'bg-orange-500 text-white',
      badge: 'Fan League',
      action: () => setActiveModal('predictor'),
    },
    {
      id: 'multi-match',
      title: 'Multi-View Split Dashboard',
      category: 'LIVE COMMAND',
      desc: 'Simultaneous 4-match split-screen view with real-time synchronized live clocks.',
      icon: LayoutGrid,
      color: 'bg-slate-800 text-white',
      badge: 'Split Screen',
      action: () => setActiveModal('multimatch'),
    },
    {
      id: 'stadiums',
      title: 'Stadium Guide & Seat Gates',
      category: 'GROUND GUIDE',
      desc: 'Capacities, metro transit directions, pitch dimensions, and turnstile gate entry advice.',
      icon: MapPin,
      color: 'bg-teal-600 text-white',
      badge: 'Grounds',
      action: () => setActiveModal('stadiums'),
    },
    {
      id: 'xg',
      title: 'Expected Goals (xG) Shot Radar',
      category: 'OPTICAL ANALYTICS',
      desc: 'Visual shot map with xG probability rings and shot conversion efficiency.',
      icon: Target,
      color: 'bg-lime-600 text-white',
      badge: 'xG Radar',
      action: () => setActiveModal('xg'),
    },
    {
      id: 'weather',
      title: 'Weather & Pitch Conditions',
      category: 'METEOROLOGY',
      desc: 'Live stadium climate, humidity, wind velocity, and pitch bounce tactical impact.',
      icon: CloudRain,
      color: 'bg-sky-600 text-white',
      badge: 'Weather',
      action: () => setActiveModal('weather'),
    },
    {
      id: 'timezone',
      title: 'Timezone Converter & .ICS Export',
      category: 'CALENDAR SYNC',
      desc: 'Convert kickoff times between IST, GMT, and CET; download fixtures to Google/Apple Calendar.',
      icon: Globe,
      color: 'bg-blue-500 text-white',
      badge: 'iCal Sync',
      action: () => setActiveModal('timezone'),
    },
    {
      id: 'themes',
      title: 'Floodlight & Night Match Theme',
      category: 'DISPLAY PREFERENCES',
      desc: 'Toggle between Daylight Cricbuzz mode and Floodlit Stadium deep obsidian dark theme.',
      icon: Sliders,
      color: 'bg-slate-900 text-white',
      badge: 'Atmosphere',
      action: () => setActiveModal('themes'),
    },
    {
      id: 'golden-shoe',
      title: 'Golden Shoe & League Top Scorers Race',
      category: 'GLOBAL AWARDS',
      desc: 'Coefficient-weighted scoring race tracking Haaland, Kane, Mbappé, and ISL stars.',
      icon: Trophy,
      color: 'bg-amber-600 text-white',
      badge: 'Golden Shoe',
      action: () => setActiveModal('golden-shoe'),
    },
    {
      id: 'chants',
      title: 'Stadium Anthems & Fan Chants Jukebox',
      category: 'FAN CULTURE',
      desc: 'Sing along to YNWA, Hala Madrid, Joy Mohun Bagan, and historic terrace chants with lyrics.',
      icon: Music,
      color: 'bg-emerald-700 text-white',
      badge: 'Anthems',
      action: () => setActiveModal('chants'),
    },
    {
      id: 'fan-pulse',
      title: 'Global Fan Sentiment & Match Pulse Radar',
      category: 'COMMUNITY PULSE',
      desc: 'Cast 1X2 win prediction votes on live & upcoming fixtures to see global supporter consensus.',
      icon: Flame,
      color: 'bg-orange-600 text-white',
      badge: 'Pulse',
      action: () => setActiveModal('fan-pulse'),
    },
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-[#0a231b] to-[#009270] text-white p-6 relative shrink-0 space-y-2">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-mono font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>ADVANCED SUITE · 20 NEW FEATURES</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black font-display text-white">
                FootBuzz Command Center Hub
              </h2>

              <p className="text-xs text-emerald-100/90 leading-relaxed">
                Explore the complete arsenal of football analytics, historic photography archives, interactive tactical boards, and standalone app tools.
              </p>
            </div>

            {/* Grid of Tools */}
            <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
              {toolCards.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <div
                    key={tool.id}
                    onClick={tool.action}
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-[#009270] hover:shadow-lg transition-all duration-200 cursor-pointer space-y-2.5 flex flex-col justify-between group select-none"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform ${tool.color}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-mono font-bold">
                          {tool.badge}
                        </span>
                      </div>

                      <div className="text-[10px] font-mono text-[#009270] font-bold uppercase tracking-wider">
                        {tool.category}
                      </div>

                      <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-[#009270] transition-colors leading-snug">
                        {tool.title}
                      </h3>

                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {tool.desc}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-[#009270]">
                      <span>Launch Feature</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>All 20 features ready for standalone matchday use</span>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Close Hub
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-modals launched from the hub */}
      {activeModal === 'pwa' && (
        <PWAInstallModal isOpen={true} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'soundboard' && (
        <MatchSoundboardModal isOpen={true} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'penalty' && (
        <PenaltyShootoutModal isOpen={true} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'trophy' && (
        <TrophyRoomModal isOpen={true} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'tactics' && (
        <TacticalBoardModal isOpen={true} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'referee' && (
        <RefereeRadarModal isOpen={true} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'transfers' && (
        <TransferHubModal isOpen={true} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'h2h' && (
        <H2HMatrixModal isOpen={true} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'injury' && (
        <InjuryTrackerModal isOpen={true} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'predictor' && (
        <MatchPredictorModal isOpen={true} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'multimatch' && (
        <MultiMatchDashboard isOpen={true} onClose={() => setActiveModal(null)} matches={matches} />
      )}
      {activeModal === 'stadiums' && (
        <StadiumGuideModal isOpen={true} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'xg' && (
        <XGShotMapModal isOpen={true} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'weather' && (
        <WeatherRadarModal isOpen={true} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'timezone' && (
        <GlobalTimezoneModal isOpen={true} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'themes' && (
        <ThemeControllerModal isOpen={true} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'golden-shoe' && (
        <GoldenBootRaceModal isOpen={true} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'chants' && (
        <ChantsJukeboxModal isOpen={true} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'fan-pulse' && (
        <FanPulseModal isOpen={true} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'trivia' && (
        <FootballQuizModal isOpen={true} onClose={() => setActiveModal(null)} />
      )}
    </>
  );
};
