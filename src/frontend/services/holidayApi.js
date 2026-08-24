/**
 * Service to interact with the Nager.Date API (v4).
 * Base API: https://date.nager.at/api/v4
 */

const BASE_URL = 'https://date.nager.at/api/v4';

// Simple in-memory cache to prevent redundant network requests during re-renders
const holidayCache = new Map();

/**
 * Fetch public holidays for a given country code and calendar year.
 * Endpoint: GET https://date.nager.at/api/v4/Holidays/{CountryCode}/{Year}
 *
 * @param {string} countryCode - ISO 3166-1 alpha-2 country code (e.g. "US", "GB", "JP")
 * @param {number|string} year - Calendar year (e.g. 2026)
 * @param {AbortSignal} [signal] - Optional AbortSignal for cleanup
 * @returns {Promise<Array>} Array of holiday objects
 */
export async function fetchHolidays(countryCode, year, signal) {
  if (!countryCode || !year) {
    return [];
  }

  const normalizedCode = countryCode.toUpperCase();
  const cacheKey = `${normalizedCode}_${year}`;
  if (holidayCache.has(cacheKey)) {
    return holidayCache.get(cacheKey);
  }

  const url = `${BASE_URL}/Holidays/${encodeURIComponent(normalizedCode)}/${encodeURIComponent(year)}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal,
    });

    // Handle 204 No Content or 404 Not Found (e.g. unsupported country or no data for this year)
    if (response.status === 204 || response.status === 404) {
      holidayCache.set(cacheKey, []);
      return [];
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch holidays (HTTP ${response.status}: ${response.statusText})`);
    }

    // Safely parse JSON to avoid 'Unexpected end of JSON input' on empty response bodies
    const text = await response.text();
    if (!text || text.trim() === '') {
      holidayCache.set(cacheKey, []);
      return [];
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.warn(`[holidayApi] Non-JSON or empty response for ${countryCode}/${year}`);
      holidayCache.set(cacheKey, []);
      return [];
    }

    if (!Array.isArray(data)) {
      holidayCache.set(cacheKey, []);
      return [];
    }

    // Normalize response objects to ensure consistent field names across API versions
    const normalizedData = data.map((item) => ({
      date: item.date, // "YYYY-MM-DD"
      name: item.name || item.localName,
      localName: item.localName || item.name,
      countryCode: item.countryCode,
      nationalHoliday: item.global ?? item.nationalHoliday ?? true,
      subdivisionCodes: item.counties || item.subdivisionCodes || null,
      holidayTypes: item.types || item.holidayTypes || ['Public'],
    }));

    holidayCache.set(cacheKey, normalizedData);
    return normalizedData;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error;
    }
    console.error(`[holidayApi] Error fetching holidays for ${countryCode}/${year}:`, error);
    throw error;
  }
}
