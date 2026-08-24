import React from 'react';
import { Box, Typography, Chip, Stack } from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import SearchIcon from '@mui/icons-material/Search';

export default function Header({ parsedQuery, totalCount }) {
  const { countryName, countryCode, year, monthName, dayOrdinal, isDayOnly, isDateCheck, isInvalidDate, isUnrecognizedQuery } = parsedQuery;

  // Derive flag emoji from country code (e.g. "US" -> 🇺🇸)
  const getFlagEmoji = (code) => {
    if (!code || code.length !== 2) return '🌐';
    const codePoints = code
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  return (
    <Box
      sx={{
        p: 2.5,
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: '#ffffff',
        borderRadius: '12px 12px 0 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} flexWrap="wrap">
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 42,
              height: 42,
              borderRadius: '10px',
              backgroundColor: isInvalidDate
                ? 'rgba(245, 158, 11, 0.2)'
                : isUnrecognizedQuery
                ? 'rgba(148, 163, 184, 0.2)'
                : 'rgba(59, 130, 246, 0.2)',
              color: isInvalidDate ? '#fbbf24' : isUnrecognizedQuery ? '#cbd5e1' : '#60a5fa',
            }}
          >
            {isInvalidDate ? (
              <WarningAmberIcon fontSize="medium" />
            ) : isUnrecognizedQuery ? (
              <SearchIcon fontSize="medium" />
            ) : (
              <EventAvailableIcon fontSize="medium" />
            )}
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2, fontSize: '1.15rem' }}>
              Holiday Calendar
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {isUnrecognizedQuery ? (
                <span>Public Holiday Search</span>
              ) : (
                <>
                  <span>{getFlagEmoji(countryCode)}</span>
                  <span>{countryName} ({countryCode})</span>
                  <span>•</span>
                  <span>{year}</span>
                  {monthName && !isInvalidDate && <span>• {monthName}</span>}
                  {isDayOnly && <span>• {dayOrdinal} of month</span>}
                </>
              )}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          {isInvalidDate ? (
            <Chip
              label="Invalid Date"
              size="small"
              sx={{
                backgroundColor: 'rgba(245, 158, 11, 0.25)',
                color: '#fde68a',
                fontWeight: 600,
                border: '1px solid rgba(245, 158, 11, 0.4)',
              }}
            />
          ) : isUnrecognizedQuery ? (
            <Chip
              label="No Match"
              size="small"
              sx={{
                backgroundColor: 'rgba(148, 163, 184, 0.2)',
                color: '#cbd5e1',
                fontWeight: 600,
              }}
            />
          ) : (
            <>
              {isDayOnly && (
                <Chip
                  label={`Day: ${dayOrdinal}`}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(14, 165, 233, 0.25)',
                    color: '#7dd3fc',
                    fontWeight: 600,
                    border: '1px solid rgba(14, 165, 233, 0.4)',
                  }}
                />
              )}
              {monthName && !isDayOnly && (
                <Chip
                  label={`Month: ${monthName}`}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(147, 51, 234, 0.25)',
                    color: '#d8b4fe',
                    fontWeight: 600,
                    border: '1px solid rgba(147, 51, 234, 0.4)',
                  }}
                />
              )}
              {typeof totalCount === 'number' && !isDateCheck && (
                <Chip
                  label={`${totalCount} ${totalCount === 1 ? 'Holiday' : 'Holidays'}`}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(59, 130, 246, 0.25)',
                    color: '#93c5fd',
                    fontWeight: 600,
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                  }}
                />
              )}
            </>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
