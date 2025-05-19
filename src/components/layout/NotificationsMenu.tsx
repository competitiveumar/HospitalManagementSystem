import React from 'react';
import {
  Menu,
  MenuItem,
  Typography,
  Box,
  IconButton,
  Divider,
  Badge,
  ListItemIcon,
  List,
  ListItem,
  ListItemText,
  Tooltip,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { clearNotifications } from '../../store/slices/uiSlice';
import { Notification } from '../../types';
import { format } from 'date-fns';

interface NotificationsMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}

const NotificationsMenu: React.FC<NotificationsMenuProps> = ({ anchorEl, open, onClose }) => {
  const dispatch = useAppDispatch();
  const { notifications } = useAppSelector((state) => state.ui);

  const handleClearNotifications = () => {
    dispatch(clearNotifications());
    onClose();
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'info':
        return <InfoIcon color="info" />;
      case 'success':
        return <CheckCircleIcon color="success" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'error':
        return <ErrorIcon color="error" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  // Format notification time
  const formatNotificationTime = (timestamp: string) => {
    try {
      return format(new Date(timestamp), 'HH:mm, dd MMM yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <Menu
      id="notifications-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        elevation: 2,
        sx: {
          maxHeight: 400,
          width: '350px',
          maxWidth: '100%',
          overflow: 'hidden',
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Notifications</Typography>
        <Tooltip title="Clear all notifications">
          <IconButton size="small" onClick={handleClearNotifications} disabled={notifications.length === 0}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <Divider />
      
      {notifications.length === 0 ? (
        <Box sx={{ py: 4, px: 2, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No notifications
          </Typography>
        </Box>
      ) : (
        <List sx={{ width: '100%', maxHeight: 300, overflow: 'auto', p: 0 }}>
          {notifications.map((notification) => (
            <React.Fragment key={notification.id}>
              <ListItem alignItems="flex-start" sx={{ px: 2 }}>
                <ListItemIcon sx={{ minWidth: 42 }}>
                  {getNotificationIcon(notification.type)}
                </ListItemIcon>
                <ListItemText
                  primary={notification.message}
                  secondary={formatNotificationTime(notification.timestamp)}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontWeight: notification.read ? 'normal' : 'bold',
                    },
                  }}
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      )}
    </Menu>
  );
};

export default NotificationsMenu; 