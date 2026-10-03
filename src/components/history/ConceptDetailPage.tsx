/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, BookOpen, CheckCircle, Shield, Users } from 'lucide-react';
import { footballApi } from '../../services/footballApi';
import { useApp } from '../../context/AppContext';

export const ConceptDetailPage: React.FC<{ conceptId: string }> = ({ conceptId }) => {
  const concept = footballApi.getConceptById(conceptId);
  const { navigateTo } = useApp();

  if (!concept) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
        Concept not found.{' '}
        <button onClick={() => navigateTo('history')} className="text-[#009270] font-bold underline">
          Back to History
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200 max-w-4xl mx-auto">
      {/* Back Breadcrumb */}
      <button
        onClick={() => navigateTo('history')}
        className="flex items-center gap-1.5 text-xs font-bold text-[#009270] hover:underline transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Football Knowledge</span>
      </button>

      {/* Header Banner */}
      <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 p-6 sm:p-8 space-y-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-[#009270] uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>{(concept.category || 'tactics').replace('_', ' ')}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
          {concept.name}
        </h1>

        <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-2xl">
          {concept.shortDesc || concept.shortSummary}
        </p>

        <div className="pt-2 border-t border-slate-100 text-xs text-slate-500">
          <strong className="text-slate-800 mr-1">Historical Origin:</strong> {concept.origin || concept.originEra || 'Modern Era'}
        </div>
      </div>

      {/* Detailed Explanation */}
      <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 p-6 space-y-2 shadow-xs">
        <h2 className="text-base font-extrabold text-slate-900">Comprehensive Tactical Breakdown</h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          {concept.explanation}
        </p>
      </div>

      {/* Core Principles & Famous Teams */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 p-6 space-y-3 shadow-xs">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#009270]" /> Core Tactical Principles
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-700">
            {(concept.keyPrinciples || []).map((principle, idx) => (
              <li key={`prin-${idx}`} className="flex items-start gap-2.5">
                <span className="text-[#009270] font-black shrink-0">✔</span>
                <span>{principle}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 p-6 space-y-3 shadow-xs">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" /> Famous Exemplars & Managers
          </h3>
          <ul className="space-y-2 text-xs text-slate-700">
            {(concept.famousTeamsOrManagers || concept.famousTeamsUsed || []).map((team: string, idx: number) => (
              <li key={`team-${idx}`} className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-100">
                <Shield className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="font-semibold text-slate-800">{team}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
