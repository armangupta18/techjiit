import React from 'react';
import { Box, Typography, Card, CardContent, Chip, Stack, Divider } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { formatFullDate, formatDate } from '../utils/dateUtils';

export default function HolidayCheckCard({ parsedQuery, matchedHoliday, allHolidays = [] }) {
  const { countryName, targetDateStr, month } = parsedQuery;
  const isHoliday = Boolean(matchedHoliday);
  const formattedTargetDate = formatFullDate(targetDateStr);

  // Find next holiday or closest holiday in that month if not a holiday
  const nearestHoliday = React.useMemo(() => {
    if (isHoliday || !allHolidays || allHolidays.length === 0 || !targetDateStr) return null;
    // Look for holidays on or after targetDate
    const upcoming = allHolidays.find((h) => h.date >= targetDateStr);
    if (upcoming) return upcoming;
    // If none after, return the last holiday of the year
    return allHolidays[allHolidays.length - 1];
  }, [isHoliday, allHolidays, targetDateStr]);

  return (
    <Box sx={{ p: 2.5 }}>
      <Card
        elevation={0}
        sx={{
          borderRadius: '12px',
          border: '1.5px solid',
          borderColor: isHoliday ? '#10b981' : '#f59e0b',
          backgroundColor: isHoliday ? 'rgba(16, 185, 129, 0.04)' : 'rgba(245, 158, 11, 0.04)',
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: isHoliday ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                color: isHoliday ? '#059669' : '#d97706',
                flexShrink: 0,
              }}
            >
              {isHoliday ? <CheckCircleIcon sx={{ fontSize: 32 }} /> : <HighlightOffIcon sx={{ fontSize: 32 }} />}
            </Box>

            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: isHoliday ? '#065f46' : '#92400e', mb: 0.5 }}>
                {isHoliday ? 'Yes, it is a public holiday!' : 'No, it is not a public holiday.'}
              </Typography>

              <Typography variant="body1" sx={{ color: '#334155', mb: 2, fontWeight: 500 }}>
                {isHoliday ? (
                  <>
                    <strong>{formattedTargetDate}</strong> is celebrated as <strong>{matchedHoliday.name}</strong> in{' '}
                    <strong>{countryName}</strong>.
                  </>
                ) : (
                  <>
                    <strong>{formattedTargetDate}</strong> is a regular working day and not listed as a public holiday in{' '}
                    <strong>{countryName}</strong>.
                  </>
                )}
              </Typography>

              {isHoliday && matchedHoliday && (
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                        {matchedHoliday.name}
                      </Typography>
                      {matchedHoliday.localName && matchedHoliday.localName !== matchedHoliday.name && (
                        <Typography variant="body2" sx={{ color: '#64748b', fontStyle: 'italic' }}>
                          Local name: {matchedHoliday.localName}
                        </Typography>
                      )}
                    </Box>

                    <Stack direction="row" spacing={1}>
                      {matchedHoliday.holidayTypes?.map((type, idx) => (
                        <Chip
                          key={idx}
                          label={type}
                          size="small"
                          sx={{
                            backgroundColor: '#e0f2fe',
                            color: '#0369a1',
                            fontWeight: 600,
                            borderRadius: '6px',
                          }}
                        />
                      ))}
                      {matchedHoliday.nationalHoliday && (
                        <Chip
                          label="National"
                          size="small"
                          sx={{
                            backgroundColor: '#dcfce7',
                            color: '#15803d',
                            fontWeight: 600,
                            borderRadius: '6px',
                          }}
                        />
                      )}
                    </Stack>
                  </Stack>
                </Box>
              )}

              {!isHoliday && nearestHoliday && (
                <Box
                  sx={{
                    p: 1.5,
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 1,
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <EventAvailableIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: '#475569' }}>
                      Next upcoming holiday in {countryName}:{' '}
                      <strong>{nearestHoliday.name}</strong> ({formatDate(nearestHoliday.date)})
                    </Typography>
                  </Stack>
                </Box>
              )}
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
