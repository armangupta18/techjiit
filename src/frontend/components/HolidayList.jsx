import React from 'react';
import { Box, Typography, Stack, Divider } from '@mui/material';
import HolidayCard from './HolidayCard';
import { MONTH_NAMES } from '../utils/dateUtils';

export default function HolidayList({ holidays, parsedQuery }) {
  const { month } = parsedQuery;

  // Group holidays by month for clean organization when showing all-year results
  const groupedByMonth = React.useMemo(() => {
    if (month) return null; // When filtered by month, don't group

    const groups = {};
    holidays.forEach((h) => {
      const mIndex = parseInt(h.date.split('-')[1], 10) - 1;
      const mName = MONTH_NAMES[mIndex] || 'Other';
      if (!groups[mName]) {
        groups[mName] = [];
      }
      groups[mName].push(h);
    });
    return groups;
  }, [holidays, month]);

  return (
    <Box sx={{ p: 2.5 }}>
      {month ? (
        // Single Month View
        <Stack spacing={1.5}>
          {holidays.map((holiday, idx) => (
            <HolidayCard key={`${holiday.date}-${holiday.name}-${idx}`} holiday={holiday} />
          ))}
        </Stack>
      ) : (
        // Full Year Grouped View
        <Stack spacing={3}>
          {Object.entries(groupedByMonth || {}).map(([monthName, monthHolidays]) => (
            <Box key={monthName}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: '#475569',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  mb: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  '&::after': {
                    content: '""',
                    flexGrow: 1,
                    height: '1px',
                    backgroundColor: '#e2e8f0',
                  },
                }}
              >
                {monthName} ({monthHolidays.length})
              </Typography>
              <Stack spacing={1.5}>
                {monthHolidays.map((holiday, idx) => (
                  <HolidayCard key={`${holiday.date}-${holiday.name}-${idx}`} holiday={holiday} />
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
}
