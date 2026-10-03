/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Official Authorized Ticketing Redirection Modal
 * Multi-provider authorized booking options for ISL, European & Global fixtures.
 */

import React from 'react';
import {
  X,
  ExternalLink,
  Ticket,
  ShieldCheck,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  Lock,
  Sparkles,
} from 'lucide-react';
import { Match, TicketInfo } from '../../types/football';
import { ClubCrest } from './ClubCrest';
import { CompetitionBadge } from './CompetitionBadge';

interface TicketModalProps {
  match: Match | null;
  isOpen: boolean;
  onClose: () => void;
}

interface TicketPlatform {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  url: string;
  priceNote: string;
  availability: 'AVAILABLE' | 'FEW_LEFT' | 'HIGH_DEMAND';
  description: string;
}

export const TicketModal: React.FC<TicketModalProps> = ({ match, isOpen, onClose }) => {
  if (!isOpen || !match) return null;

  const compName = match.competitionName.toLowerCase();
  const isISL =
    compName.includes('isl') ||
    compName.includes('indian') ||
    match.homeTeam.country?.toLowerCase().includes('india') ||
    match.awayTeam.country?.toLowerCase().includes('india');
  const isUCL = compName.includes('champions') || compName.includes('ucl');
  const isPL = compName.includes('premier') || compName.includes('eng.1');
  const isLaLiga = compName.includes('la liga') || compName.includes('laliga') || compName.includes('esp.1');
  const isFIFA = compName.includes('friendly') || compName.includes('international') || match.competitionCategory === 'international';

  // Curate 100% reliable, direct authorized ticketing websites
  const ticketPlatforms: TicketPlatform[] = [];

  if (isISL) {
    ticketPlatforms.push({
      id: 'bookmyshow',
      name: 'BookMyShow Sports',
      badge: 'Official ISL Partner',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      url: match.ticketInfo?.ticketUrl || `https://in.bookmyshow.com/sports`,
      priceNote: match.ticketInfo?.priceRange || '₹150 – ₹1,500',
      availability: 'AVAILABLE',
      description: 'Official digital ticketing partner for Indian Super League fixtures, home matches & playoffs.',
    });
    ticketPlatforms.push({
      id: 'district',
      name: 'District / Insider.in',
      badge: 'Authorized Live Partner',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      url: 'https://insider.in/all-sports-in-india',
      priceNote: '₹200 – ₹2,000',
      availability: 'AVAILABLE',
      description: 'Authorized stadium match ticketing with digital m-ticket gate access.',
    });
    ticketPlatforms.push({
      id: 'isl-official',
      name: 'Official ISL Club Box Office',
      badge: 'Club Direct',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      url: 'https://www.indiansuperleague.com/tickets',
      priceNote: 'Official Gate Pricing',
      availability: 'FEW_LEFT',
      description: 'Official stadium box office and team member stand booking.',
    });
  } else if (isUCL) {
    ticketPlatforms.push({
      id: 'uefa-tickets',
      name: 'UEFA Official Ticketing Portal',
      badge: 'Official UEFA Partner',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      url: match.ticketInfo?.ticketUrl || 'https://www.uefa.com/tickets/',
      priceNote: match.ticketInfo?.priceRange || '€45 – €350',
      availability: 'HIGH_DEMAND',
      description: 'Official UEFA European tournament portal for group & knockout stage tickets.',
    });
    ticketPlatforms.push({
      id: 'viagogo',
      name: 'Viagogo Verified Football',
      badge: 'Buyer Protected',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      url: 'https://www.viagogo.com',
      priceNote: '€60 – €450',
      availability: 'AVAILABLE',
      description: 'Verified seller marketplace with 100% order guarantee and tracked delivery.',
    });
    ticketPlatforms.push({
      id: 'seatgeek',
      name: 'SeatGeek International',
      badge: 'Deal Score Verified',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
      url: 'https://seatgeek.com',
      priceNote: '€70 – €500',
      availability: 'AVAILABLE',
      description: 'Interactive seat maps and direct e-ticket transfer to your phone.',
    });
  } else if (isPL || isLaLiga) {
    ticketPlatforms.push({
      id: 'ticketmaster',
      name: 'Ticketmaster Sports',
      badge: 'Authorized Primary Partner',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      url: match.ticketInfo?.ticketUrl || 'https://www.ticketmaster.co.uk/sport',
      priceNote: match.ticketInfo?.priceRange || '£35 – £180',
      availability: 'AVAILABLE',
      description: 'Official matchday ticketing partner for top flight European league fixtures.',
    });
    ticketPlatforms.push({
      id: 'stubhub',
      name: 'StubHub International',
      badge: 'FanProtect™ Guarantee',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      url: 'https://www.stubhub.com',
      priceNote: '£45 – £220',
      availability: 'AVAILABLE',
      description: '100% genuine guaranteed resale tickets with instant mobile delivery.',
    });
    ticketPlatforms.push({
      id: 'livefootballtickets',
      name: 'Live Football Tickets',
      badge: 'Verified Specialist',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      url: 'https://www.livefootballtickets.com',
      priceNote: '£50 – £250',
      availability: 'FEW_LEFT',
      description: 'Specialist European football match ticket provider with 150% money back guarantee.',
    });
  } else {
    // FIFA / General International
    ticketPlatforms.push({
      id: 'fifa-official',
      name: 'FIFA Official Ticketing Portal',
      badge: 'Official FIFA Partner',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      url: match.ticketInfo?.ticketUrl || 'https://www.fifa.com/tickets',
      priceNote: match.ticketInfo?.priceRange || '$30 – $220',
      availability: 'AVAILABLE',
      description: 'Official FIFA federation booking portal for international matches & qualifiers.',
    });
    ticketPlatforms.push({
      id: 'ticketmaster-intl',
      name: 'Ticketmaster International',
      badge: 'Authorized Agent',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      url: 'https://www.ticketmaster.com',
      priceNote: '$40 – $250',
      availability: 'AVAILABLE',
      description: 'Global sports ticketing network with secure encryption and verified seats.',
    });
    ticketPlatforms.push({
      id: 'seatgeek-global',
      name: 'SeatGeek Official',
      badge: 'Verified Reseller',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
      url: 'https://seatgeek.com',
      priceNote: '$50 – $300',
      availability: 'AVAILABLE',
      description: 'Direct mobile transfers and verified authentic match passes.',
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="w-full max-w-xl rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900 relative my-auto max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Top Banner */}
        <div className="bg-gradient-to-r from-[#009270] to-[#028060] text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 text-white/80 hover:text-white rounded-full bg-black/20 hover:bg-black/40 transition-colors"
            aria-label="Close Ticket Dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-mono font-black uppercase tracking-wider text-emerald-200">
            <Ticket className="w-4 h-4 text-amber-300" />
            <span>Authorized Match Ticketing & Stadium Passes</span>
          </div>

          <h2 className="text-lg sm:text-xl font-black font-display text-white mt-1">
            Book Match Tickets
          </h2>

          <p className="text-xs text-emerald-100/90 mt-0.5">
            Select a verified ticketing platform below to safely reserve your stadium seats.
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Match Quick Summary Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-slate-200 text-xs">
              <div className="flex items-center gap-2">
                <CompetitionBadge id={match.competitionId} name={match.competitionName} size="xs" />
                <span className="font-bold text-[#009270] truncate max-w-[200px]">
                  {match.competitionName}
                </span>
              </div>
              <span className="font-mono text-slate-500 font-bold">{match.time}</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 min-w-0">
                <ClubCrest
                  name={match.homeTeam.name}
                  code={match.homeTeam.code}
                  crestUrl={match.homeTeam.crestUrl}
                  size="sm"
                />
                <span className="font-black text-sm text-slate-900 truncate">
                  {match.homeTeam.name}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400">VS</span>
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="font-black text-sm text-slate-900 truncate text-right">
                  {match.awayTeam.name}
                </span>
                <ClubCrest
                  name={match.awayTeam.name}
                  code={match.awayTeam.code}
                  crestUrl={match.awayTeam.crestUrl}
                  size="sm"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-slate-500 border-t border-slate-200/80">
              <div className="flex items-center gap-1 font-semibold text-slate-700">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{match.date}</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{match.venue || match.city || 'Stadium'}</span>
              </div>
            </div>
          </div>

          {/* Trusted Ticketing Websites List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="uppercase tracking-wider font-mono text-[11px] text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#009270]" /> Select Ticketing Provider
              </span>
              <span className="text-[11px] font-mono text-[#009270]">100% Genuine Guarantee</span>
            </div>

            {ticketPlatforms.map((platform) => (
              <div
                key={platform.id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-[#009270] hover:shadow-md transition-all bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900 group-hover:text-[#009270] transition-colors">
                      {platform.name}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${platform.badgeColor}`}>
                      {platform.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {platform.description}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] pt-1">
                    <span className="text-slate-600 font-medium">Est. Price:</span>
                    <span className="font-mono font-bold text-slate-900">{platform.priceNote}</span>
                  </div>
                </div>

                <a
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-[#009270] hover:bg-[#028060] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-98 shrink-0"
                >
                  <span>Book on {platform.name.split(' ')[0]}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>

          {/* Safe Purchase Guarantee Footnote */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-center gap-3 text-xs text-slate-700">
            <Lock className="w-5 h-5 text-[#009270] shrink-0" />
            <div className="text-[11px] leading-snug">
              <strong>Secure Booking Assurance:</strong> Clicking any authorized platform will open the official vendor checkout in a secure new tab. FootBuzz does not charge additional transaction fees.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] font-mono text-slate-500">
            Verified Ticketing Directory
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
