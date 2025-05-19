import React, { useEffect } from 'react';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { useLocation } from 'react-router-dom';

import Sidebar from './Sidebar';
import Header from './Header';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { setCurrentPath, setIsMobile } from '../../store/slices/uiSlice';
import { createAppTheme } from '../../utils/theme';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { sidebarOpen, theme: currentTheme } = useAppSelector((state) => state.ui);
  
  // Create theme dynamically based on current theme mode
  const themeWithMode = createAppTheme(currentTheme);

  // Update current path when location changes
  useEffect(() => {
    dispatch(setCurrentPath(location.pathname));
  }, [location.pathname, dispatch]);

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      dispatch(setIsMobile(window.innerWidth < 960));
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  return (
    <ThemeProvider theme={themeWithMode}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { sm: `calc(100% - ${sidebarOpen ? 240 : 64}px)` },
            ml: { sm: sidebarOpen ? '240px' : '64px' },
            transition: (theme) =>
              theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            overflowX: 'hidden',
          }}
        >
          <Header />
          <Box sx={{ p: 3, pt: 10 }}>{children}</Box>
        </Box>
        <ToastContainer 
          position="bottom-right" 
          theme={currentTheme}
        />
      </Box>
    </ThemeProvider>
  );
};

export default Layout; 