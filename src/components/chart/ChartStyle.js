// @mui
import { alpha, useTheme } from '@mui/material/styles';
import { GlobalStyles } from '@mui/material';

// ----------------------------------------------------------------------

export default function ChartStyle() {
  const theme = useTheme();

  return (
    <GlobalStyles
      styles={{
        '&.apexcharts-canvas': {
          // Tooltip
          '.apexcharts-xaxistooltip': {
            border: 0,
            boxShadow: 'none',
            color: theme.palette.primary.main,
            fontWeight: theme.typography.fontWeightMedium,
            borderRadius: Number(theme.shape.borderRadius) * 1.5,
            '&:before': { borderBottomColor: 'transparent' },
            '&:after': { borderBottomColor: alpha(theme.palette.background.default, 0.8) },
          },
          '.apexcharts-tooltip.apexcharts-theme-light': {
            border: 0,
            borderRadius: Number(theme.shape.borderRadius) * 1.5,
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
            boxShadow: 'none',
            textAlign: 'center',
            '& .apexcharts-tooltip-title': {
              border: 0,
              textAlign: 'center',
              fontWeight: theme.typography.fontWeightBold,
              backgroundColor: theme.palette.common.black,
              color: theme.palette.common.white,
            },
          },
          // Legend
          '.apexcharts-legend': {
            padding: 0,
          },
          '.apexcharts-legend-series': {
            display: 'flex !important',
            alignItems: 'center',
          },
          '.apexcharts-legend-marker': {
            marginRight: 8,
          },
          '.apexcharts-legend-text': {
            lineHeight: '18px',
            textTransform: 'capitalize',
          },
        },
      }}
    />
  );
}
