/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Reliable High-Fidelity Player Portrait Component
 * Uses verified open CDNs with graceful, styled football jersey card fallbacks.
 */

import React, { useState } from 'react';

// Reliable, real verified high-resolution portraits for football stars and legends
const VERIFIED_PORTRAITS: Record<string, string> = {
  // Men's Global Stars
  'player-messi': '/players/messi.jpg',
  'player-ronaldo': '/players/ronaldo.jpg',
  'player-ronaldo-cr7': '/players/ronaldo.jpg',
  'player-haaland': '/players/haaland.jpg',
  'player-mbappe': '/players/mbappe.jpg',
  'player-yamal': '/players/yamal.jpg',
  'player-vinicius': '/players/vinicius.jpg',
  'player-bellingham': '/players/bellingham.jpg',
  'player-saka': '/players/saka.jpg',
  'player-salah': '/players/salah.jpg',
  'player-debruyne': '/players/debruyne.jpg',
  'player-rodri': '/players/rodri.jpg',
  'player-palmer': '/players/palmer.jpg',
  'player-foden': '/players/foden.jpg',
  'player-rice': '/players/rice.jpg',
  'player-vandijk': '/players/vandijk.jpg',
  'player-kane': '/players/kane.jpg',
  'player-lewandowski': '/players/lewandowski.jpg',
  'player-modric': '/players/modric.jpg',
  'player-courtois': '/players/courtois.jpg',
  'player-alisson': '/players/alisson.jpg',
  'player-odegaard': '/players/odegaard.jpg',
  'player-pedri': '/players/pedri.jpg',
  'player-raphinha': '/players/raphinha.jpg',

  // ISL & Indian Football Stars
  'player-chhetri': '/players/chhetri.jpg',
  'player-petratos': '/players/petratos.jpg',
  'player-colaco': '/players/colaco.jpg',
  'p-colaco': '/players/colaco.jpg',
  'player-chhangte': '/players/chhangte.jpg',
  'player-gurpreet': '/players/gurpreet.jpg',
  'player-jhingan': '/players/jhingan.jpg',
  'player-thapa': '/players/thapa.jpg',
  'player-bose': '/players/bose.jpg',

  // Women's Football Superstars
  'wplayer-aitana': '/players/aitana.jpg',
  'player-aitana': '/players/aitana.jpg',
  'wplayer-alexia': '/players/alexia.jpg',
  'player-alexia': '/players/alexia.jpg',
  'wplayer-kerr': '/players/sam_kerr.jpg',
  'player-kerr': '/players/sam_kerr.jpg',
  'wplayer-russo': '/players/russo.jpg',
  'player-russo': '/players/russo.jpg',
  'wplayer-smith': '/players/sophia_smith.jpg',
  'player-smith': '/players/sophia_smith.jpg',
  'wplayer-earps': '/players/mary_earps.jpg',
  'player-earps': '/players/mary_earps.jpg',
  'wplayer-james': '/players/lauren_james.jpg',
  'player-james': '/players/lauren_james.jpg',
  'wplayer-rodman': '/players/trinity_rodman.jpg',
  'player-rodman': '/players/trinity_rodman.jpg',
  'wplayer-caicedo': '/players/linda_caicedo.jpg',
  'player-caicedo': '/players/linda_caicedo.jpg',
  'wplayer-miedema': '/players/miedema.jpg',
  'player-miedema': '/players/miedema.jpg',
  'wplayer-manisha': '/players/manisha.jpg',
  'player-manisha': '/players/manisha.jpg',
  'wplayer-bala': '/players/bala_devi.jpg',
  'player-bala': '/players/bala_devi.jpg',

  // Football Legends
  'player-pele': '/players/pele.jpg',
  'player-maradona': '/players/maradona.jpg',
  'player-zidane': '/players/zidane.jpg',
};

// Name-based portrait matching fallback
const getPortraitByName = (name: string): string | undefined => {
  if (!name) return undefined;
  const n = name.toLowerCase();
  if (n.includes('messi')) return '/players/messi.jpg';
  if (n.includes('ronaldo') && !n.includes('nazario')) return '/players/ronaldo.jpg';
  if (n.includes('haaland')) return '/players/haaland.jpg';
  if (n.includes('mbapp') || n.includes('mbappe')) return '/players/mbappe.jpg';
  if (n.includes('yamal')) return '/players/yamal.jpg';
  if (n.includes('vinicius') || n.includes('vinícius')) return '/players/vinicius.jpg';
  if (n.includes('bellingham')) return '/players/bellingham.jpg';
  if (n.includes('saka')) return '/players/saka.jpg';
  if (n.includes('salah')) return '/players/salah.jpg';
  if (n.includes('de bruyne')) return '/players/debruyne.jpg';
  if (n.includes('rodri')) return '/players/rodri.jpg';
  if (n.includes('palmer')) return '/players/palmer.jpg';
  if (n.includes('foden')) return '/players/foden.jpg';
  if (n.includes('rice')) return '/players/rice.jpg';
  if (n.includes('van dijk')) return '/players/vandijk.jpg';
  if (n.includes('kane')) return '/players/kane.jpg';
  if (n.includes('lewandowski')) return '/players/lewandowski.jpg';
  if (n.includes('modric') || n.includes('modrić')) return '/players/modric.jpg';
  if (n.includes('courtois')) return '/players/courtois.jpg';
  if (n.includes('alisson')) return '/players/alisson.jpg';
  if (n.includes('odegaard') || n.includes('ødegaard')) return '/players/odegaard.jpg';
  if (n.includes('pedri')) return '/players/pedri.jpg';
  if (n.includes('raphinha')) return '/players/raphinha.jpg';

  if (n.includes('chhetri')) return '/players/chhetri.jpg';
  if (n.includes('petratos')) return '/players/petratos.jpg';
  if (n.includes('colaco') || n.includes('colaço')) return '/players/colaco.jpg';
  if (n.includes('chhangte')) return '/players/chhangte.jpg';
  if (n.includes('gurpreet')) return '/players/gurpreet.jpg';
  if (n.includes('jhingan')) return '/players/jhingan.jpg';
  if (n.includes('thapa')) return '/players/thapa.jpg';
  if (n.includes('bose') && (n.includes('subhasish') || n.includes('subhashish'))) return '/players/bose.jpg';

  if (n.includes('aitana') || n.includes('bonmatí') || n.includes('bonmati')) return '/players/aitana.jpg';
  if (n.includes('alexia') || n.includes('putellas')) return '/players/alexia.jpg';
  if (n.includes('kerr')) return '/players/sam_kerr.jpg';
  if (n.includes('russo')) return '/players/russo.jpg';
  if (n.includes('sophia smith') || (n.includes('smith') && n.includes('sophia'))) return '/players/sophia_smith.jpg';
  if (n.includes('earps')) return '/players/mary_earps.jpg';
  if (n.includes('lauren james')) return '/players/lauren_james.jpg';
  if (n.includes('rodman')) return '/players/trinity_rodman.jpg';
  if (n.includes('caicedo') && n.includes('linda')) return '/players/linda_caicedo.jpg';
  if (n.includes('miedema')) return '/players/miedema.jpg';
  if (n.includes('manisha') || n.includes('kalyan')) return '/players/manisha.jpg';
  if (n.includes('bala devi')) return '/players/bala_devi.jpg';

  if (n.includes('pelé') || n === 'pele') return '/players/pele.jpg';
  if (n.includes('maradona')) return '/players/maradona.jpg';
  if (n.includes('zidane')) return '/players/zidane.jpg';

  return undefined;
};

// Team palette gradients for custom football jersey cards
const getTeamGradient = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('mohun bagan')) return 'from-[#800020] via-[#006633] to-[#800020]';
  if (n.includes('bengaluru')) return 'from-[#1a3a6b] via-[#d62828] to-[#1a3a6b]';
  if (n.includes('mumbai city')) return 'from-[#6cabdd] via-[#1c2c5b] to-[#6cabdd]';
  if (n.includes('kerala')) return 'from-[#fec325] via-[#004e98] to-[#fec325]';
  if (n.includes('east bengal')) return 'from-[#d90429] via-[#ffb703] to-[#d90429]';
  if (n.includes('manchester city') || n.includes('mancity')) return 'from-[#6cabdd] via-[#1c2c5b] to-[#6cabdd]';
  if (n.includes('real madrid')) return 'from-[#0f172a] via-[#fbbf24] to-[#0f172a]';
  if (n.includes('barcelona')) return 'from-[#004d98] via-[#a50044] to-[#edbb00]';
  if (n.includes('arsenal')) return 'from-[#db0007] via-[#023474] to-[#db0007]';
  if (n.includes('liverpool')) return 'from-[#c8102e] via-[#00b2a9] to-[#c8102e]';
  return 'from-[#009270] via-[#028060] to-[#090d16]';
};

interface PlayerAvatarProps {
  id?: string;
  name: string;
  photoUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  number?: number;
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  id = '',
  name = '',
  photoUrl,
  size = 'md',
  className = '',
  number,
}) => {
  const [hasError, setHasError] = useState(false);

  // Match photoUrl: verified local portraits by ID, then name, then direct photoUrl
  const directPhoto =
    photoUrl && !photoUrl.includes('espncdn.com') && !photoUrl.includes('unsplash.com/photo-')
      ? photoUrl
      : undefined;

  const matchedPhoto =
    VERIFIED_PORTRAITS[id] ||
    VERIFIED_PORTRAITS[id.toLowerCase()] ||
    getPortraitByName(name) ||
    directPhoto;

  const sizeClasses = {
    xs: 'w-7 h-7 text-[10px]',
    sm: 'w-9 h-9 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-20 h-20 text-xl',
    '2xl': 'w-28 h-28 text-3xl',
  }[size];

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
    : 'FB';

  if (matchedPhoto && !hasError) {
    return (
      <div
        className={`${sizeClasses} relative rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200 border border-slate-200/90 overflow-hidden shrink-0 shadow-2xs flex items-center justify-center select-none ${className}`}
      >
        <img
          src={matchedPhoto}
          alt={name}
          className="w-full h-full object-cover object-center"
          loading="lazy"
          onError={() => setHasError(true)}
        />
        {number !== undefined && number > 0 && (
          <span className="absolute bottom-0.5 right-0.5 px-1 py-0.2 bg-slate-950/80 backdrop-blur-xs rounded text-[9px] font-mono font-bold text-white shadow-2xs">
            #{number}
          </span>
        )}
      </div>
    );
  }

  // High-fidelity football kit avatar fallback
  const teamGrad = getTeamGradient(name);

  return (
    <div
      className={`${sizeClasses} relative rounded-2xl bg-gradient-to-br ${teamGrad} border border-white/20 text-white font-mono font-black flex flex-col items-center justify-center shadow-md overflow-hidden shrink-0 select-none ${className}`}
      title={name}
    >
      {/* Kit Collar Silhouette */}
      <div className="absolute top-0 w-1/2 h-1.5 bg-white/30 rounded-b-md" />
      <span className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] tracking-tight">
        {initials}
      </span>
      {number !== undefined && number > 0 && (
        <span className="absolute bottom-0.5 right-0.5 px-1 py-0.2 bg-black/60 rounded text-[9px] font-mono text-emerald-300 font-black">
          #{number}
        </span>
      )}
    </div>
  );
};
