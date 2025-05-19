import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';
import { useAppSelector } from '../../hooks/reduxHooks';

const AppointmentsChart: React.FC = () => {
  const theme = useTheme();
  const { appointments } = useAppSelector((state) => state.appointments);
  
  // Count appointments by status
  const appointmentCounts = appointments.reduce(
    (acc: Record<string, number>, appointment) => {
      const status = appointment.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {}
  );
  
  // Prepare chart data
  const prepareChartData = () => {
    const statusLabels: Record<string, string> = {
      'scheduled': 'Scheduled',
      'confirmed': 'Confirmed',
      'completed': 'Completed',
      'cancelled': 'Cancelled',
      'no-show': 'No Show',
    };
    
    return Object.entries(appointmentCounts).map(([status, count]) => ({
      name: statusLabels[status] || status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      status,
    }));
  };
  
  const chartData = prepareChartData();
  
  // Define colors for different statuses
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return theme.palette.info.main;
      case 'confirmed':
        return theme.palette.primary.main;
      case 'completed':
        return theme.palette.success.main;
      case 'cancelled':
        return theme.palette.error.main;
      case 'no-show':
        return theme.palette.warning.main;
      default:
        return theme.palette.grey[500];
    }
  };
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
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
          <Typography variant="subtitle2">{data.name}</Typography>
          <Typography variant="body2" fontWeight="bold" sx={{ color: getStatusColor(data.status) }}>
            {data.value} appointments
          </Typography>
        </Box>
      );
    }
    return null;
  };
  
  // Custom Legend component
  const CustomLegend = (props: any) => {
    const { payload } = props;
    
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', mt: 2 }}>
        {payload.map((entry: any, index: number) => (
          <Box
            key={`legend-${index}`}
            sx={{
              display: 'flex',
              alignItems: 'center',
              mx: 1,
              mb: 1,
            }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                backgroundColor: entry.color,
                borderRadius: '50%',
                mr: 1,
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {entry.value}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };
  
  return (
    <Box sx={{ width: '100%', height: 300 }}>
      {chartData.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 10 }}>
          No appointment data available
        </Typography>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              innerRadius={40}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getStatusColor(entry.status)} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export default AppointmentsChart; 