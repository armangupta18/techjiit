import React from 'react';
import { Box, Typography, Card, Chip, Stack } from '@mui/material';
import { formatDate } from '../utils/dateUtils';

export default function HolidayCard({ holiday }) {
  const { date, name, localName, holidayTypes, nationalHoliday, subdivisionCodes } = holiday;
  const formattedDate = formatDate(date);

  return (
    <Card
      elevation={0}
      sx={{
        p: 2,
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        backgroundColor: '#ffffff',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          borderColor: '#94a3b8',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          transform: 'translateY(-1px)',
        },
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" flexWrap="wrap">
        <Stack direction="row" spacing={2} alignItems="center">
          {/* Date Badge */}
          <Box
            sx={{
              minWidth: 80,
              p: '6px 10px',
              borderRadius: '8px',
              backgroundColor: '#f1f5f9',
              textAlign: 'center',
              border: '1px solid #e2e8f0',
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.85rem' }}>
              {formattedDate}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem' }}>
              {date}
            </Typography>
          </Box>

          {/* Holiday Name & Details */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0f172a', lineHeight: 1.3 }}>
              {name}
            </Typography>
            {localName && localName !== name && (
              <Typography variant="caption" sx={{ color: '#64748b', fontStyle: 'italic' }}>
                Local: {localName}
              </Typography>
            )}
            {subdivisionCodes && subdivisionCodes.length > 0 && (
              <Typography variant="caption" sx={{ display: 'block', color: '#94a3b8' }}>
                Regions: {subdivisionCodes.join(', ')}
              </Typography>
            )}
          </Box>
        </Stack>

        {/* Badges / Types */}
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: { xs: 1, sm: 0 } }}>
          {holidayTypes?.map((type, idx) => (
            <Chip
              key={idx}
              label={type}
              size="small"
              sx={{
                height: 22,
                fontSize: '0.72rem',
                backgroundColor: '#eff6ff',
                color: '#1d4ed8',
                fontWeight: 500,
                border: '1px solid #bfdbfe',
              }}
            />
          ))}
          {nationalHoliday && (
            <Chip
              label="National"
              size="small"
              sx={{
                height: 22,
                fontSize: '0.72rem',
                backgroundColor: '#f0fdf4',
                color: '#15803d',
                fontWeight: 500,
                border: '1px solid #bbf7d0',
              }}
            />
          )}
        </Stack>
      </Stack>
    </Card>
  );
}
