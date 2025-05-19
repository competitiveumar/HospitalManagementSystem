import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Box, ToggleButtonGroup, ToggleButton, Typography, useTheme } from '@mui/material';
import { useAppSelector } from '../../hooks/reduxHooks';

// This function formats a date string like '2023-06' to 'Jun 2023'
const formatMonthYear = (dateStr: string) => {
  const [year, month] = dateStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleString('en-GB', { month: 'short', year: 'numeric' });
};

const RevenueChart: React.FC = () => {
  const theme = useTheme();
  const { monthlyRevenue } = useAppSelector((state) => state.billing);
  const [timeRange, setTimeRange] = useState<string>('6');
  
  // Handle time range change
  const handleTimeRangeChange = (
    event: React.MouseEvent<HTMLElement>,
    newTimeRange: string,
  ) => {
    if (newTimeRange !== null) {
      setTimeRange(newTimeRange);
    }
  };

  // Prepare chart data
  const prepareChartData = () => {
    const months = Object.keys(monthlyRevenue).sort();
    const limitedMonths = months.slice(-parseInt(timeRange));
    
    return limitedMonths.map(month => ({
      month: formatMonthYear(month),
      revenue: monthlyRevenue[month].toFixed(2),
    }));
  };

  const chartData = prepareChartData();

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: 'white',
            padding: 1.5,
            border: `1px solid ${theme.palette.grey[300]}`,
            borderRadius: 1,
            boxShadow: theme.shadows[2],
          }}
        >
          <Typography variant="subtitle2">{label}</Typography>
          <Typography variant="body2" color="primary" fontWeight="bold">
            £{payload[0].value}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ width: '100%', height: 360 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <ToggleButtonGroup
          value={timeRange}
          exclusive
          onChange={handleTimeRangeChange}
          size="small"
          aria-label="time range"
        >
          <ToggleButton value="3" aria-label="3 months">
            3M
          </ToggleButton>
          <ToggleButton value="6" aria-label="6 months">
            6M
          </ToggleButton>
          <ToggleButton value="12" aria-label="12 months">
            12M
          </ToggleButton>
          <ToggleButton value="24" aria-label="24 months">
            All
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      {chartData.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 10 }}>
          No revenue data available
        </Typography>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis 
              tickFormatter={(value) => `£${value}`}
              width={70}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="revenue"
              name="Revenue"
              fill={theme.palette.primary.main}
              radius={[4, 4, 0, 0]}
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export default RevenueChart; 