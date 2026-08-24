import React from 'react';
import { Box, Typography, Paper, Button, Stack, Chip } from '@mui/material';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SearchOffIcon from '@mui/icons-material/SearchOff';

export default function EmptyState({ type = 'empty', message, parsedQuery, onRetry }) {
  const isError = type === 'error';
  const isUnrecognized = type === 'unrecognized';
  const { countryName, year, monthName } = parsedQuery || {};

  return (
    <Box sx={{ p: 3.5, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Paper
        elevation={0}
        sx={{
          p: 3.5,
          maxWidth: 520,
          width: '100%',
          textAlign: 'center',
          backgroundColor: '#f8fafc',
          border: '1px dashed #cbd5e1',
          borderRadius: '12px',
        }}
      >
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 56,
            height: 56,
            borderRadius: '50%',
            backgroundColor: isError ? '#fee2e2' : isUnrecognized ? '#fef3c7' : '#f1f5f9',
            color: isError ? '#dc2626' : isUnrecognized ? '#d97706' : '#64748b',
            mb: 2,
          }}
        >
          {isError ? (
            <ErrorOutlineIcon fontSize="large" />
          ) : isUnrecognized ? (
            <SearchOffIcon fontSize="large" />
          ) : (
            <EventBusyIcon fontSize="large" />
          )}
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
          {isError
            ? 'Failed to Load Holidays'
            : isUnrecognized
            ? 'No Holiday Data Found'
            : 'No Holidays Found'}
        </Typography>

        <Typography variant="body2" sx={{ color: '#64748b', mb: isUnrecognized ? 2.5 : onRetry ? 2.5 : 0 }}>
          {message ||
            (monthName
              ? `No public holidays are scheduled for ${monthName} ${year} in ${countryName || 'this country'}.`
              : `No public holidays were found for ${year} in ${countryName || 'this country'}.`)}
        </Typography>

        {isUnrecognized && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, display: 'block', mb: 1 }}>
              Try searching for:
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" gap={1}>
              <Chip label="Public holidays in Japan 2026" size="small" variant="outlined" />
              <Chip label="Is July 4 a holiday in USA?" size="small" variant="outlined" />
              <Chip label="Holidays in UK next month" size="small" variant="outlined" />
            </Stack>
          </Box>
        )}

        {onRetry && (
          <Button
            variant="outlined"
            size="small"
            onClick={onRetry}
            sx={{
              textTransform: 'none',
              borderColor: '#94a3b8',
              color: '#334155',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#64748b',
                backgroundColor: 'rgba(0,0,0,0.02)',
              },
            }}
          >
            Try Again
          </Button>
        )}
      </Paper>
    </Box>
  );
}
