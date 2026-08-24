import React from 'react';
import { Box, Typography, Card, CardContent, Stack } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function InvalidDateCard({ parsedQuery }) {
  const { countryName, invalidDateDetails } = parsedQuery;
  const { day, monthName, year, maxDays, ordinalDay } = invalidDateDetails || {};

  return (
    <Box sx={{ p: 2.5 }}>
      <Card
        elevation={0}
        sx={{
          borderRadius: '12px',
          border: '1.5px solid #f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.05)',
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
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                color: '#d97706',
                flexShrink: 0,
              }}
            >
              <ErrorOutlineIcon sx={{ fontSize: 32 }} />
            </Box>

            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#92400e', mb: 0.75 }}>
                Invalid Date
              </Typography>

              <Typography variant="body1" sx={{ color: '#334155', mb: 1, fontWeight: 600 }}>
                {monthName} {ordinalDay || day}, {year} is not a valid calendar date.
              </Typography>

              <Typography variant="body2" sx={{ color: '#64748b' }}>
                {monthName} only has <strong>{maxDays} days</strong> in {year} ({monthName} 1 to {monthName} {maxDays}).
                {countryName && ` Please enter a valid date to check holidays in ${countryName}.`}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
