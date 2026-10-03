/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Stadium Anthems & Fan Chants Jukebox
 * Authentic chants, stadium lyrics, and synchronized crowd atmosphere.
 */

import React, { useState } from 'react';
import { Music, Volume2, Play, Pause, X, Sparkles, Trophy } from 'lucide-react';
import { ClubCrest } from '../common/ClubCrest';

interface ChantItem {
  id: string;
  club: string;
  clubId: string;
  anthemTitle: string;
  country: string;
  lyrics: string[];
  tradition: string;
}

const CHANTS_ARCHIVE: ChantItem[] = [
  {
    id: 'chant-mohunbagan',
    club: 'Mohun Bagan SG',
    clubId: 'team-mohunbagan',
    anthemTitle: 'Amra Shobai Bagan Premi (Joy Mohun Bagan)',
    country: 'India 🇮🇳',
    lyrics: [
      'Amra shobai bagan premi, shobai shobuj-maroon-er sathi!',
      'Joy Mohun Bagan! Ekhon tobu math-e gorbo amar!',
      'From 1911 IFA Shield till eternity, the National Club of India roars!'
    ],
    tradition: 'Sung by 60,000+ Mariners before every Kolkata Derby at Salt Lake Stadium.',
  },
  {
    id: 'chant-liverpool',
    club: 'Liverpool FC',
    clubId: 'team-liverpool',
    anthemTitle: "You'll Never Walk Alone (YNWA)",
    country: 'England 🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    lyrics: [
      'When you walk through a storm, hold your head up high...',
      'And don\'t be afraid of the dark!',
      'At the end of a storm, there\'s a golden sky, and the sweet silver song of a lark.',
      'Walk on through the wind, walk on through the rain...',
      'Though your dreams be tossed and blown! Walk on, walk on, with hope in your heart...',
      'And you\'ll never walk alone! You\'ll never walk alone!'
    ],
    tradition: 'Iconic spine-tingling anthem sung on The Kop at Anfield before every home European night.',
  },
  {
    id: 'chant-realmadrid',
    club: 'Real Madrid',
    clubId: 'team-realmadrid',
    anthemTitle: '¡Hala Madrid y nada más!',
    country: 'Spain 🇪🇸',
    lyrics: [
      'Historia que tú hiciste, historia por hacer...',
      'Porque nadie resiste tus ganas de vencer!',
      'Ya salen las estrellas, mi viejo Chamartín...',
      'De lejos y de cerca, nos traes hasta aquí!',
      '¡Hala Madrid! ¡Hala Madrid! ¡Y nada más! ¡Y nada más! ¡Hala Madrid!'
    ],
    tradition: 'Composed by RedOne to celebrate La Décima in 2014; echoed by 80,000 Madridistas at the Bernabéu.',
  },
  {
    id: 'chant-bengaluru',
    club: 'Bengaluru FC',
    clubId: 'team-bengaluru',
    anthemTitle: 'We Are BFC (West Block Blues Anthem)',
    country: 'India 🇮🇳',
    lyrics: [
      'Who are we? We are Bengaluru FC!',
      'From the garden city with our pride and blue!',
      'Stand up for the champions, Sunil Chhetri scores again!'
    ],
    tradition: 'Created by the passionate West Block Blues supporters at the Fortress (Kanteerava).',
  },
  {
    id: 'chant-arsenal',
    club: 'Arsenal FC',
    clubId: 'team-arsenal',
    anthemTitle: 'North London Forever (The Angel)',
    country: 'England 🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    lyrics: [
      'North London forever, whatever the weather, these streets are our own...',
      'And my heart will leave you, never! My blood will keep runnin\' through!',
      'North London forever!'
    ],
    tradition: 'Written by Louis Dunford, officially adopted at the Emirates Stadium before every kickoff.',
  },
];

export const ChantsJukeboxModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [selectedChant, setSelectedChant] = useState<ChantItem>(CHANTS_ARCHIVE[0]);
  const [isPlayingSim, setIsPlayingSim] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-[#009270] text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-mono font-bold tracking-wide">
            <Music className="w-3.5 h-3.5 text-emerald-300" />
            <span>STADIUM ANTHEMS & CHANTS</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-display mt-2 text-white">
            Fan Chants & Stadium Anthems Jukebox
          </h2>
          <p className="text-xs text-emerald-100 mt-1">
            Sing along to the immortal terrace chants of world football and Indian Super League.
          </p>
        </div>

        {/* Club Chooser Strip */}
        <div className="flex items-center gap-2 p-3 bg-slate-50 border-b border-slate-200 text-xs overflow-x-auto no-scrollbar">
          {CHANTS_ARCHIVE.map((chant) => (
            <button
              key={chant.id}
              onClick={() => {
                setSelectedChant(chant);
                setIsPlayingSim(false);
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all border ${
                selectedChant.id === chant.id
                  ? 'bg-[#009270] text-white border-[#009270] shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <ClubCrest code={chant.club.substring(0, 3)} name={chant.club} size="xs" />
              <span>{chant.club}</span>
            </button>
          ))}
        </div>

        {/* Selected Chant Lyrics Display */}
        <div className="p-6 overflow-y-auto space-y-4 max-h-[55vh]">
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start justify-between gap-4">
            <div>
              <div className="text-[11px] font-mono text-[#009270] font-bold uppercase tracking-wider">
                {selectedChant.country} · Club Anthem
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                {selectedChant.anthemTitle}
              </h3>
              <p className="text-xs text-slate-600 mt-1">{selectedChant.tradition}</p>
            </div>

            <button
              onClick={() => setIsPlayingSim(!isPlayingSim)}
              className={`px-4 py-2 rounded-xl font-black text-xs flex items-center gap-2 shrink-0 transition-all ${
                isPlayingSim
                  ? 'bg-amber-500 text-slate-950 animate-pulse'
                  : 'bg-[#009270] text-white hover:bg-[#028060]'
              }`}
            >
              {isPlayingSim ? (
                <>
                  <Pause className="w-3.5 h-3.5" /> Singing...
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" /> Sing Terrace Chant
                </>
              )}
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 text-white font-serif space-y-2 border border-slate-800 shadow-inner">
            <div className="text-[11px] font-sans font-mono uppercase tracking-wider text-emerald-400 font-bold mb-3">
              Official Terrace Chants & Lyrics:
            </div>
            {selectedChant.lyrics.map((line, idx) => (
              <p
                key={idx}
                className={`text-sm sm:text-base leading-relaxed ${
                  isPlayingSim && idx === 0 ? 'text-amber-300 font-bold' : 'text-slate-200'
                }`}
              >
                "{line}"
              </p>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Terrace culture preserving football heritage</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
