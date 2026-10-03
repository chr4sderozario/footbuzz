/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Global Timezone Converter & Calendar (.ICS) Exporter
 */

import React, { useState } from 'react';
import { Globe, Calendar, Clock, Download, X, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface GlobalTimezoneModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalTimezoneModal: React.FC<GlobalTimezoneModalProps> = ({ isOpen, onClose }) => {
  const { addToast } = useApp();
  const [selectedZone, setSelectedZone] = useState<string>('IST');

  if (!isOpen) return null;

  const timezones = [
    { id: 'IST', label: 'India Standard Time (IST)', offset: 'UTC+5:30', current: '17:30' },
    { id: 'GMT', label: 'Greenwich Mean Time (GMT / London)', offset: 'UTC+0:00', current: '12:00' },
    { id: 'CET', label: 'Central European Time (CET / Madrid, Paris)', offset: 'UTC+1:00', current: '13:00' },
    { id: 'EST', label: 'Eastern Standard Time (EST / New York)', offset: 'UTC-5:00', current: '07:00' },
    { id: 'JST', label: 'Japan / Tokyo Standard Time (JST)', offset: 'UTC+9:00', current: '21:00' },
  ];

  const handleExportICS = () => {
    // Generate clean .ics format
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//FootBuzz//Live Football Calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'SUMMARY:FootBuzz Matchday: Mohun Bagan SG vs Mumbai City FC',
      'DESCRIPTION:ISL 2026/27 Live Match broadcast on FootBuzz Command Centre.',
      'LOCATION:Salt Lake Stadium, Kolkata',
      'DTSTART:20261004T140000Z',
      'DTEND:20261004T160000Z',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'footbuzz_matchday_fixtures.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('Calendar Exported', 'Downloaded .ICS file for Google Calendar / Apple Calendar.', 'SUCCESS');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-[#102a43] to-[#0284c7] text-white p-6 relative shrink-0 space-y-2">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-mono font-bold tracking-wide">
            <Globe className="w-3.5 h-3.5" />
            <span>GLOBAL KICKOFF CONVERTER</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-display text-white">
            Timezone Sync & Calendar Export
          </h2>

          <p className="text-xs text-sky-100/90 leading-relaxed">
            Synchronize kickoff times directly with your native calendar and switch seamlessly between Indian Standard Time, GMT, and European clocks.
          </p>
        </div>

        {/* Timezone List */}
        <div className="p-6 space-y-3">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
            Select Your Preferred Kickoff Clock
          </div>

          <div className="space-y-2">
            {timezones.map((tz) => {
              const isSelected = selectedZone === tz.id;
              return (
                <div
                  key={tz.id}
                  onClick={() => setSelectedZone(tz.id)}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'border-[#0284c7] bg-sky-50 ring-2 ring-[#0284c7]/20 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="font-extrabold text-xs text-slate-900">{tz.label}</div>
                    <div className="text-[10px] font-mono text-slate-400">{tz.offset}</div>
                  </div>
                  <span className="font-mono font-black text-sm text-[#0284c7]">{tz.current}</span>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={handleExportICS}
              className="w-full py-3 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-black transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Fixtures to Calendar (.ICS)</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Google Calendar & Apple iCal Ready</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
