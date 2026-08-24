import { MONTH_MAP, MONTH_NAMES, isValidDate, getDaysInMonth, getOrdinal, padZero } from './dateUtils.js';

// Comprehensive country names & aliases mapped to ISO 3166-1 alpha-2 codes
const COUNTRY_MAP = {
  // North America
  us: { code: 'US', name: 'United States' },
  usa: { code: 'US', name: 'United States' },
  'united states': { code: 'US', name: 'United States' },
  america: { code: 'US', name: 'United States' },
  ca: { code: 'CA', name: 'Canada' },
  canada: { code: 'CA', name: 'Canada' },
  mx: { code: 'MX', name: 'Mexico' },
  mexico: { code: 'MX', name: 'Mexico' },

  // Europe
  uk: { code: 'GB', name: 'United Kingdom' },
  gb: { code: 'GB', name: 'United Kingdom' },
  'united kingdom': { code: 'GB', name: 'United Kingdom' },
  'great britain': { code: 'GB', name: 'United Kingdom' },
  england: { code: 'GB', name: 'United Kingdom' },
  scotland: { code: 'GB', name: 'United Kingdom' },
  wales: { code: 'GB', name: 'United Kingdom' },
  de: { code: 'DE', name: 'Germany' },
  germany: { code: 'DE', name: 'Germany' },
  deutschland: { code: 'DE', name: 'Germany' },
  fr: { code: 'FR', name: 'France' },
  france: { code: 'FR', name: 'France' },
  it: { code: 'IT', name: 'Italy' },
  italy: { code: 'IT', name: 'Italy' },
  es: { code: 'ES', name: 'Spain' },
  spain: { code: 'ES', name: 'Spain' },
  nl: { code: 'NL', name: 'Netherlands' },
  netherlands: { code: 'NL', name: 'Netherlands' },
  holland: { code: 'NL', name: 'Netherlands' },
  ch: { code: 'CH', name: 'Switzerland' },
  switzerland: { code: 'CH', name: 'Switzerland' },
  at: { code: 'AT', name: 'Austria' },
  austria: { code: 'AT', name: 'Austria' },
  be: { code: 'BE', name: 'Belgium' },
  belgium: { code: 'BE', name: 'Belgium' },
  ie: { code: 'IE', name: 'Ireland' },
  ireland: { code: 'IE', name: 'Ireland' },
  pt: { code: 'PT', name: 'Portugal' },
  portugal: { code: 'PT', name: 'Portugal' },
  se: { code: 'SE', name: 'Sweden' },
  sweden: { code: 'SE', name: 'Sweden' },
  no: { code: 'NO', name: 'Norway' },
  norway: { code: 'NO', name: 'Norway' },
  dk: { code: 'DK', name: 'Denmark' },
  denmark: { code: 'DK', name: 'Denmark' },
  fi: { code: 'FI', name: 'Finland' },
  finland: { code: 'FI', name: 'Finland' },
  pl: { code: 'PL', name: 'Poland' },
  poland: { code: 'PL', name: 'Poland' },
  gr: { code: 'GR', name: 'Greece' },
  greece: { code: 'GR', name: 'Greece' },
  tr: { code: 'TR', name: 'Turkey' },
  turkey: { code: 'TR', name: 'Turkey' },

  // Asia & Pacific
  jp: { code: 'JP', name: 'Japan' },
  japan: { code: 'JP', name: 'Japan' },
  in: { code: 'IN', name: 'India' },
  india: { code: 'IN', name: 'India' },
  bharat: { code: 'IN', name: 'India' },
  sg: { code: 'SG', name: 'Singapore' },
  singapore: { code: 'SG', name: 'Singapore' },
  au: { code: 'AU', name: 'Australia' },
  australia: { code: 'AU', name: 'Australia' },
  nz: { code: 'NZ', name: 'New Zealand' },
  'new zealand': { code: 'NZ', name: 'New Zealand' },
  cn: { code: 'CN', name: 'China' },
  china: { code: 'CN', name: 'China' },
  kr: { code: 'KR', name: 'South Korea' },
  'south korea': { code: 'KR', name: 'South Korea' },
  korea: { code: 'KR', name: 'South Korea' },
  th: { code: 'TH', name: 'Thailand' },
  thailand: { code: 'TH', name: 'Thailand' },
  my: { code: 'MY', name: 'Malaysia' },
  malaysia: { code: 'MY', name: 'Malaysia' },
  id: { code: 'ID', name: 'Indonesia' },
  indonesia: { code: 'ID', name: 'Indonesia' },
  ph: { code: 'PH', name: 'Philippines' },
  philippines: { code: 'PH', name: 'Philippines' },

  // South America & Africa
  br: { code: 'BR', name: 'Brazil' },
  brazil: { code: 'BR', name: 'Brazil' },
  ar: { code: 'AR', name: 'Argentina' },
  argentina: { code: 'AR', name: 'Argentina' },
  cl: { code: 'CL', name: 'Chile' },
  chile: { code: 'CL', name: 'Chile' },
  co: { code: 'CO', name: 'Colombia' },
  colombia: { code: 'CO', name: 'Colombia' },
  za: { code: 'ZA', name: 'South Africa' },
  'south africa': { code: 'ZA', name: 'South Africa' },
  eg: { code: 'EG', name: 'Egypt' },
  egypt: { code: 'EG', name: 'Egypt' }
};

const HOLIDAY_KEYWORDS = [
  'holiday', 'holidays', 'public holiday', 'public holidays',
  'bank holiday', 'bank holidays', 'national holiday', 'national holidays',
  'chhuti', 'chhutti', 'chutti', 'chuti', 'vacation', 'vacations', 'festival', 'festivals',
  'day off', 'days off'
];

/**
 * Checks if the search payload or query text contains recognized holiday intent.
 */
export function hasHolidayIntent(queryText = '', searchData = {}) {
  const lower = queryText.toLowerCase().trim();
  if (!lower) return false;

  // 1. Check keyword triggers passed by platform
  if (Array.isArray(searchData?.keyword) && searchData.keyword.length > 0) {
    return true;
  }

  // 2. Check component name or template in searchData
  if (searchData?.component === '@hyperdart/holidaycalendar' || searchData?.component === 'tech-jiit') {
    if (searchData?.entities && searchData.entities.length > 0) {
      return true;
    }
  }

  // 3. Match holiday keywords and terms
  return HOLIDAY_KEYWORDS.some((kw) => new RegExp(`\\b${kw}\\b`, 'i').test(lower));
}

/**
 * Extracts the country code and country name from searchData entities or query text.
 */
export function extractCountry(searchData, queryText = '') {
  const lowerQuery = queryText.toLowerCase();

  const matchesWholeWord = (str) => {
    if (!str) return false;
    const escaped = str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`\\b${escaped}\\b`, 'i').test(lowerQuery);
  };

  // 1. Direct phrase match in query for prepositions like "in Japan", "in UK", "in Canada"
  for (const [key, val] of Object.entries(COUNTRY_MAP)) {
    const prepRegex = new RegExp(`\\b(?:in|of|for)\\s+${key}\\b`, 'i');
    if (prepRegex.test(lowerQuery)) {
      return { code: val.code, name: val.name, foundExplicit: true };
    }
  }

  // 2. Check entities passed by HyperDart Named Entity Recognition (NER)
  if (Array.isArray(searchData?.entities)) {
    const validEntities = searchData.entities.filter((e) => {
      if (e.collectionType !== 'HD_LOCATION' && e.entityType !== 'LOCATION' && e.wgName !== 'COUNTRIES' && e.wgName !== 'CITIES') {
        return false;
      }
      const word = (e.word || '').toLowerCase();
      // Ignore ordinal suffixes (e.g. "th" from "25th")
      if (['th', 'st', 'nd', 'rd'].includes(word) && /\b\d+(?:st|nd|rd|th)\b/i.test(lowerQuery)) {
        return false;
      }
      return true;
    });

    if (validEntities.length > 0) {
      const sorted = [...validEntities].sort((a, b) => {
        const aWord = a.word || a.entityInfo?.geo?.country || '';
        const bWord = b.word || b.entityInfo?.geo?.country || '';

        const aWhole = matchesWholeWord(aWord);
        const bWhole = matchesWholeWord(bWord);
        if (aWhole && !bWhole) return -1;
        if (!aWhole && bWhole) return 1;

        return (b.relevanceScore || 0) - (a.relevanceScore || 0);
      });

      const locEntity = sorted[0];
      const code = locEntity.entityInfo?.geo?.countryCode || locEntity.entityInfo?.countryCode;
      const name = locEntity.entityInfo?.geo?.country || locEntity.entityInfo?.hdLabel || locEntity.word;
      if (code) {
        return {
          code: code.toUpperCase(),
          name: name || code.toUpperCase(),
          foundExplicit: true
        };
      }
    }
  }

  // 3. Match any standalone country name/alias in raw query string
  for (const [key, val] of Object.entries(COUNTRY_MAP)) {
    if (key === 'th' && /\b\d+th\b/i.test(lowerQuery)) {
      continue;
    }
    const regex = new RegExp(`\\b${key}\\b`, 'i');
    if (regex.test(lowerQuery)) {
      return { code: val.code, name: val.name, foundExplicit: true };
    }
  }

  // 4. Check userLocation fallback
  if (searchData?.userLocation?.countryCode) {
    return {
      code: searchData.userLocation.countryCode.toUpperCase(),
      name: searchData.userLocation.country || searchData.userLocation.countryCode,
      foundExplicit: false
    };
  }

  // Default fallback if no country found
  return { code: 'US', name: 'United States', foundExplicit: false };
}

/**
 * Parses anchor time from searchData (or current time if missing).
 */
export function getAnchorDate(searchData) {
  if (searchData?.time) {
    const parsed = new Date(searchData.time);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return new Date();
}

/**
 * Extracts year from query, supporting absolute years (2026) and relative phrases ("next year").
 */
export function extractYear(queryText, anchorDate) {
  const lower = queryText.toLowerCase();
  const anchorYear = anchorDate.getFullYear();

  // Relative year phrases
  if (/\bnext\s+year\b/.test(lower)) {
    return anchorYear + 1;
  }
  if (/\b(?:last|previous)\s+year\b/.test(lower)) {
    return anchorYear - 1;
  }
  if (/\b(?:this|current)\s+year\b/.test(lower)) {
    return anchorYear;
  }

  // Explicit 4-digit year (e.g. 1970 - 2099)
  const match = lower.match(/\b(19\d\d|20\d\d)\b/);
  if (match) {
    return parseInt(match[1], 10);
  }

  // Default to anchor year
  return anchorYear;
}

/**
 * Extracts month, day, conversational dates ("today", "tomorrow"), and standalone days ("31st").
 */
export function extractMonthAndDay(queryText, anchorDate) {
  const lower = queryText.toLowerCase();
  let month = null; // 1-12 or null
  let day = null;   // 1-31 or null
  let yearAdjustment = 0;
  let isConversationalDate = false;

  // 1. Check conversational date terms: "today", "tomorrow", "yesterday"
  if (/\btoday\b/.test(lower)) {
    month = anchorDate.getMonth() + 1;
    day = anchorDate.getDate();
    isConversationalDate = true;
    return { month, day, yearAdjustment: 0, isConversationalDate };
  }
  if (/\btomorrow\b/.test(lower)) {
    const tmrw = new Date(anchorDate.getTime() + 24 * 60 * 60 * 1000);
    month = tmrw.getMonth() + 1;
    day = tmrw.getDate();
    yearAdjustment = tmrw.getFullYear() - anchorDate.getFullYear();
    isConversationalDate = true;
    return { month, day, yearAdjustment, isConversationalDate };
  }
  if (/\byesterday\b/.test(lower)) {
    const yday = new Date(anchorDate.getTime() - 24 * 60 * 60 * 1000);
    month = yday.getMonth() + 1;
    day = yday.getDate();
    yearAdjustment = yday.getFullYear() - anchorDate.getFullYear();
    isConversationalDate = true;
    return { month, day, yearAdjustment, isConversationalDate };
  }

  const anchorMonth = anchorDate.getMonth() + 1; // 1-indexed

  // 2. Check relative month phrases: "next month", "this month", "last month"
  if (/\bnext\s+month\b/.test(lower)) {
    if (anchorMonth === 12) {
      month = 1;
      yearAdjustment = 1;
    } else {
      month = anchorMonth + 1;
    }
  } else if (/\b(?:this|current)\s+month\b/.test(lower)) {
    month = anchorMonth;
  } else if (/\b(?:last|previous)\s+month\b/.test(lower)) {
    if (anchorMonth === 1) {
      month = 12;
      yearAdjustment = -1;
    } else {
      month = anchorMonth - 1;
    }
  }

  // 3. Check "Day of Month" pattern: e.g. "25th dec", "30th Feb", "4th of July"
  const dayFirstPattern = /\b(\d{1,2})(?:st|nd|rd|th)?\s+(?:of\s+)?(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\b/i;
  const dayFirstMatch = lower.match(dayFirstPattern);
  if (dayFirstMatch) {
    const d = parseInt(dayFirstMatch[1], 10);
    const mStr = dayFirstMatch[2].toLowerCase();
    if (MONTH_MAP[mStr]) {
      day = d;
      month = MONTH_MAP[mStr];
    }
  }

  // 4. Check "Month Day" pattern: e.g. "December 25", "Feb 30th", "July 4th"
  if (!day) {
    const monthFirstPattern = /\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+(\d{1,2})(?:st|nd|rd|th)?\b/i;
    const monthFirstMatch = lower.match(monthFirstPattern);
    if (monthFirstMatch) {
      const mStr = monthFirstMatch[1].toLowerCase();
      const d = parseInt(monthFirstMatch[2], 10);
      if (MONTH_MAP[mStr]) {
        month = MONTH_MAP[mStr];
        day = d;
      }
    }
  }

  // 5. Standalone month names: e.g. "Holidays in Japan July 2026"
  if (!month) {
    const standaloneMonthPattern = /\b(january|jan|february|feb|march|mar|april|apr|may|june|jun|july|jul|august|aug|september|sep|sept|october|oct|november|nov|december|dec)\b/i;
    const monthMatch = lower.match(standaloneMonthPattern);
    if (monthMatch) {
      const mStr = monthMatch[1].toLowerCase();
      if (MONTH_MAP[mStr]) {
        month = MONTH_MAP[mStr];
      }
    }
  }

  // 6. Standalone Day pattern without month (e.g. "holiday on 31st", "holidays on 25th", "is 15th a holiday")
  if (!day && !month) {
    const standaloneDayPattern = /\b(?:on\s+|the\s+)?(\d{1,2})(?:st|nd|rd|th)\b/i;
    const standaloneDayMatch = lower.match(standaloneDayPattern);
    if (standaloneDayMatch) {
      const d = parseInt(standaloneDayMatch[1], 10);
      day = d;
    }
  }

  return { month, day, yearAdjustment, isConversationalDate };
}

/**
 * Main parser function: takes searchData payload and returns structured parameters for API call and UI rendering.
 */
export function parseHolidayQuery(searchData) {
  // Normalize searchData if array
  const rawData = Array.isArray(searchData) ? searchData[0] : searchData || {};
  const queryText = (rawData.query || rawData.queryTerm || '').trim();
  const anchorDate = getAnchorDate(rawData);

  // Check if query has valid holiday intent
  const hasIntent = hasHolidayIntent(queryText, rawData);
  const isEmptyData = !queryText && (!rawData.entities || rawData.entities.length === 0);

  if (isEmptyData || (!hasIntent && !rawData.entities?.length)) {
    return {
      isValidQuery: false,
      isUnrecognizedQuery: true,
      rawQuery: queryText,
      countryCode: null,
      countryName: null,
      year: null,
      month: null,
      monthName: null,
      day: null,
      isDayOnly: false,
      isInvalidDate: false,
      invalidDateDetails: null,
      isDateCheck: false,
      targetDateStr: null,
      unrecognizedMessage: queryText
        ? `No public holiday data found for "${queryText}". Please search with a valid country or date (e.g., "Public holidays in Japan 2026" or "Is July 4 a holiday in USA?").`
        : 'Please enter a holiday query to search public holidays.'
    };
  }

  // 1. Resolve Country
  const country = extractCountry(rawData, queryText);

  // 2. Resolve Year
  let year = extractYear(queryText, anchorDate);

  // 3. Resolve Month and Day
  const { month, day, yearAdjustment, isConversationalDate } = extractMonthAndDay(queryText, anchorDate);
  if (yearAdjustment !== 0 && !/\b(19\d\d|20\d\d)\b/.test(queryText)) {
    year += yearAdjustment;
  }

  // 4. Handle Standalone Day Query (e.g. "holiday on 31st")
  const isDayOnly = day !== null && month === null;
  let isInvalidDate = false;
  let invalidDateDetails = null;

  if (isDayOnly) {
    if (day < 1 || day > 31) {
      isInvalidDate = true;
      invalidDateDetails = {
        day,
        ordinalDay: getOrdinal(day),
        monthName: 'Any Month',
        maxDays: 31,
        year
      };
    }
  } else if (month && day !== null) {
    const valid = isValidDate(year, month, day);
    if (!valid) {
      isInvalidDate = true;
      const monthName = MONTH_NAMES[month - 1];
      const maxDays = getDaysInMonth(year, month);
      invalidDateDetails = {
        day,
        month,
        year,
        monthName,
        maxDays,
        ordinalDay: getOrdinal(day)
      };
    }
  }

  // 5. Determine Query Intent
  const lowerQuery = queryText.toLowerCase();
  const isDateQuestion = /\bis\b.*\bholiday\b/i.test(lowerQuery) || (day !== null && month !== null) || isConversationalDate;

  return {
    isValidQuery: true,
    isUnrecognizedQuery: false,
    rawQuery: queryText,
    countryCode: country.code,
    countryName: country.name,
    year,
    month, // 1-12 or null
    monthName: month ? MONTH_NAMES[month - 1] : null,
    day,   // 1-31 or null
    dayOrdinal: day ? getOrdinal(day) : null,
    isDayOnly,
    isInvalidDate,
    invalidDateDetails,
    isDateCheck: !isInvalidDate && isDateQuestion,
    targetDateStr: (!isInvalidDate && month && day) 
      ? `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}` 
      : null
  };
}
