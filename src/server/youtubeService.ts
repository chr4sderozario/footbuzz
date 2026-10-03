/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz YouTube Data API & Verified Match Video Service
 * Retrieves and strictly validates legitimate football video highlights and match content.
 * Zero invented video IDs or generic searches.
 */

import { YouTubeVideoInfo } from '../types/football.js';

// Verified and Official Football Channels directory
const OFFICIAL_CHANNELS: Record<string, { channelId: string; name: string; badge: string }> = {
  premierLeague: { channelId: 'UCG5qGWdu8nIRZqJ_GgDwQ-w', name: 'Premier League', badge: 'Official Competition' },
  uefa: { channelId: 'UCyGa1YEx9ST66r-CwDwnQDw', name: 'UEFA', badge: 'Official Federation' },
  fifa: { channelId: 'UCpcTrCXblq78GZrTUTLWeBw', name: 'FIFA', badge: 'Official Federation' },
  isl: { channelId: 'UCtWv3tFhG8-D_sY5KsmYxYw', name: 'Indian Super League', badge: 'Official League' },
  skySports: { channelId: 'UCNAf1k0yIjyGu3k9BwAg3lg', name: 'Sky Sports Football', badge: 'Official Broadcaster' },
  espnFc: { channelId: 'UCnaUtwYkYk4UeG2bZ98d-rA', name: 'ESPN FC', badge: 'Verified Sports Publisher' },
  manCity: { channelId: 'UCkzCjdRMrW2vXLx8mvPVLdQ', name: 'Man City', badge: 'Official Club' },
  arsenal: { channelId: 'UCpryVRk_VD3e74z744Q0W5g', name: 'Arsenal', badge: 'Official Club' },
  liverpool: { channelId: 'UC9LQwHZoucFT94I2h6JOcjw', name: 'Liverpool FC', badge: 'Official Club' },
  realMadrid: { channelId: 'UCWV3obpZVGgJ3QK5qqYF13g', name: 'Real Madrid', badge: 'Official Club' },
  barcelona: { channelId: 'UC14UlmYlSNiQCBe9Eookf_A', name: 'FC Barcelona', badge: 'Official Club' },
};

// Aliases for normalized team name comparisons
const TEAM_ALIASES: Record<string, string[]> = {
  'manchester city': ['man city', 'mancity', 'city', 'manchester city'],
  'manchester united': ['man utd', 'manunited', 'united', 'manchester united', 'mufc'],
  'arsenal': ['arsenal', 'gunners', 'afc'],
  'liverpool': ['liverpool', 'lfc', 'reds'],
  'chelsea': ['chelsea', 'cfc', 'blues'],
  'tottenham hotspur': ['tottenham', 'spurs'],
  'real madrid': ['real madrid', 'madrid', 'los blancos'],
  'barcelona': ['fc barcelona', 'barcelona', 'barça', 'barca'],
  'bayern munich': ['bayern munich', 'bayern', 'fc bayern', 'münchen'],
  'inter milan': ['inter', 'inter milan', 'internazionale'],
  'juventus': ['juventus', 'juve'],
  'mohun bagan': ['mohun bagan', 'mohun bagan sg', 'mohun bagan super giant', 'bagan', 'mbsg'],
  'east bengal': ['east bengal', 'east bengal fc', 'ebfc'],
  'bengaluru': ['bengaluru', 'bengaluru fc', 'bfc'],
  'mumbai city': ['mumbai city', 'mumbai city fc', 'mcfc'],
  'kerala blasters': ['kerala blasters', 'kerala blasters fc', 'kbfc', 'blasters'],
  'brazil': ['brazil', 'brasil', 'brazil nt', 'brazil national team', 'seleção'],
  'argentina': ['argentina', 'argentina nt', 'albiceleste'],
  'india': ['india', 'india nt', 'blue tigers', 'indian football team'],
  'france': ['france', 'les bleus'],
  'germany': ['germany', 'dfb team'],
  'spain': ['spain', 'la roja'],
  'england': ['england', 'three lions'],
};

/**
 * Normalizes a team name into its base canonical form and aliases.
 */
export function getTeamTokens(name: string): string[] {
  if (!name) return [];
  const lower = name.toLowerCase().trim();
  const tokens = new Set<string>();

  // Add words
  const words = lower
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !['the', 'and', 'club', 'football', 'fc', 'cf', 'sc'].includes(w));
  words.forEach((w) => tokens.add(w));

  // Check aliases dictionary
  for (const [key, aliases] of Object.entries(TEAM_ALIASES)) {
    if (lower.includes(key) || aliases.some((a) => lower.includes(a))) {
      tokens.add(key);
      aliases.forEach((a) => tokens.add(a));
    }
  }

  return Array.from(tokens);
}

/**
 * Validates whether a candidate YouTube video title/description legitimately refers to the match.
 */
export function validateMatchVideo(
  video: { title: string; description?: string; channel: string; publishedAt?: string },
  match: { homeTeamName: string; awayTeamName: string; competitionName?: string; date?: string }
): { isValid: boolean; relevanceScore: number; isOfficial: boolean; videoType: YouTubeVideoInfo['videoType'] } {
  const title = (video.title || '').toLowerCase();
  const desc = (video.description || '').toLowerCase();
  const channel = (video.channel || '').toLowerCase();
  const fullText = `${title} ${desc} ${channel}`;

  const homeTokens = getTeamTokens(match.homeTeamName);
  const awayTokens = getTeamTokens(match.awayTeamName);

  const hasHome = homeTokens.some((t) => fullText.includes(t));
  const hasAway = awayTokens.some((t) => fullText.includes(t));

  // If neither team is mentioned, it's definitely not the match
  if (!hasHome && !hasAway) {
    return { isValid: false, relevanceScore: 0, isOfficial: false, videoType: undefined };
  }

  // Check official channel status
  let isOfficial = false;
  for (const official of Object.values(OFFICIAL_CHANNELS)) {
    if (channel.includes(official.name.toLowerCase())) {
      isOfficial = true;
      break;
    }
  }

  // Determine video type
  let videoType: YouTubeVideoInfo['videoType'] = 'HIGHLIGHTS';
  if (title.includes('press conference') || title.includes('speaks to media') || title.includes('reaction')) {
    videoType = 'PRESS_CONFERENCE';
  } else if (title.includes('tactical') || title.includes('analysis') || title.includes('breakdown')) {
    videoType = 'TACTICAL_ANALYSIS';
  } else if (title.includes('all goals') || title.includes('goal')) {
    videoType = 'GOALS';
  } else if (title.includes('preview') || title.includes('ahead of')) {
    videoType = 'MATCH_PREVIEW';
  } else if (title.includes('highlights') || title.includes('extended')) {
    videoType = 'HIGHLIGHTS';
  } else {
    videoType = 'OFFICIAL_MATCH_CONTENT';
  }

  // Calculate relevance
  let relevanceScore = 0;
  if (hasHome && hasAway) relevanceScore += 50; // Both teams present!
  else if (hasHome || hasAway) relevanceScore += 20;

  if (isOfficial) relevanceScore += 30; // Official channel gets high priority

  if (match.competitionName) {
    const compLower = match.competitionName.toLowerCase();
    const compTokens = compLower.split(/\s+/).filter((w) => w.length > 3);
    if (compTokens.some((ct) => fullText.includes(ct))) {
      relevanceScore += 15;
    }
  }

  // Reject clearly unrelated videos (e.g. video games, FIFA 23 gameplay, pes, efootball)
  if (
    title.includes('fifa 23') ||
    title.includes('fifa 24') ||
    title.includes('ea fc 24') ||
    title.includes('ea fc 25') ||
    title.includes('gameplay') ||
    title.includes('ps5') ||
    title.includes('mod')
  ) {
    return { isValid: false, relevanceScore: 0, isOfficial: false, videoType: undefined };
  }

  // To be valid, must have at least both teams, or one team + official channel + highlights/press
  const isValid = (hasHome && hasAway) || (hasHome && isOfficial) || (hasAway && isOfficial);

  return { isValid, relevanceScore, isOfficial, videoType };
}

/**
 * Searches and validates real YouTube match videos.
 */
export async function searchRealMatchVideos(params: {
  homeTeamName: string;
  awayTeamName: string;
  competitionName: string;
  date?: string;
}): Promise<YouTubeVideoInfo[]> {
  const { homeTeamName, awayTeamName, competitionName, date } = params;

  // Build match-specific dynamic search queries (requirement #3)
  const primaryQuery = `${homeTeamName} vs ${awayTeamName} ${competitionName || ''} highlights`.trim();
  const secondaryQuery = `${homeTeamName} ${awayTeamName} highlights`.trim();

  const candidates: YouTubeVideoInfo[] = [];
  const seenVideoIds = new Set<string>();

  // 1. If YOUTUBE_API_KEY is configured, use official YouTube Data API v3
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (apiKey) {
    try {
      const ytUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${encodeURIComponent(
        primaryQuery
      )}&key=${apiKey}`;

      const res = await fetch(ytUrl);
      if (res.ok) {
        const data: any = await res.json();
        if (Array.isArray(data.items)) {
          for (const item of data.items) {
            const vidId = item.id?.videoId;
            if (!vidId || seenVideoIds.has(vidId)) continue;
            seenVideoIds.add(vidId);

            const snippet = item.snippet || {};
            candidates.push({
              videoId: vidId,
              title: snippet.title || '',
              channel: snippet.channelTitle || '',
              thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || `https://i.ytimg.com/vi/${vidId}/hqdefault.jpg`,
              publishedAt: snippet.publishedAt || new Date().toISOString(),
              description: snippet.description || '',
            });
          }
        }
      }
    } catch (err) {
      console.warn('YouTube Data API query notice:', err);
    }
  }

  // 2. Query official football channels feeds directly for guaranteed verified content
  const channelsToCheck = [
    OFFICIAL_CHANNELS.skySports,
    OFFICIAL_CHANNELS.premierLeague,
    OFFICIAL_CHANNELS.uefa,
    OFFICIAL_CHANNELS.fifa,
    OFFICIAL_CHANNELS.isl,
    OFFICIAL_CHANNELS.manCity,
    OFFICIAL_CHANNELS.arsenal,
    OFFICIAL_CHANNELS.realMadrid,
    OFFICIAL_CHANNELS.barcelona,
    OFFICIAL_CHANNELS.espnFc,
  ];

  const rssPromises = channelsToCheck.slice(0, 6).map(async (ch) => {
    try {
      const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${ch.channelId}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (FootBuzz Football Platform)' },
      });
      if (!res.ok) return [];
      const xml = await res.text();

      const entries = xml.split('<entry>').slice(1);
      const results: YouTubeVideoInfo[] = [];

      for (const entry of entries) {
        const vidMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
        const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
        const pubMatch = entry.match(/<published>([^<]+)<\/published>/);
        const descMatch = entry.match(/<media:description>([^<]+)<\/media:description>/);

        if (vidMatch && titleMatch) {
          const videoId = vidMatch[1];
          if (seenVideoIds.has(videoId)) continue;
          seenVideoIds.add(videoId);

          results.push({
            videoId,
            title: titleMatch[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&'),
            channel: ch.name,
            thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
            publishedAt: pubMatch ? pubMatch[1] : new Date().toISOString(),
            description: descMatch ? descMatch[1].substring(0, 150) : '',
            isOfficial: true,
            channelBadge: ch.badge,
          });
        }
      }
      return results;
    } catch {
      return [];
    }
  });

  const rssResults = await Promise.all(rssPromises);
  rssResults.forEach((list) => candidates.push(...list));

  // 3. Strict Validation & Relevance Ranking
  const validatedVideos: (YouTubeVideoInfo & { relevance: number })[] = [];

  for (const candidate of candidates) {
    const { isValid, relevanceScore, isOfficial, videoType } = validateMatchVideo(candidate, {
      homeTeamName,
      awayTeamName,
      competitionName,
      date,
    });

    if (isValid) {
      validatedVideos.push({
        ...candidate,
        isOfficial: candidate.isOfficial ?? isOfficial,
        channelBadge: candidate.channelBadge || (isOfficial ? 'Verified Football Channel' : undefined),
        videoType: candidate.videoType || videoType,
        relevance: relevanceScore,
      });
    }
  }

  // Sort by relevance (official channels and exact team matches first)
  validatedVideos.sort((a, b) => b.relevance - a.relevance);

  // Return clean verified videos (max 6)
  return validatedVideos.slice(0, 6).map(({ relevance, ...v }) => v);
}
