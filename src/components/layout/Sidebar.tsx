import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  People as PeopleIcon,
  CalendarMonth as CalendarIcon,
  Inventory as InventoryIcon,
  ReceiptLong as BillingIcon,
  Science as LabIcon,
  BubbleChart as ReportIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { toggleSidebar } from '../../store/slices/uiSlice';
import placeholderImages from '../../assets/images/placeholder';

// Sidebar width when open
const drawerWidth = 240;

// Menu items with nested structure
const menuItems = [
  { 
    title: 'Dashboard', 
    icon: <DashboardIcon />, 
    path: '/',
    roles: ['admin', 'doctor', 'nurse', 'receptionist', 'patient', 'lab_technician', 'pharmacist'],
  },
  { 
    title: 'Patients', 
    icon: <PersonIcon />, 
    path: '/patients',
    roles: ['admin', 'doctor', 'nurse', 'receptionist'],
    children: [
      { title: 'All Patients', path: '/patients' },
      { title: 'Add Patient', path: '/patients/add' },
      { title: 'Medical Records', path: '/patients/records' },
    ],
  },
  { 
    title: 'Staff', 
    icon: <PeopleIcon />, 
    path: '/staff',
    roles: ['admin'],
    children: [
      { title: 'All Staff', path: '/staff' },
      { title: 'Doctors', path: '/staff/doctors' },
      { title: 'Nurses', path: '/staff/nurses' },
      { title: 'Add Staff', path: '/staff/add' },
    ],
  },
  { 
    title: 'Appointments', 
    icon: <CalendarIcon />, 
    path: '/appointments',
    roles: ['admin', 'doctor', 'nurse', 'receptionist', 'patient'],
    children: [
      { title: 'View Calendar', path: '/appointments' },
      { title: 'Book Appointment', path: '/appointments/book' },
    ],
  },
  { 
    title: 'Inventory', 
    icon: <InventoryIcon />, 
    path: '/inventory',
    roles: ['admin', 'pharmacist'],
    children: [
      { title: 'Medicines', path: '/inventory/medicines' },
      { title: 'Equipment', path: '/inventory/equipment' },
      { title: 'Supplies', path: '/inventory/supplies' },
      { title: 'Add Item', path: '/inventory/add' },
    ],
  },
  { 
    title: 'Billing', 
    icon: <BillingIcon />, 
    path: '/billing',
    roles: ['admin', 'receptionist'],
    children: [
      { title: 'All Bills', path: '/billing' },
      { title: 'Create Bill', path: '/billing/create' },
      { title: 'Payments', path: '/billing/payments' },
    ],
  },
  { 
    title: 'Lab Tests', 
    icon: <LabIcon />, 
    path: '/lab-tests',
    roles: ['admin', 'doctor', 'lab_technician'],
    children: [
      { title: 'All Tests', path: '/lab-tests' },
      { title: 'Request Test', path: '/lab-tests/request' },
      { title: 'Results', path: '/lab-tests/results' },
    ],
  },
  { 
    title: 'Reports', 
    icon: <ReportIcon />, 
    path: '/reports',
    roles: ['admin'],
    children: [
      { title: 'Patient Statistics', path: '/reports/patients' },
      { title: 'Revenue', path: '/reports/revenue' },
      { title: 'Staff Performance', path: '/reports/staff' },
    ],
  },
  { 
    title: 'Settings', 
    icon: <SettingsIcon />, 
    path: '/settings',
    roles: ['admin', 'doctor', 'nurse', 'receptionist', 'patient', 'lab_technician', 'pharmacist'],
  },
];

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen, isMobile } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);
  
  // State to track which menu items are expanded
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});

  // Toggle expansion of a menu item
  const handleToggleExpand = (title: string) => {
    setExpanded(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => {
    // If no user or no roles defined, show all items
    if (!user || !item.roles) return true;
    // Otherwise, check if user role is allowed
    return item.roles.includes(user.role);
  });

  // Check if a path is active
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Handle menu item click
  const handleMenuItemClick = (path: string, hasChildren: boolean, title: string) => {
    if (hasChildren) {
      handleToggleExpand(title);
    } else {
      navigate(path);
      if (isMobile) {
        dispatch(toggleSidebar());
      }
    }
  };

  // Handle sidebar close
  const handleCloseSidebar = () => {
    if (sidebarOpen) {
      dispatch(toggleSidebar());
    }
  };

  // Render sidebar content
  const sidebarContent = (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1 }}>
        <Box 
          component="img" 
          src={placeholderImages.hospitalLogo} 
          alt="Hospital Logo" 
          sx={{ height: 40, width: 'auto', mr: 1 }} 
        />
        <Typography variant="h6" noWrap>
          HMS
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton onClick={handleCloseSidebar} sx={{ display: { xs: 'block', sm: 'none' } }}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {filteredMenuItems.map((item) => (
          <React.Fragment key={item.title}>
            <ListItem disablePadding>
              <ListItemButton
                selected={isActive(item.path)}
                onClick={() => handleMenuItemClick(item.path, Boolean(item.children), item.title)}
                sx={{
                  minHeight: 48,
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: sidebarOpen ? 2 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.title} 
                  sx={{ 
                    opacity: sidebarOpen ? 1 : 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }} 
                />
                {item.children && sidebarOpen && (
                  expanded[item.title] ? <ExpandLess /> : <ExpandMore />
                )}
              </ListItemButton>
            </ListItem>
            
            {/* Submenu items */}
            {item.children && sidebarOpen && (
              <Collapse in={expanded[item.title]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children.map((child) => (
                    <ListItemButton
                      key={child.title}
                      selected={isActive(child.path)}
                      onClick={() => {
                        navigate(child.path);
                        if (isMobile) {
                          dispatch(toggleSidebar());
                        }
                      }}
                      sx={{ pl: 4 }}
                    >
                      <ListItemText primary={child.title} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={sidebarOpen && isMobile}
        onClose={handleCloseSidebar}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {sidebarContent}
      </Drawer>
      
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: sidebarOpen ? drawerWidth : 64,
            overflowX: 'hidden',
            transition: (theme) =>
              theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
          },
        }}
        open={sidebarOpen}
      >
        {sidebarContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar; 