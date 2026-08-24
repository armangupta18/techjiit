import React, { useEffect, useState, useMemo } from 'react';
import { Box, Paper, Typography, Stack, Skeleton } from '@mui/material';
import { parseHolidayQuery } from './utils/queryParser';
import { fetchHolidays } from './services/holidayApi';
import { padZero } from './utils/dateUtils';
import Header from './components/Header';
import HolidayCheckCard from './components/HolidayCheckCard';
import InvalidDateCard from './components/InvalidDateCard';
import HolidayList from './components/HolidayList';
import EmptyState from './components/EmptyState';

function NewComponent(props) {
  // 1. Parse the incoming searchData prop
  const parsedQuery = useMemo(() => {
    return parseHolidayQuery(props?.searchData);
  }, [props?.searchData]);

  // 2. Component State Management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [holidays, setHolidays] = useState([]);
  const [retryCount, setRetryCount] = useState(0);

  // 3. Fetch data from Nager.Date API whenever parsedQuery changes or on retry
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    // If query is unrecognized or has an invalid date, skip fetching
    if (parsedQuery.isUnrecognizedQuery || parsedQuery.isInvalidDate || !parsedQuery.countryCode) {
      setLoading(false);
      setError(null);
      return;
    }

    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchHolidays(parsedQuery.countryCode, parsedQuery.year, controller.signal);
        if (isMounted) {
          setHolidays(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted && err.name !== 'AbortError') {
          setError(err.message || 'Failed to fetch holiday data');
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [parsedQuery.countryCode, parsedQuery.year, parsedQuery.isInvalidDate, parsedQuery.isUnrecognizedQuery, retryCount]);

  // 4. Notify HyperDart WebSearch platform when component has fully loaded its content
  useEffect(() => {
    if (!loading) {
      props?.messageHandlers?.componentLoaded?.();
    }
  }, [loading, props?.messageHandlers]);

  // 5. Filter holidays based on query parameters (Month, Exact Date, or Day-Only)
  const { filteredHolidays, matchedHoliday } = useMemo(() => {
    if (parsedQuery.isUnrecognizedQuery || parsedQuery.isInvalidDate || !holidays || holidays.length === 0) {
      return { filteredHolidays: [], matchedHoliday: null };
    }

    // Check for exact date match with specific month & day (e.g. "Is July 4 a holiday in USA 2026")
    if (parsedQuery.targetDateStr) {
      const match = holidays.find((h) => h.date === parsedQuery.targetDateStr);
      return {
        filteredHolidays: match ? [match] : [],
        matchedHoliday: match || null,
      };
    }

    // Check for standalone day-only query (e.g. "holiday on 31st") across all months of the year
    if (parsedQuery.isDayOnly && parsedQuery.day) {
      const daySuffix = `-${padZero(parsedQuery.day)}`;
      const dayMatches = holidays.filter((h) => h.date.endsWith(daySuffix));
      return {
        filteredHolidays: dayMatches,
        matchedHoliday: null,
      };
    }

    // Filter by specific month (e.g. "Holidays in Japan July 2026")
    if (parsedQuery.month) {
      const monthPrefix = `${parsedQuery.year}-${String(parsedQuery.month).padStart(2, '0')}`;
      const filtered = holidays.filter((h) => h.date.startsWith(monthPrefix));
      return {
        filteredHolidays: filtered,
        matchedHoliday: null,
      };
    }

    // Full year list
    return {
      filteredHolidays: holidays,
      matchedHoliday: null,
    };
  }, [holidays, parsedQuery]);

  return (
    <Paper
      elevation={2}
      sx={{
        width: '100%',
        maxWidth: 720,
        margin: '0 auto',
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      }}
    >
      {/* Header */}
      <Header
        parsedQuery={parsedQuery}
        totalCount={loading || parsedQuery.isInvalidDate || parsedQuery.isUnrecognizedQuery ? null : filteredHolidays.length}
      />

      {/* Main Content Area */}
      <Box sx={{ minHeight: 180 }}>
        {loading ? (
          // Loading Skeleton
          <Box sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Skeleton variant="rounded" height={60} sx={{ borderRadius: '10px' }} />
              <Skeleton variant="rounded" height={60} sx={{ borderRadius: '10px' }} />
              <Skeleton variant="rounded" height={60} sx={{ borderRadius: '10px' }} />
            </Stack>
          </Box>
        ) : parsedQuery.isUnrecognizedQuery ? (
          // Unrecognized or missing search data
          <EmptyState
            type="unrecognized"
            message={parsedQuery.unrecognizedMessage}
            parsedQuery={parsedQuery}
          />
        ) : parsedQuery.isInvalidDate ? (
          // Invalid Date Edge Case (e.g. "Show holidays in Canada 30th Feb")
          <InvalidDateCard parsedQuery={parsedQuery} />
        ) : error ? (
          // Error State
          <EmptyState
            type="error"
            message={error}
            parsedQuery={parsedQuery}
            onRetry={() => setRetryCount((c) => c + 1)}
          />
        ) : parsedQuery.isDateCheck && parsedQuery.targetDateStr ? (
          // Date Check View (e.g. "Is July 4 a holiday in USA 2026")
          <HolidayCheckCard
            parsedQuery={parsedQuery}
            matchedHoliday={matchedHoliday}
            allHolidays={holidays}
          />
        ) : filteredHolidays.length === 0 ? (
          // Empty State
          <EmptyState
            type="empty"
            message={
              parsedQuery.isDayOnly
                ? `No public holidays fall on the ${parsedQuery.dayOrdinal} of any month in ${parsedQuery.countryName} (${parsedQuery.year}).`
                : null
            }
            parsedQuery={parsedQuery}
          />
        ) : (
          // Holiday Schedule List (Filtered by Month, Day-Only, or Full Year)
          <HolidayList
            holidays={filteredHolidays}
            parsedQuery={parsedQuery}
          />
        )}
      </Box>
    </Paper>
  );
}

export default NewComponent;