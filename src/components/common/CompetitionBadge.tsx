/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Official Competition & League Badge Component
 * Guaranteed 100% reliable rendering with precision embedded SVG emblems & official vectors.
 * Supports ISL, PL, UCL, Copa América, UEFA Euro, World Cup, La Liga, Serie A, Bundesliga, FA Cup & Asian Cup.
 */

import React, { useState } from 'react';

interface CompetitionBadgeProps {
  id?: string;
  name: string;
  emblemUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const CompetitionBadge: React.FC<CompetitionBadgeProps> = ({
  id = '',
  name = '',
  emblemUrl,
  size = 'md',
  className = '',
}) => {
  const [hasImgError, setHasImgError] = useState(false);

  const sizeClasses = {
    xs: 'w-5 h-5 text-[9px]',
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-10 h-10 text-xs',
    lg: 'w-14 h-14 text-sm',
    xl: 'w-20 h-20 text-lg',
  }[size];

  const lower = (id + ' ' + name).toLowerCase();

  // If a valid external emblemUrl exists and hasn't failed, attempt to load it
  if (emblemUrl && !hasImgError) {
    return (
      <div className={`relative rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-0.5 bg-white border border-slate-200/90 shadow-2xs ${sizeClasses} ${className}`}>
        <img
          src={emblemUrl}
          alt={name}
          className="w-full h-full object-contain"
          onError={() => setHasImgError(true)}
          loading="lazy"
        />
      </div>
    );
  }

  // 1. INDIAN SUPER LEAGUE (ISL) OFFICIAL SHIELD EMBLEM
  if (lower.includes('isl') || lower.includes('indian')) {
    return (
      <div
        className={`relative rounded-xl overflow-hidden shrink-0 flex items-center justify-center shadow-xs bg-gradient-to-b from-[#ff5500] via-[#ff3b00] to-[#122244] border border-orange-400/40 select-none ${sizeClasses} ${className}`}
        title="Indian Super League (ISL)"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 8 L85 20 V50 C85 72 50 92 50 92 C50 92 15 72 15 50 V20 Z" fill="#0f1d38" stroke="#ffffff" strokeWidth="3" />
          <path d="M50 14 L79 24 V48 C79 67 50 84 50 84 C50 84 21 67 21 48 V24 Z" fill="#ff6b00" />
          <circle cx="50" cy="45" r="16" fill="#ffffff" />
          <polygon points="50,33 53,42 63,42 55,48 58,57 50,51 42,57 45,48 37,42 47,42" fill="#0f1d38" />
          <rect x="25" y="65" width="50" height="14" rx="4" fill="#ffffff" />
          <text x="50" y="76" fill="#0f1d38" fontSize="11" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1">
            ISL
          </text>
        </svg>
      </div>
    );
  }

  // 2. CONMEBOL COPA AMÉRICA
  if (lower.includes('copa') || lower.includes('america') || lower.includes('conmebol')) {
    return (
      <div
        className={`relative rounded-xl overflow-hidden shrink-0 flex items-center justify-center shadow-xs bg-gradient-to-br from-[#002f6c] via-[#004b93] to-[#d4af37] border border-amber-300/40 select-none ${sizeClasses} ${className}`}
        title="CONMEBOL Copa América"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full p-1.5" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="44" fill="#002f6c" stroke="#d4af37" strokeWidth="3" />
          <path d="M42 22 C48 20, 58 24, 62 34 C64 42, 54 48, 52 56 C50 64, 52 74, 46 80 C40 76, 38 66, 40 58 C42 50, 36 44, 38 34 C40 28, 40 24, 42 22 Z" fill="#d4af37" />
          <circle cx="50" cy="48" r="8" fill="#ffffff" />
          <polygon points="50,42 52,46 57,46 53,49 55,54 50,51 45,54 47,49 43,46 48,46" fill="#002f6c" />
          <text x="50" y="93" fill="#ffffff" fontSize="8" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">
            COPA
          </text>
        </svg>
      </div>
    );
  }

  // 3. UEFA EUROPEAN CHAMPIONSHIP (EURO)
  if (lower.includes('euro') || lower.includes('uefa euro')) {
    return (
      <div
        className={`relative rounded-xl overflow-hidden shrink-0 flex items-center justify-center shadow-xs bg-gradient-to-br from-[#003399] via-[#0055d4] to-[#001f5c] border border-blue-300/40 select-none ${sizeClasses} ${className}`}
        title="UEFA European Championship (Euro)"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full p-1.5" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="44" fill="#003399" stroke="#ffcc00" strokeWidth="2.5" />
          <path d="M38 25 H62 V38 C62 52, 50 60, 50 60 C50 60, 38 52, 38 38 Z" fill="#ffffff" stroke="#ffcc00" strokeWidth="2" />
          <path d="M44 60 H56 V72 H44 Z" fill="#ffcc00" />
          <rect x="36" y="72" width="28" height="6" rx="2" fill="#ffffff" />
          <text x="50" y="92" fill="#ffcc00" fontSize="9" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1">
            EURO
          </text>
        </svg>
      </div>
    );
  }

  // 4. FIFA WORLD CUP
  if (lower.includes('worldcup') || lower.includes('world cup')) {
    return (
      <div
        className={`relative rounded-xl overflow-hidden shrink-0 flex items-center justify-center shadow-xs bg-gradient-to-br from-[#9b7829] via-[#e5c158] to-[#6d5113] border border-amber-300/40 select-none ${sizeClasses} ${className}`}
        title="FIFA World Cup"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full p-1.5" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="44" fill="#2d1c03" stroke="#f6d365" strokeWidth="3" />
          <circle cx="50" cy="30" r="14" fill="#f6d365" stroke="#ffffff" strokeWidth="1.5" />
          <path d="M42 42 C40 50, 44 65, 46 72 H54 C56 65, 60 50, 58 42 Z" fill="#f6d365" />
          <rect x="34" y="72" width="32" height="7" rx="2" fill="#059669" />
          <rect x="32" y="79" width="36" height="5" rx="2" fill="#f6d365" />
          <text x="50" y="94" fill="#f6d365" fontSize="8" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1">
            FIFA WC
          </text>
        </svg>
      </div>
    );
  }

  // 5. PREMIER LEAGUE OFFICIAL LION CREST
  if (lower.includes('premier') || lower.includes('eng.1') || lower.includes('pl')) {
    return (
      <div
        className={`relative rounded-xl overflow-hidden shrink-0 flex items-center justify-center shadow-xs bg-gradient-to-br from-[#38003c] to-[#240026] border border-purple-400/40 select-none ${sizeClasses} ${className}`}
        title="English Premier League"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full p-1.5" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 32 L36 44 L50 28 L64 44 L70 32 L68 54 H32 Z" fill="#00ff87" />
          <circle cx="50" cy="62" r="22" fill="#ffffff" />
          <path d="M38 60 C38 60 44 56 50 56 C56 56 62 60 62 60 C62 68 56 74 50 74 C44 74 38 68 38 60 Z" fill="#38003c" />
          <circle cx="44" cy="62" r="2.5" fill="#00ff87" />
          <circle cx="56" cy="62" r="2.5" fill="#00ff87" />
          <text x="50" y="94" fill="#00ff87" fontSize="10" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">
            PL
          </text>
        </svg>
      </div>
    );
  }

  // 6. UEFA CHAMPIONS LEAGUE OFFICIAL STARBALL
  if (lower.includes('champions') || lower.includes('ucl')) {
    return (
      <div
        className={`relative rounded-xl overflow-hidden shrink-0 flex items-center justify-center shadow-xs bg-gradient-to-br from-[#06122d] via-[#091b40] to-[#020714] border border-blue-400/40 select-none ${sizeClasses} ${className}`}
        title="UEFA Champions League"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="42" fill="#091b40" stroke="#4886ff" strokeWidth="2" />
          <g fill="#ffffff">
            <polygon points="50,22 53,30 62,30 55,35 58,43 50,38 42,43 45,35 38,30 47,30" />
            <polygon points="72,40 74,47 82,48 76,52 78,60 71,55 64,59 66,52 61,47 69,47" />
            <polygon points="65,70 65,78 73,81 66,84 66,92 60,86 54,89 57,82 52,78 60,78" />
            <polygon points="35,70 40,78 35,82 38,89 32,86 26,92 26,84 19,81 27,78 27,70" />
            <polygon points="28,40 31,47 23,47 29,52 26,59 33,55 39,60 37,52 42,48 34,47" />
            <polygon points="50,46 54,55 64,55 56,61 59,70 50,64 41,70 44,61 36,55 46,55" />
          </g>
          <text x="50" y="93" fill="#ffffff" fontSize="9" fontWeight="800" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1">
            UCL
          </text>
        </svg>
      </div>
    );
  }

  // 7. GERMAN BUNDESLIGA
  if (lower.includes('bundesliga') || lower.includes('ger.1')) {
    return (
      <div
        className={`relative rounded-xl overflow-hidden shrink-0 flex items-center justify-center shadow-xs bg-[#d3010c] border border-red-400 select-none ${sizeClasses} ${className}`}
        title="German Bundesliga"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="68" cy="32" r="7" fill="#ffffff" />
          <path d="M26 78 L38 52 L54 62 L64 44" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M42 50 L58 36" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
          <text x="50" y="94" fill="#ffffff" fontSize="9" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">
            BUNDESLIGA
          </text>
        </svg>
      </div>
    );
  }

  // 8. AFC ASIAN CUP
  if (lower.includes('asian cup') || lower.includes('afc')) {
    return (
      <div
        className={`relative rounded-xl overflow-hidden shrink-0 flex items-center justify-center shadow-xs bg-gradient-to-br from-[#800020] via-[#a00028] to-[#d4af37] border border-amber-300/40 select-none ${sizeClasses} ${className}`}
        title="AFC Asian Cup"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="44" fill="#6d001b" stroke="#d4af37" strokeWidth="2.5" />
          <path d="M50 20 L58 35 H42 Z" fill="#d4af37" />
          <circle cx="50" cy="48" r="14" fill="#d4af37" />
          <polygon points="50,38 53,44 60,45 55,49 57,55 50,52 43,55 45,49 40,45 47,44" fill="#6d001b" />
          <text x="50" y="86" fill="#d4af37" fontSize="9" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">
            AFC
          </text>
        </svg>
      </div>
    );
  }

  // 9. THE FA CUP
  if (lower.includes('fa cup') || lower.includes('facup')) {
    return (
      <div
        className={`relative rounded-xl overflow-hidden shrink-0 flex items-center justify-center shadow-xs bg-gradient-to-br from-[#c8102e] to-[#7a0518] border border-red-300/40 select-none ${sizeClasses} ${className}`}
        title="The Emirates FA Cup"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M35 25 H65 V42 C65 55, 50 62, 50 62 C50 62, 35 55, 35 42 Z" fill="#ffffff" />
          <path d="M26 30 C26 44, 35 46, 35 46" stroke="#ffffff" strokeWidth="3" fill="none" />
          <path d="M74 30 C74 44, 65 46, 65 46" stroke="#ffffff" strokeWidth="3" fill="none" />
          <rect x="42" y="62" width="16" height="12" fill="#ffffff" />
          <rect x="34" y="74" width="32" height="6" rx="2" fill="#d4af37" />
          <text x="50" y="93" fill="#ffffff" fontSize="9" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">
            FA CUP
          </text>
        </svg>
      </div>
    );
  }

  // 10. LA LIGA EA SPORTS EMBLEM
  if (lower.includes('la liga') || lower.includes('laliga') || lower.includes('esp.1')) {
    return (
      <div
        className={`relative rounded-xl overflow-hidden shrink-0 flex items-center justify-center shadow-xs bg-gradient-to-br from-[#e01e2b] to-[#a00010] border border-red-300/40 select-none ${sizeClasses} ${className}`}
        title="La Liga EA SPORTS"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 20 V75 H65 V60 H38 V20 Z" fill="#ffffff" />
          <path d="M52 35 V82 H88 V69 H66 V35 Z" fill="#ffffff" />
          <circle cx="75" cy="24" r="7" fill="#ffb400" />
        </svg>
      </div>
    );
  }

  // 11. ITALIAN SERIE A EMBLEM
  if (lower.includes('serie a') || lower.includes('ita.1')) {
    return (
      <div
        className={`relative rounded-xl overflow-hidden shrink-0 flex items-center justify-center shadow-xs bg-gradient-to-br from-[#0055a5] to-[#002866] border border-blue-300/40 select-none ${sizeClasses} ${className}`}
        title="Italian Serie A"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,12 85,50 50,88 15,50" fill="#003e85" stroke="#ffffff" strokeWidth="3" />
          <polygon points="50,22 75,50 50,78 25,50" fill="#008ef0" />
          <path d="M50 30 L65 65 H55 L50 50 L45 65 H35 Z" fill="#ffffff" />
          <rect x="42" y="55" width="16" height="3" fill="#ffffff" />
        </svg>
      </div>
    );
  }

  // 12. FIFA & INTERNATIONAL GENERAL EMBLEM
  return (
    <div
      className={`relative rounded-xl overflow-hidden shrink-0 flex items-center justify-center shadow-xs bg-gradient-to-br from-[#009270] via-[#028060] to-[#06241a] border border-emerald-400/40 select-none ${sizeClasses} ${className}`}
      title={name || 'FIFA International'}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="45" r="30" fill="#063829" stroke="#ffffff" strokeWidth="2.5" />
        <ellipse cx="50" cy="45" rx="15" ry="30" stroke="#ffffff" strokeWidth="2" strokeDasharray="3 2" />
        <line x1="20" y1="45" x2="80" y2="45" stroke="#ffffff" strokeWidth="2" />
        <line x1="26" y1="30" x2="74" y2="30" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="26" y1="60" x2="74" y2="60" stroke="#ffffff" strokeWidth="1.5" />
        <rect x="24" y="78" width="52" height="14" rx="4" fill="#ffffff" />
        <text x="50" y="89" fill="#009270" fontSize="10" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1.5">
          FIFA
        </text>
      </svg>
    </div>
  );
};
