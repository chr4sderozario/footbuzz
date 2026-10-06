/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Interactive Football Command Center Hub
 * Comprehensive Launcher for all 30+ Advanced Football Tools & Features.
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
  BookOpen,
  Activity,
  Compass,
  Zap,
  Clock,
  Shield,
  Calculator,
  Search,
  CheckCircle2,
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
import { WinProbabilityGaugeModal } from './WinProbabilityGaugeModal';
import { PassHeatmapModal } from './PassHeatmapModal';
import { VarOffsideVisualizerModal } from './VarOffsideVisualizerModal';
import { BallonDorTrackerModal } from './BallonDorTrackerModal';
import { ClubCrestArchiveModal } from './ClubCrestArchiveModal';
import { WorldCupFinalsArchiveModal } from './WorldCupFinalsArchiveModal';
import { UefaCoefficientsModal } from './UefaCoefficientsModal';
import { FifaRankingsCalculatorModal } from './FifaRankingsCalculatorModal';
import { TacticsEncyclopediaModal } from './TacticsEncyclopediaModal';

interface FootballToolHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FootballToolHubModal: React.FC<FootballToolHubModalProps> = ({ isOpen, onClose }) => {
  const { navigateTo } = useApp();
  const matches = footballApi.getAllMatches();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  if (!isOpen && !activeModal) return null;

  const toolCards = [
    // 1. Women's Football Global Hub
    {
      id: 'womens-hub',
      title: "Women's Football Global Command Centre",
      category: "WOMEN'S FOOTBALL",
      desc: "Live scores, verified standings, and coverage for Barclays WSL, UWCL, NWSL, Liga F, and Indian Women's League (IWL).",
      icon: Sparkles,
      color: 'bg-purple-600 text-white',
      badge: "Women's Hub",
      action: () => {
        onClose();
        navigateTo('womens-football');
      },
    },
    // 2. Tournament Countdowns
    {
      id: 'tournaments-radar',
      title: 'Global Tournament Countdown Radar',
      category: 'COUNTDOWN RADAR',
      desc: 'Live per-second ticking countdowns and confirmed dates for FIFA World Cup 2026, Champions League, ISL, and 20+ leagues.',
      icon: Clock,
      color: 'bg-amber-600 text-white',
      badge: '20+ Leagues',
      action: () => {
        onClose();
        navigateTo('tournament-countdowns');
      },
    },
    // 3. Lightning News
    {
      id: 'lightning-news',
      title: 'Lightning Footy News 10s Live Channel',
      category: 'BREAKING NEWS',
      desc: '10-second automatic headline popup engine showcasing verified top footballer stories and transfer scoops.',
      icon: Zap,
      color: 'bg-emerald-600 text-white',
      badge: '10s Auto-Pop',
      action: () => {
        onClose();
        navigateTo('lightning-news');
      },
    },
    // 4. Win Probability Gauge
    {
      id: 'win-prob',
      title: 'Live Win Probability & Momentum Gauge',
      category: 'AI METRICS',
      desc: 'Real-time statistical likelihood of victory based on goal difference, match minute elapsed, and squad momentum.',
      icon: Activity,
      color: 'bg-emerald-700 text-white',
      badge: 'Live Elo',
      action: () => setActiveModal('win-prob'),
    },
    // 5. Pass Heatmap
    {
      id: 'pass-heatmap',
      title: 'Pass Accuracy & Pitch Heatmap Visualizer',
      category: 'OPTICAL ANALYTICS',
      desc: 'Zonal possession intensity, progressive pass completion, and high-turnover defensive territory.',
      icon: Compass,
      color: 'bg-teal-600 text-white',
      badge: 'Zone 14 Map',
      action: () => setActiveModal('pass-heatmap'),
    },
    // 6. VAR Offside
    {
      id: 'var-offside',
      title: 'VAR Review & 3D Offside Line Projector',
      category: 'REGULATORY',
      desc: 'Simulate calibrated 3D geometric vanishing lines, contact point freeze-frames, and IFAB Law 11 rulings.',
      icon: Eye,
      color: 'bg-rose-600 text-white',
      badge: 'Hawk-Eye 3D',
      action: () => setActiveModal('var-offside'),
    },
    // 7. Ballon d'Or
    {
      id: 'ballon-dor',
      title: "Ballon d'Or & Ballon d'Or Féminin Hall of Fame",
      category: 'HALL OF FAME',
      desc: "Official records, point tallies, and runner-up voting results for the Ballon d'Or from 1956 to 2026.",
      icon: Award,
      color: 'bg-amber-500 text-white',
      badge: '1956-2026',
      action: () => setActiveModal('ballon-dor'),
    },
    // 8. Club Crest Archive
    {
      id: 'crest-archive',
      title: 'Official Club Crest & Vector Archive',
      category: 'HERITAGE',
      desc: 'High-definition vector emblems, primary brand hex codes, and foundation history for 60+ world clubs.',
      icon: Shield,
      color: 'bg-slate-800 text-white',
      badge: '60+ Vectors',
      action: () => setActiveModal('crest-archive'),
    },
    // 9. World Cup Finals Archive
    {
      id: 'wc-finals',
      title: 'FIFA World Cup Finals Archive (1930 - 2022)',
      category: 'HISTORIC METRICS',
      desc: 'Official scorelines, winning captains, iconic goalscorers, and attendance records from 1930 to 2022.',
      icon: Trophy,
      color: 'bg-amber-600 text-white',
      badge: '22 Finals',
      action: () => setActiveModal('wc-finals'),
    },
    // 10. UEFA Coefficients
    {
      id: 'uefa-coeff',
      title: 'UEFA & AFC 5-Year Club Coefficients',
      category: 'RANKINGS',
      desc: '5-season cumulative European coefficient points determining Champions League seeding pots and EPS spots.',
      icon: Trophy,
      color: 'bg-blue-600 text-white',
      badge: 'UEFA Official',
      action: () => setActiveModal('uefa-coeff'),
    },
    // 11. FIFA Rankings Calculator
    {
      id: 'fifa-rankings',
      title: "FIFA Men's & Women's Rankings Calculator",
      category: 'MATHEMATICAL ENGINE',
      desc: 'Simulate exact ranking points gained or lost based on FIFA official formula: P = Pbefore + I * (W - We).',
      icon: Calculator,
      color: 'bg-emerald-600 text-white',
      badge: 'FIFA Formula',
      action: () => setActiveModal('fifa-rankings'),
    },
    // 12. Tactics Encyclopedia
    {
      id: 'tactics-encyclo',
      title: 'Football Tactics & Philosophy Encyclopedia',
      category: 'COACHING',
      desc: 'Learn the foundational ideas and counters for Tiki-Taka, Gegenpressing, Total Football, and Catenaccio.',
      icon: BookOpen,
      color: 'bg-indigo-600 text-white',
      badge: 'Tactical Guide',
      action: () => setActiveModal('tactics-encyclo'),
    },
    // 13. Trivia Quiz
    {
      id: 'trivia',
      title: 'Matchday Trivia & Tactical IQ Challenge',
      category: 'FOOTBALL IQ',
      desc: 'Interactive quiz testing knowledge on ISL, World Cup records, Champions League trivia, and IFAB rules.',
      icon: HelpCircle,
      color: 'bg-emerald-600 text-white',
      badge: 'Trivia Quiz',
      action: () => setActiveModal('trivia'),
    },
    // 14. Penalty Shootout
    {
      id: 'penalty',
      title: 'Penalty Shootout Simulator',
      category: 'INTERACTIVE MINI-GAME',
      desc: 'Sudden-death penalty shootout game. Target high corners and outwit the goalkeeper with real ball physics.',
      icon: Target,
      color: 'bg-rose-600 text-white',
      badge: 'Mini-Game',
      action: () => setActiveModal('penalty'),
    },
    // 15. Club Head-to-Head
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
    // 16. Tactical Whiteboard
    {
      id: 'tactics',
      title: 'Tactical Pitch Whiteboard Lab',
      category: 'TACTICAL ENGINE',
      desc: 'Interactive 11-player formation builder with Gegenpress, Tiki-Taka, and custom position dragging.',
      icon: Layers,
      color: 'bg-emerald-600 text-white',
      badge: '11v11 Lab',
      action: () => setActiveModal('tactics'),
    },
    // 17. Trophy Room
    {
      id: 'trophy',
      title: 'Club Trophy Cabinet & Hall of Fame',
      category: 'HALL OF FAME',
      desc: 'Complete trophy cabinets for 50+ world clubs across domestic league titles, continental cups, and World Cups.',
      icon: Trophy,
      color: 'bg-amber-600 text-white',
      badge: 'Trophies',
      action: () => setActiveModal('trophy'),
    },
    // 18. Referee Radar
    {
      id: 'referee',
      title: 'Referee & VAR Strictness Radar',
      category: 'REGULATORY',
      desc: 'Track referee cards per match, penalty tendencies, and VAR review overturn rates across leagues.',
      icon: Eye,
      color: 'bg-purple-600 text-white',
      badge: 'VAR Strictness',
      action: () => setActiveModal('referee'),
    },
    // 19. Transfers
    {
      id: 'transfers',
      title: 'Transfer Market Live Hub',
      category: 'MARKET RADAR',
      desc: 'Confirmed blockbuster signings, domestic record deals, and contract expiry alarms.',
      icon: ArrowRightLeft,
      color: 'bg-cyan-600 text-white',
      badge: 'Transfers',
      action: () => setActiveModal('transfers'),
    },
    // 20. Injury Ward
    {
      id: 'injury',
      title: 'Injury & Suspension Ward',
      category: 'MEDICAL SQUAD',
      desc: 'Hamstring & ACL recovery timelines, training returns, and yellow card ban risks.',
      icon: HeartPulse,
      color: 'bg-red-600 text-white',
      badge: 'Squad Health',
      action: () => setActiveModal('injury'),
    },
    // 21. Predictor
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
    // 22. Multi-Match
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
    // 23. Stadium Guide
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
    // 24. xG Shot Radar
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
    // 25. Weather
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
    // 26. Global Timezone
    {
      id: 'timezone',
      title: 'Global Timezone Converter',
      category: 'FIXTURE CLOCK',
      desc: 'Instantly convert match kickoffs to 40+ global timezones from London to Kolkata.',
      icon: Globe,
      color: 'bg-blue-600 text-white',
      badge: 'Timezones',
      action: () => setActiveModal('timezone'),
    },
    // 27. Golden Shoe
    {
      id: 'golden-shoe',
      title: 'European Golden Shoe Race',
      category: 'GOALSCORER',
      desc: 'Real-time coefficient-weighted points race: Goals × League Factor 2.0/1.5.',
      icon: Award,
      color: 'bg-yellow-600 text-white',
      badge: 'Golden Shoe',
      action: () => setActiveModal('golden-shoe'),
    },
    // 28. Stadium Soundboard
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
    // 29. Chants Jukebox
    {
      id: 'chants',
      title: 'Club Chants & Anthems Jukebox',
      category: 'FAN CULTURE',
      desc: 'Authentic chants and club anthems from Anfield to Salt Lake Stadium.',
      icon: Music,
      color: 'bg-rose-500 text-white',
      badge: 'Chants',
      action: () => setActiveModal('chants'),
    },
    // 30. Direct Device Download
    {
      id: 'download-app',
      title: 'Multi-Device App Download (APK/EXE/Mac/iOS)',
      category: 'STANDALONE APP',
      desc: 'Download FootBuzz directly as an Android APK (.apk), Windows PC launcher (.exe), or install to your home screen.',
      icon: Download,
      color: 'bg-emerald-600 text-white',
      badge: 'APK & EXE',
      action: () => setActiveModal('pwa'),
    },
  ];

  const filteredTools = toolCards.filter((t) => {
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.desc.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#009270] via-[#028060] to-[#091f16] text-white p-6 relative shrink-0">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-mono font-bold tracking-wide mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>30+ AUTHENTIC ADVANCED FOOTBALL ENGINES</span>
              </div>

              <h2 className="text-xl sm:text-3xl font-black font-display text-white">
                FootBuzz Command Center & Tool Hub
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
                Every single tool operates with verified real-world football rules, official FIFA/UEFA/AIFF data, mathematical Elo models, and interactive tactical visualizers.
              </p>
            </div>

            {/* Search Toolbar */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search 30 features (e.g. Women's, xG, Ballon d'Or, VAR)..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-[#009270]"
                />
              </div>

              <div className="text-xs font-mono font-bold text-slate-600 flex items-center gap-1.5 shrink-0">
                <CheckCircle2 className="w-4 h-4 text-[#009270]" />
                <span>Showing {filteredTools.length} of {toolCards.length} Verified Features</span>
              </div>
            </div>

            {/* Tools Grid */}
            <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
              {filteredTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <div
                    key={tool.id}
                    onClick={tool.action}
                    className="p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 hover:border-[#009270] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className={`w-9 h-9 rounded-xl ${tool.color} flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
                          {tool.badge}
                        </span>
                      </div>

                      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold pt-1">
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
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
              <span className="font-mono">All 30 tools active & ready with genuine verified data</span>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer"
              >
                Close Hub
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODALS */}
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
      {activeModal === 'win-prob' && (
        <WinProbabilityGaugeModal isOpen={true} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'pass-heatmap' && (
        <PassHeatmapModal isOpen={true} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'var-offside' && (
        <VarOffsideVisualizerModal isOpen={true} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'ballon-dor' && (
        <BallonDorTrackerModal isOpen={true} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'crest-archive' && (
        <ClubCrestArchiveModal isOpen={true} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'wc-finals' && (
        <WorldCupFinalsArchiveModal isOpen={true} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'uefa-coeff' && (
        <UefaCoefficientsModal isOpen={true} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'fifa-rankings' && (
        <FifaRankingsCalculatorModal isOpen={true} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'tactics-encyclo' && (
        <TacticsEncyclopediaModal isOpen={true} onClose={() => setActiveModal(null)} />
      )}
    </>
  );
};
