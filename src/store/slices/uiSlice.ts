import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification, DashboardStats } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { mockPatients, mockAppointments, mockStaff, mockInventoryItems, mockBills } from '../../utils/mockData';

interface UiState {
  notifications: Notification[];
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  isMobile: boolean;
  currentPath: string;
  dashboardStats: DashboardStats;
  isLoading: Record<string, boolean>; // Track loading states for different parts of the app
}

// Calculate initial dashboard stats
const calculateDashboardStats = (): DashboardStats => {
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = mockAppointments.filter(a => a.date === today);
  const pendingBills = mockBills.filter(b => b.paymentStatus !== 'paid');
  const revenueThisMonth = mockBills.reduce((sum, bill) => {
    const billMonth = new Date(bill.date).getMonth();
    const billYear = new Date(bill.date).getFullYear();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    if (billMonth === currentMonth && billYear === currentYear) {
      return sum + bill.totalAmount;
    }
    return sum;
  }, 0);
  
  return {
    totalPatients: mockPatients.length,
    totalAppointmentsToday: todayAppointments.length,
    totalDoctors: mockStaff.filter(s => s.role === 'doctor').length,
    revenueThisMonth,
    inventoryAlerts: mockInventoryItems.filter(i => i.quantity <= i.reorderLevel).length,
    pendingBills: pendingBills.length
  };
};

const initialState: UiState = {
  notifications: [],
  sidebarOpen: true,
  theme: 'light',
  isMobile: false,
  currentPath: '/',
  dashboardStats: calculateDashboardStats(),
  isLoading: {}
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    addNotification: (state: UiState, action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'read'>>) => {
      const newNotification: Notification = {
        ...action.payload,
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        read: false,
      };
      
      state.notifications = [newNotification, ...state.notifications].slice(0, 50); // Keep only most recent 50
      
      // If we have more than 5 unread notifications, mark the older ones as read
      if (state.notifications.filter(n => !n.read).length > 5) {
        const unreadNotifications = state.notifications.filter(n => !n.read);
        for (let i = 5; i < unreadNotifications.length; i++) {
          unreadNotifications[i].read = true;
        }
      }
    },
    markNotificationAsRead: (state: UiState, action: PayloadAction<string>) => {
      const notification = state.notifications.find((n: Notification) => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    markAllNotificationsAsRead: (state: UiState) => {
      state.notifications.forEach((notification: Notification) => {
        notification.read = true;
      });
    },
    clearNotifications: (state: UiState) => {
      state.notifications = [];
    },
    toggleSidebar: (state: UiState) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state: UiState, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setTheme: (state: UiState, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    toggleTheme: (state: UiState) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setIsMobile: (state: UiState, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
      // Auto-close sidebar on mobile
      if (action.payload && state.sidebarOpen) {
        state.sidebarOpen = false;
      }
    },
    setCurrentPath: (state: UiState, action: PayloadAction<string>) => {
      state.currentPath = action.payload;
    },
    updateDashboardStats: (state: UiState, action: PayloadAction<Partial<DashboardStats>>) => {
      state.dashboardStats = {
        ...state.dashboardStats,
        ...action.payload,
      };
    },
    refreshDashboardStats: (state: UiState) => {
      state.dashboardStats = calculateDashboardStats();
    },
    setLoading: (state: UiState, action: PayloadAction<{ key: string; isLoading: boolean }>) => {
      const { key, isLoading } = action.payload;
      state.isLoading[key] = isLoading;
    },
  },
});

export const {
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearNotifications,
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  toggleTheme,
  setIsMobile,
  setCurrentPath,
  updateDashboardStats,
  refreshDashboardStats,
  setLoading
} = uiSlice.actions;

export default uiSlice.reducer; 