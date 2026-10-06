/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Football Tactics & Philosophy Encyclopedia Tool
 * Detailed interactive guide to Tiki-Taka, Gegenpressing, Catenaccio, Total Football, and modern tactical setups.
 */

import React, { useState } from 'react';
import { Layers, Sparkles, BookOpen, Search, X, ChevronRight, ShieldCheck, Flame } from 'lucide-react';

interface TacticsEncyclopediaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TacticalConcept {
  id: string;
  name: string;
  pioneers: string;
  keyPrinciples: string[];
  idealFormations: string[];
  pros: string;
  counters: string;
  icon: string;
  description: string;
}

export const TACTICAL_CONCEPTS_DATA: TacticalConcept[] = [
  {
    id: 'tiki-taka',
    name: 'Tiki-Taka (Positional Possession & Rondo Overloads)',
    pioneers: 'Pep Guardiola, Johan Cruyff, Luis Aragonés (Barcelona 2008-2012, Spain 2008-2012)',
    keyPrinciples: [
      'Short, rapid 1-2 touch passing in numerical superiority triangles',
      '6-second aggressive counter-press rule immediately after losing possession',
      'Patience in circulation to disorganize low-block defenses',
    ],
    idealFormations: ['4-3-3', '3-2-4-1 Box Midfield'],
    pros: 'Completely exhausts opponents physically & mentally; limits opponent shot volume.',
    counters: 'Rapid direct counter-attacks through explosive wingers and disciplined compact low-blocks.',
    icon: '⚡',
    description: 'Style of play characterized by short passing and movement, working the ball through various channels, and maintaining possession.',
  },
  {
    id: 'gegenpressing',
    name: 'Gegenpressing (Heavy-Metal Counter-Pressing)',
    pioneers: 'Jürgen Klopp, Ralf Rangnick, Arrigo Sacchi (Borussia Dortmund, Liverpool, AC Milan)',
    keyPrinciples: [
      'The moment the ball is lost is the highest opportunity to score',
      'Instant ball-oriented swarm within 5 seconds of turnover',
      'Vertical, direct attacking play directly into transition space',
    ],
    idealFormations: ['4-3-3 Heavy', '4-2-3-1 Pressing'],
    pros: 'Creates high-xG scoring chances within 10 yards of opponent penalty box.',
    counters: 'Composed goalkeepers who can play accurate 60-yard long diagonals over the press.',
    icon: '🔥',
    description: 'A German tactical philosophy where the team immediately attempts to win back possession in the attacking third rather than retreating.',
  },
  {
    id: 'total-football',
    name: 'Total Football (Totaalvoetbal)',
    pioneers: 'Rinus Michels, Johan Cruyff (Ajax 1970s, Netherlands 1974)',
    keyPrinciples: [
      'Any outfield player can take over the role of any other player in a team',
      'Fluid position switching to exploit spatial superiority',
      'High defensive line with active offside traps',
    ],
    idealFormations: ['4-3-3 Fluid', '3-4-3 Diamond'],
    pros: 'Unpredictable movement impossible for man-marking systems to contain.',
    counters: 'Hyper-disciplined zonal marking and physically imposing set-piece specialists.',
    icon: '🌟',
    description: 'A tactical system where no outfield player is fixed in a predetermined role; anyone can succeed as an attacker, midfielder, or defender.',
  },
  {
    id: 'catenaccio',
    name: 'Catenaccio & Low-Block Defensive Masterclasses',
    pioneers: 'Helenio Herrera, Nereo Rocco, José Mourinho (Inter Milan, Chelsea 2004)',
    keyPrinciples: [
      'Deep, ultra-compact central defensive line (the "padlock")',
      'Dedicated sweeper (Libero) behind the center-backs',
      'Ruthless rapid long-ball counter-attacks with minimal passes',
    ],
    idealFormations: ['5-3-2', '5-4-1 Low Block', '4-4-2 Flat'],
    pros: 'Incredibly difficult to break down; excellent for tournament knockout stages.',
    counters: 'Elite long-distance shooters and set-piece headers from corner kicks.',
    icon: '🛡️',
    description: 'A tactical system emphasizing strict defensive organization, eliminating space between lines, and preventing inside penetration.',
  },
];

export const TacticsEncyclopediaModal: React.FC<TacticsEncyclopediaModalProps> = ({ isOpen, onClose }) => {
  const [selectedConcept, setSelectedConcept] = useState<TacticalConcept>(TACTICAL_CONCEPTS_DATA[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-[#07241c] to-slate-950 text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold tracking-wide border border-emerald-500/30 mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>TACTICAL PHILOSOPHIES & COACHING MASTERCLASS</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-display text-white">
            Football Tactics & Philosophy Encyclopedia
          </h2>
          <p className="text-xs text-slate-300">
            Learn the foundational ideas behind Tiki-Taka, Gegenpressing, Total Football, and Catenaccio.
          </p>
        </div>

        {/* Concept Selector Tabs */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs shrink-0">
          {TACTICAL_CONCEPTS_DATA.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedConcept(c)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedConcept.id === c.id
                  ? 'bg-[#009270] text-white shadow-xs'
                  : 'bg-white border text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.name.split('(')[0].trim()}</span>
            </button>
          ))}
        </div>

        {/* Concept Details Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs text-slate-700">
          <div className="space-y-1">
            <h3 className="text-lg font-black font-display text-slate-900 flex items-center gap-2">
              <span>{selectedConcept.icon}</span>
              <span>{selectedConcept.name}</span>
            </h3>
            <p className="text-slate-600 leading-relaxed">{selectedConcept.description}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-medium">
            <span className="font-bold text-slate-900">Iconic Coaches & Teams: </span>
            <span>{selectedConcept.pioneers}</span>
          </div>

          <div className="space-y-2">
            <div className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
              Key Tactical Principles:
            </div>
            <div className="space-y-1.5">
              {selectedConcept.keyPrinciples.map((p, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded-xl bg-emerald-50 border border-emerald-100 font-medium text-emerald-950">
                  <span className="font-mono font-bold text-[#009270]">0{i + 1}.</span>
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-bold text-emerald-800">Primary Tactical Strengths:</div>
              <p className="text-[11px] text-slate-600 leading-relaxed">{selectedConcept.pros}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-bold text-rose-800">How Opponents Counter It:</div>
              <p className="text-[11px] text-slate-600 leading-relaxed">{selectedConcept.counters}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <span className="text-[11px] font-mono text-slate-400">UEFA Pro License Curriculum</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
