/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Verified Team Identity & Crest Renderer
 * Distinctly separates National Team Flags from Real Club Crests.
 */

import React, { useState } from 'react';
import { Shield, Trophy, Globe } from 'lucide-react';
import { isNationalTeam, getCountryFlag } from '../../utils/flagUtils';

interface ClubCrestProps {
  code?: string;
  name: string;
  country?: string;
  isNational?: boolean;
  primaryColor?: string;
  secondaryColor?: string;
  crestUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ClubCrest: React.FC<ClubCrestProps> = ({
  code,
  name,
  country,
  isNational,
  primaryColor = '#1e293b',
  secondaryColor = '#3b82f6',
  crestUrl,
  size = 'md',
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeMap = {
    xs: 'w-5 h-5 text-[9px]',
    sm: 'w-7 h-7 text-[11px]',
    md: 'w-10 h-10 text-xs',
    lg: 'w-14 h-14 text-sm',
    xl: 'w-20 h-20 text-lg',
  };

  const isNationalEntity = isNationalTeam(name, country, isNational);
  const countryFlag = isNationalEntity ? getCountryFlag(name) || getCountryFlag(country || '') : null;

  // 1. NATIONAL TEAM: Display official country flag
  if (isNationalEntity && countryFlag) {
    if (!imgError) {
      return (
        <div
          className={`relative inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden border border-slate-200/80 shadow-xs bg-slate-50 ${sizeMap[size]} ${className}`}
          title={`${name} National Team`}
        >
          <img
            src={countryFlag.flagUrl}
            alt={`${name} Flag`}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      );
    }

    return (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 rounded-full bg-slate-100 border border-slate-200 shadow-xs select-none ${sizeMap[size]} ${className}`}
        title={`${name} National Team`}
      >
        <span className="text-sm">{countryFlag.emoji}</span>
      </div>
    );
  }

  // 2. CLUB: Real club crest from provider (Never use national flag for clubs)
  if (crestUrl && !imgError) {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden ${sizeMap[size]} ${className}`}>
        <img
          src={crestUrl}
          alt={name}
          onError={() => setImgError(true)}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>
    );
  }

  // 3. Fallback: Neutral clean club crest with initials
  const codeLabel = (code || name.substring(0, 3)).toUpperCase().slice(0, 3);
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full font-bold shadow-xs select-none ${sizeMap[size]} ${className}`}
      style={{
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
        border: `1.5px solid rgba(255, 255, 255, 0.25)`,
        color: '#ffffff',
      }}
      title={name}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/30 via-transparent to-white/20 pointer-events-none" />
      <span className="relative z-10 font-mono tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] font-black">
        {codeLabel}
      </span>
    </div>
  );
};

export const CompetitionBadge: React.FC<{
  code?: string;
  name: string;
  country?: string;
  category?: 'league' | 'cup' | 'international' | string;
  primaryColor?: string;
  emblemUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ code, name, country, category = 'league', primaryColor = '#009270', emblemUrl, size = 'md', className = '' }) => {
  const [imgError, setImgError] = useState(false);

  const sizeMap = {
    sm: 'w-6 h-6 text-[9px]',
    md: 'w-8 h-8 text-[11px]',
    lg: 'w-12 h-12 text-sm',
  };

  if (emblemUrl && !imgError) {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden ${sizeMap[size]} ${className}`}>
        <img
          src={emblemUrl}
          alt={name}
          onError={() => setImgError(true)}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-lg shadow-xs font-bold shrink-0 ${sizeMap[size]} ${className}`}
      style={{
        backgroundColor: primaryColor,
        border: '1px solid rgba(255,255,255,0.2)',
        color: '#ffffff',
      }}
      title={name}
    >
      {category === 'cup' ? (
        <Trophy className="w-3.5 h-3.5 text-amber-300" />
      ) : category === 'international' ? (
        <Globe className="w-3.5 h-3.5 text-sky-300" />
      ) : (
        <Shield className="w-3.5 h-3.5 text-white/90" />
      )}
    </div>
  );
};
