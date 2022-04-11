import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
import PropTypes from 'prop-types';
// @mui
import { useTheme } from '@mui/material/styles';
import { Card, Typography, Stack, Divider } from '@mui/material';
// hooks
import useResponsive from '../../hooks/useResponsive';
// utils
import { fNumber } from '../../utils/formatNumber';
//
import { BaseOptionChart } from '../../components/chart';

// ----------------------------------------------------------------------

SummaryWidget.propTypes = {
  summary: PropTypes.object,
}

const CHART_SIZE = { width: 106, height: 106 };

export default function SummaryWidget({summary}) {
  const {
    subscribersCount,
    subscribersPrepaidCount,
    subscribersPostpaidCount
  } = summary.mobileSubscriberSummary;

  const theme = useTheme();

  const isDesktop = useResponsive('up', 'sm');

  const chartOptionsTotal = merge(BaseOptionChart(), {
    chart: { sparkline: { enabled: true } },
    grid: {
      padding: {
        top: -9,
        bottom: -9,
      },
    },
    legend: { show: false },
    plotOptions: {
      radialBar: {
        hollow: { size: '64%' },
        track: { margin: 0 },
        dataLabels: {
          name: { show: false },
          value: {
            offsetY: 6,
            fontSize: theme.typography.subtitle2.fontSize,
          },
        },
      },
    },
  });

  const chartOptionsPrepaid = {
    ...chartOptionsTotal,
    colors: [theme.palette.chart.yellow[0]],
  };

  const chartOptionsPostpaid = {
    ...chartOptionsTotal,
    colors: [theme.palette.chart.blue[0]],
  };

  const getChartData = (data) => {
    if (subscribersCount || subscribersCount === "0") {
      const val = ((data / subscribersCount) * 100)
      return [Math.round(val)];
    }
    return [0];
  }

  return (
    <Card>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        divider={
          <Divider orientation={isDesktop ? 'vertical' : 'horizontal'} flexItem sx={{ borderStyle: 'dashed' }} />
        }
      >
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={3} sx={{ width: 1, py: 5 }}>
          <ReactApexChart type="radialBar" series={getChartData(subscribersCount)} options={chartOptionsTotal} {...CHART_SIZE} />
          <div>
            <Typography variant="h4" sx={{ mb: 0.5 }}>
              {fNumber(subscribersCount)}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.72 }}>
              Total numbers
            </Typography>
          </div>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="center" spacing={3} sx={{ width: 1, py: 5 }}>
          <ReactApexChart type="radialBar" series={getChartData(subscribersPrepaidCount)} options={chartOptionsPrepaid} {...CHART_SIZE} />
          <div>
            <Typography variant="h4" sx={{ mb: 0.5 }}>
              {fNumber(subscribersPrepaidCount)}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.72 }}>
              Prepaid
            </Typography>
          </div>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="center" spacing={3} sx={{ width: 1, py: 5 }}>
          <ReactApexChart
            type="radialBar"
            series={getChartData(subscribersPostpaidCount)}
            options={chartOptionsPostpaid}
            {...CHART_SIZE}
          />
          <div>
            <Typography variant="h4" sx={{ mb: 0.5 }}>
              {fNumber(subscribersPostpaidCount)}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.72 }}>
              Post Paid
            </Typography>
          </div>
        </Stack>
      </Stack>
    </Card>
  );
}
