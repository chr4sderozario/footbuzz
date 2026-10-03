/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Official Match Videos & YouTube Integration Section
 * Surfaces verified YouTube highlights, press conferences, and analysis using the official YouTube Data API.
 * Zero random/invented video IDs. Honest premium empty state when unavailable.
 */

import React, { useState, useEffect } from 'react';
import {
  Video,
  Play,
  ExternalLink,
  ShieldCheck,
  Clock,
  Sparkles,
  Radio,
  Eye,
  X,
  Tv,
} from 'lucide-react';
import { YouTubeVideoInfo, Match } from '../../types/football';
import { footballApi } from '../../services/footballApi';

interface MatchVideosSectionProps {
  match: Match;
}

export const MatchVideosSection: React.FC<MatchVideosSectionProps> = ({ match }) => {
  const [videos, setVideos] = useState<YouTubeVideoInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeEmbedVideoId, setActiveEmbedVideoId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    footballApi
      .fetchMatchVideos(match.homeTeam.name, match.awayTeam.name, match.competitionName, match.date)
      .then((data) => {
        if (isMounted) {
          setVideos(data || []);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setVideos([]);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [match.id, match.homeTeam.name, match.awayTeam.name, match.competitionName, match.date]);

  const getVideoTypeBadge = (type?: YouTubeVideoInfo['videoType']) => {
    switch (type) {
      case 'HIGHLIGHTS':
        return { label: 'Official Highlights', color: 'bg-rose-50 text-rose-700 border-rose-200' };
      case 'PRESS_CONFERENCE':
        return { label: 'Press Conference', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'TACTICAL_ANALYSIS':
        return { label: 'Tactical Breakdown', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'GOALS':
        return { label: 'All Goals', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'MATCH_PREVIEW':
        return { label: 'Match Preview', color: 'bg-purple-50 text-purple-700 border-purple-200' };
      default:
        return { label: 'Match Video', color: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <Video className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 font-display flex items-center gap-2">
              <span>Match Videos & Highlights</span>
              <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-mono font-bold uppercase tracking-wider">
                Official YouTube
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Verified match coverage, post-match analysis, and press conferences for {match.homeTeam.name} vs {match.awayTeam.name}.
            </p>
          </div>
        </div>

        {videos.length > 0 && (
          <span className="text-xs font-mono font-bold text-slate-400 self-start sm:self-auto">
            {videos.length} Verified Video{videos.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Embedded Video Player Modal/Inline view */}
      {activeEmbedVideoId && (
        <div className="rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-xl relative animate-in fade-in">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 text-white text-xs border-b border-slate-800">
            <span className="font-bold flex items-center gap-1.5 font-display">
              <Tv className="w-3.5 h-3.5 text-rose-500" />
              <span>Official YouTube Player</span>
            </span>
            <button
              onClick={() => setActiveEmbedVideoId(null)}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="relative pb-[56.25%] h-0">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${activeEmbedVideoId}?autoplay=1&rel=0`}
              title="Official Match Highlights Player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6">
          <div className="p-4 rounded-2xl bg-slate-50 animate-pulse space-y-3">
            <div className="w-full h-36 bg-slate-200 rounded-xl" />
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-3 bg-slate-200 rounded w-1/2" />
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 animate-pulse space-y-3">
            <div className="w-full h-36 bg-slate-200 rounded-xl" />
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-3 bg-slate-200 rounded w-1/2" />
          </div>
        </div>
      )}

      {/* Videos Grid */}
      {!isLoading && videos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((vid) => {
            const badge = getVideoTypeBadge(vid.videoType);
            const isPlaying = activeEmbedVideoId === vid.videoId;

            return (
              <div
                key={vid.videoId}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between group ${
                  isPlaying
                    ? 'border-rose-500 shadow-md ring-2 ring-rose-500/20 bg-rose-50/10'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                {/* Thumbnail Header with Play overlay */}
                <div
                  onClick={() => setActiveEmbedVideoId(vid.videoId)}
                  className="relative aspect-video bg-slate-900 cursor-pointer overflow-hidden group/thumb"
                >
                  <img
                    src={vid.thumbnail}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/25 group-hover/thumb:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-rose-600/90 group-hover/thumb:bg-rose-600 group-hover/thumb:scale-110 text-white flex items-center justify-center shadow-lg transition-all">
                      <Play className="w-5 h-5 ml-0.5 fill-current" />
                    </div>
                  </div>

                  {/* Video Type Badge */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold backdrop-blur-md shadow-xs ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h4
                      onClick={() => setActiveEmbedVideoId(vid.videoId)}
                      className="text-xs sm:text-sm font-extrabold text-slate-900 line-clamp-2 leading-snug cursor-pointer group-hover:text-rose-600 transition-colors"
                      title={vid.title}
                    >
                      {vid.title}
                    </h4>

                    {/* Channel & Verification */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700 truncate max-w-[150px]">
                        {vid.channel}
                      </span>
                      {vid.isOfficial && (
                        <span
                          className="inline-flex items-center text-emerald-600"
                          title="Verified Official Football Channel"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons: Watch on YouTube & Watch in FootBuzz */}
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => setActiveEmbedVideoId(vid.videoId)}
                      className="flex-1 py-1.5 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <Play className="w-3 h-3 fill-current text-rose-500" />
                      <span>{isPlaying ? 'Playing' : 'Watch Here'}</span>
                    </button>

                    <a
                      href={`https://www.youtube.com/watch?v=${vid.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-1.5 px-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 text-xs font-bold transition-colors flex items-center gap-1 shrink-0"
                      title="Open on official YouTube site"
                    >
                      <span>▶ YouTube</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Honest Empty State (Requirements #5 & #34) */}
      {!isLoading && videos.length === 0 && (
        <div className="py-8 px-6 text-center rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2.5">
          <div className="w-12 h-12 rounded-2xl bg-slate-200/80 text-slate-500 mx-auto flex items-center justify-center">
            <Video className="w-6 h-6 opacity-60" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">
            No verified YouTube video found yet.
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Verified match highlights and official post-match videos will appear here once authenticated through the official football channels for this fixture.
          </p>
        </div>
      )}
    </div>
  );
};
