import React, { useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Divider,
  IconButton,
  Button,
  Tooltip,
  useTheme,
  Menu,
  MenuItem
} from '@mui/material';
import {
  PersonAdd,
  CalendarMonth,
  Inventory2,
  Receipt,
  MonetizationOn,
  Science,
  Group,
  Refresh,
  TrendingUp,
  Warning,
  MedicalServices,
  AccountBalance,
  MoreVert
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { refreshDashboardStats } from '../../store/slices/uiSlice';
import StatsCard from './StatsCard';
import RecentAppointments from './RecentAppointments';
import InventoryStatus from './InventoryStatus';
import RevenueChart from './RevenueChart';
import AppointmentsChart from './AppointmentsChart';
import { Link } from 'react-router-dom';
import { ArrowForward } from '@mui/icons-material';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { dashboardStats } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);
  const { appointments } = useAppSelector((state) => state.appointments);
  const { bills } = useAppSelector((state) => state.billing);
  
  // Current time for greeting
  const currentHour = new Date().getHours();
  
  let greeting = "Good Morning";
  if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good Afternoon";
  } else if (currentHour >= 18) {
    greeting = "Good Evening";
  }

  // Refresh dashboard stats
  const handleRefresh = () => {
    dispatch(refreshDashboardStats());
  };
  
  useEffect(() => {
    // Refresh stats on component mount
    handleRefresh();
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Dashboard Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {greeting}, {user?.name?.split(' ')[0]}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Here's what's happening with your hospital today
          </Typography>
        </Box>
        <Tooltip title="Refresh Dashboard">
          <IconButton onClick={handleRefresh} color="primary">
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, p: 1.5 }}>
          <StatsCard
            title="Total Patients"
            value={dashboardStats.totalPatients}
            icon={<PersonAdd color="primary" />}
            color="#E3F2FD"
            linkTo="/patients"
          />
        </Box>
        <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, p: 1.5 }}>
          <StatsCard
            title="Today's Appointments"
            value={dashboardStats.totalAppointmentsToday}
            icon={<CalendarMonth color="secondary" />}
            color="#F3E5F5"
            linkTo="/appointments"
          />
        </Box>
        <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, p: 1.5 }}>
          <StatsCard
            title="Doctors Available"
            value={dashboardStats.totalDoctors}
            icon={<MedicalServices color="error" />}
            color="#FFEBEE"
            linkTo="/staff"
          />
        </Box>
        <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, p: 1.5 }}>
          <StatsCard
            title="Monthly Revenue"
            value={`£${dashboardStats.revenueThisMonth.toFixed(2)}`}
            icon={<AccountBalance color="success" />}
            color="#E8F5E9"
            linkTo="/billing"
          />
        </Box>
      </Grid>

      {/* Alerts */}
      {(dashboardStats.inventoryAlerts > 0 || dashboardStats.pendingBills > 0) && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {dashboardStats.inventoryAlerts > 0 && (
            <Box sx={{ width: { xs: '100%', md: '50%' }, p: 1.5 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: 'warning.light',
                  color: 'warning.dark',
                  height: '100%'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Warning fontSize="large" />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Low Stock Alert
                    </Typography>
                    <Typography>
                      {dashboardStats.inventoryAlerts} items need restocking
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ mt: 1, color: 'warning.dark', borderColor: 'warning.dark' }}
                      component={Link}
                      to="/inventory"
                    >
                      View Inventory
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Box>
          )}

          {dashboardStats.pendingBills > 0 && (
            <Box sx={{ width: { xs: '100%', md: '50%' }, p: 1.5 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: 'info.light',
                  color: 'info.dark',
                  height: '100%'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Receipt fontSize="large" />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Pending Payments
                    </Typography>
                    <Typography>
                      {dashboardStats.pendingBills} bills await payment
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ mt: 1, color: 'info.dark', borderColor: 'info.dark' }}
                      component={Link}
                      to="/billing"
                    >
                      View Billing
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Box>
          )}
        </Grid>
      )}

      {/* Charts and Tables */}
      <Grid container spacing={3}>
        <Box sx={{ width: { xs: '100%', md: '66.67%' }, p: 1.5 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Revenue Overview</Typography>
            </Box>
            <RevenueChart />
          </Paper>
        </Box>

        <Box sx={{ width: { xs: '100%', md: '33.33%' }, p: 1.5 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Appointments by Status</Typography>
            </Box>
            <AppointmentsChart />
          </Paper>
        </Box>

        <Box sx={{ width: { xs: '100%', md: '50%' }, p: 1.5 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Recent Appointments</Typography>
              <Button 
                component={Link} 
                to="/appointments"
                variant="text"
                endIcon={<ArrowForward fontSize="small" />}
              >
                View All
              </Button>
            </Box>
            <RecentAppointments />
          </Paper>
        </Box>

        <Box sx={{ width: { xs: '100%', md: '50%' }, p: 1.5 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Inventory Status</Typography>
              <Button 
                component={Link} 
                to="/inventory"
                variant="text"
                endIcon={<ArrowForward fontSize="small" />}
              >
                View All
              </Button>
            </Box>
            <InventoryStatus />
          </Paper>
        </Box>
      </Grid>
    </Box>
  );
};

export default Dashboard; 