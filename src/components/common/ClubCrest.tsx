/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, Trophy, Globe } from 'lucide-react';

interface ClubCrestProps {
  code?: string;
  name: string;
  primaryColor?: string;
  secondaryColor?: string;
  crestUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ClubCrest: React.FC<ClubCrestProps> = ({
  code,
  name,
  primaryColor = '#1e293b',
  secondaryColor = '#3b82f6',
  crestUrl,
  size = 'md',
  className = '',
}) => {
  const [imgError, setImgError] = React.useState(false);

  const sizeMap = {
    xs: 'w-5 h-5 text-[9px]',
    sm: 'w-7 h-7 text-[11px]',
    md: 'w-10 h-10 text-xs',
    lg: 'w-14 h-14 text-sm',
    xl: 'w-20 h-20 text-lg',
  };

  const codeLabel = (code || name.substring(0, 3)).toUpperCase().slice(0, 3);

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

  // SVG shield shapes with team initials and neutral styling
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
  category?: 'league' | 'cup' | 'international' | string;
  primaryColor?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ code, name, category = 'league', primaryColor = '#3d195b', size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'w-6 h-6 text-[9px]',
    md: 'w-8 h-8 text-[11px]',
    lg: 'w-12 h-12 text-sm',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-lg shadow-sm font-bold shrink-0 ${sizeMap[size]} ${className}`}
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
        <Shield className="w-3.5 h-3.5 text-emerald-300" />
      )}
    </div>
  );
};
