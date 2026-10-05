/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Official Country Flag & National Identity Utility
 * Ensures national teams receive real national flags, and clubs receive club crests.
 */

// Comprehensive mapping of country names to ISO-2 codes and flag emojis
export const COUNTRY_FLAG_MAP: Record<string, { code: string; emoji: string }> = {
  india: { code: 'in', emoji: '🇮🇳' },
  brazil: { code: 'br', emoji: '🇧🇷' },
  argentina: { code: 'ar', emoji: '🇦🇷' },
  england: { code: 'gb-eng', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  france: { code: 'fr', emoji: '🇫🇷' },
  germany: { code: 'de', emoji: '🇩🇪' },
  spain: { code: 'es', emoji: '🇪🇸' },
  italy: { code: 'it', emoji: '🇮🇹' },
  portugal: { code: 'pt', emoji: '🇵🇹' },
  netherlands: { code: 'nl', emoji: '🇳🇱' },
  belgium: { code: 'be', emoji: '🇧🇪' },
  croatia: { code: 'hr', emoji: '🇭🇷' },
  morocco: { code: 'ma', emoji: '🇲🇦' },
  japan: { code: 'jp', emoji: '🇯🇵' },
  'south korea': { code: 'kr', emoji: '🇰🇷' },
  korea: { code: 'kr', emoji: '🇰🇷' },
  australia: { code: 'au', emoji: '🇦🇺' },
  'united states': { code: 'us', emoji: '🇺🇸' },
  usa: { code: 'us', emoji: '🇺🇸' },
  mexico: { code: 'mx', emoji: '🇲🇽' },
  uruguay: { code: 'uy', emoji: '🇺🇾' },
  colombia: { code: 'co', emoji: '🇨🇴' },
  chile: { code: 'cl', emoji: '🇨🇱' },
  senegal: { code: 'sn', emoji: '🇸🇳' },
  egypt: { code: 'eg', emoji: '🇪🇬' },
  nigeria: { code: 'ng', emoji: '🇳🇬' },
  cameroon: { code: 'cm', emoji: '🇨🇲' },
  ghana: { code: 'gh', emoji: '🇬🇭' },
  'saudi arabia': { code: 'sa', emoji: '🇸🇦' },
  qatar: { code: 'qa', emoji: '🇶🇦' },
  china: { code: 'cn', emoji: '🇨🇳' },
  norway: { code: 'no', emoji: '🇳🇴' },
  sweden: { code: 'se', emoji: '🇸🇪' },
  denmark: { code: 'dk', emoji: '🇩🇰' },
  poland: { code: 'pl', emoji: '🇵🇱' },
  switzerland: { code: 'ch', emoji: '🇨🇭' },
  austria: { code: 'at', emoji: '🇦🇹' },
  scotland: { code: 'gb-sct', emoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  wales: { code: 'gb-wls', emoji: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
  'northern ireland': { code: 'gb-nir', emoji: '🇬🇧' },
  ireland: { code: 'ie', emoji: '🇮🇪' },
  'republic of ireland': { code: 'ie', emoji: '🇮🇪' },
  turkey: { code: 'tr', emoji: '🇹🇷' },
  ukraine: { code: 'ua', emoji: '🇺🇦' },
  peru: { code: 'pe', emoji: '🇵🇪' },
  venezuela: { code: 've', emoji: '🇻🇪' },
  paraguay: { code: 'py', emoji: '🇵🇾' },
  ecuador: { code: 'ec', emoji: '🇪🇨' },
  bolivia: { code: 'bo', emoji: '🇧🇴' },
  finland: { code: 'fi', emoji: '🇫🇮' },
  albania: { code: 'al', emoji: '🇦🇱' },
  greece: { code: 'gr', emoji: '🇬🇷' },
  azerbaijan: { code: 'az', emoji: '🇦🇿' },
  lithuania: { code: 'lt', emoji: '🇱🇹' },
  algeria: { code: 'dz', emoji: '🇩🇿' },
  tunisia: { code: 'tn', emoji: '🇹🇳' },
  'ivory coast': { code: 'ci', emoji: '🇨🇮' },
  "côte d'ivoire": { code: 'ci', emoji: '🇨🇮' },
  'south africa': { code: 'za', emoji: '🇿🇦' },
  serbia: { code: 'rs', emoji: '🇷🇸' },
  'czech republic': { code: 'cz', emoji: '🇨🇿' },
  czechia: { code: 'cz', emoji: '🇨🇿' },
  slovakia: { code: 'sk', emoji: '🇸🇰' },
  slovenia: { code: 'si', emoji: '🇸🇮' },
  hungary: { code: 'hu', emoji: '🇭🇺' },
  romania: { code: 'ro', emoji: '🇷🇴' },
  bulgaria: { code: 'bg', emoji: '🇧🇬' },
  iceland: { code: 'is', emoji: '🇮🇸' },
  'costa rica': { code: 'cr', emoji: '🇨🇷' },
  honduras: { code: 'hn', emoji: '🇭🇳' },
  panama: { code: 'pa', emoji: '🇵🇦' },
  jamaica: { code: 'jm', emoji: '🇯🇲' },
  canada: { code: 'ca', emoji: '🇨🇦' },
  iran: { code: 'ir', emoji: '🇮🇷' },
  iraq: { code: 'iq', emoji: '🇮🇶' },
  uae: { code: 'ae', emoji: '🇦🇪' },
  'united arab emirates': { code: 'ae', emoji: '🇦🇪' },
  uzbekistan: { code: 'uz', emoji: '🇺🇿' },
  vietnam: { code: 'vn', emoji: '🇻🇳' },
  thailand: { code: 'th', emoji: '🇹🇭' },
  indonesia: { code: 'id', emoji: '🇮🇩' },
  malaysia: { code: 'my', emoji: '🇲🇾' },
  singapore: { code: 'sg', emoji: '🇸🇬' },
  'new zealand': { code: 'nz', emoji: '🇳🇿' },
  mali: { code: 'ml', emoji: '🇲🇱' },
  'burkina faso': { code: 'bf', emoji: '🇧🇫' },
  drc: { code: 'cd', emoji: '🇨🇩' },
  'dr congo': { code: 'cd', emoji: '🇨🇩' },
  guinea: { code: 'gn', emoji: '🇬🇳' },
  zambia: { code: 'zm', emoji: '🇿🇲' },
  angola: { code: 'ao', emoji: '🇦🇴' },
  jordan: { code: 'jo', emoji: '🇯🇴' },
  oman: { code: 'om', emoji: '🇴🇲' },
  bahrain: { code: 'bh', emoji: '🇧🇭' },
  kuwait: { code: 'kw', emoji: '🇰🇼' },
  lebanon: { code: 'lb', emoji: '🇱🇧' },
  syria: { code: 'sy', emoji: '🇸🇾' },
  palestine: { code: 'ps', emoji: '🇵🇸' },
  israel: { code: 'il', emoji: '🇮🇱' },
  georgia: { code: 'ge', emoji: '🇬🇪' },
  armenia: { code: 'am', emoji: '🇦🇲' },
  kazakhstan: { code: 'kz', emoji: '🇰🇿' },
  bosnia: { code: 'ba', emoji: '🇧🇦' },
  'bosnia and herzegovina': { code: 'ba', emoji: '🇧🇦' },
  montenegro: { code: 'me', emoji: '🇲🇪' },
  'north macedonia': { code: 'mk', emoji: '🇲🇰' },
  estonia: { code: 'ee', emoji: '🇪🇪' },
  latvia: { code: 'lv', emoji: '🇱🇻' },
  cyprus: { code: 'cy', emoji: '🇨🇾' },
  luxembourg: { code: 'lu', emoji: '🇱🇺' },
  malta: { code: 'mt', emoji: '🇲🇹' },
  moldova: { code: 'md', emoji: '🇲🇩' },
  belarus: { code: 'by', emoji: '🇧🇾' },
  kosovo: { code: 'xk', emoji: '🇽🇰' },
  haiti: { code: 'ht', emoji: '🇭🇹' },
  'trinidad and tobago': { code: 'tt', emoji: '🇹🇹' },
  guatemala: { code: 'gt', emoji: '🇬🇹' },
  'el salvador': { code: 'sv', emoji: '🇸🇻' },
};

// Club indicator keywords to avoid confusing clubs with national teams
const CLUB_KEYWORDS = [
  'fc',
  'sc',
  'cf',
  'ac',
  'united',
  'city',
  'rovers',
  'town',
  'wanderers',
  'athletic',
  'atlético',
  'real',
  'inter',
  'sporting',
  'borussia',
  'dynamo',
  'dinamo',
  'cska',
  'lokomotiv',
  'spartak',
  'racing',
  'bengal',
  'bagan',
  'blasters',
  'bengaluru',
  'mumbai',
  'goa',
  'kashi',
  'chennaiyin',
  'jamshedpur',
  'odisha',
  'punjab',
  'hyderabad',
  'mohammedan',
  'churchill',
];

/**
 * Checks whether an entity is a national team.
 */
export function isNationalTeam(teamName: string, country?: string, isNational?: boolean): boolean {
  if (typeof isNational === 'boolean') {
    return isNational;
  }

  const nameLower = (teamName || '').toLowerCase().trim();

  // If name contains any club indicator, it is definitely a club
  const hasClubKeyword = CLUB_KEYWORDS.some((kw) => {
    const regex = new RegExp(`\\b${kw}\\b`, 'i');
    return regex.test(nameLower);
  });

  if (hasClubKeyword) {
    return false;
  }

  // If the clean name exactly matches a country in the country map
  if (COUNTRY_FLAG_MAP[nameLower]) {
    return true;
  }

  // Common patterns like "India Men", "Brazil National Team"
  for (const countryKey of Object.keys(COUNTRY_FLAG_MAP)) {
    if (nameLower === countryKey || nameLower === `${countryKey} national team` || nameLower === `${countryKey} men` || nameLower === `${countryKey} women`) {
      return true;
    }
  }

  return false;
}

/**
 * Retrieves the official flag details for a country or national team.
 */
export function getCountryFlag(countryOrTeamName: string): { code: string; emoji: string; flagUrl: string } | null {
  const norm = (countryOrTeamName || '')
    .toLowerCase()
    .replace(/\b(national team|men|women|u23|u20|u17)\b/g, '')
    .trim();

  const found = COUNTRY_FLAG_MAP[norm];
  if (found) {
    return {
      code: found.code,
      emoji: found.emoji,
      flagUrl: `https://flagcdn.com/w80/${found.code}.png`,
    };
  }

  return null;
}
