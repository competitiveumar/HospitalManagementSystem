import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  TextField,
  Avatar,
  Badge,
  IconButton,
  Tab,
  Tabs,
  useTheme,
  Alert,
  FormGroup,
  Checkbox,
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  EditOutlined as EditIcon,
  Save as SaveIcon,
  AccountCircle as AccountIcon,
  Palette as PaletteIcon,
  NotificationsActive as NotificationsActiveIcon,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { updateUserProfile } from '../../store/slices/authSlice';
import { updateStaff } from '../../store/slices/staffSlice';
import Grid from '../common/Grid';

// TabPanel component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const Settings: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const staff = useAppSelector((state) => state.staff.staff);
  
  const [tabValue, setTabValue] = useState(0);
  const [currentTheme, setCurrentTheme] = useState('light');
  const [currentColorScheme, setCurrentColorScheme] = useState('#1976d2');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Find staff member if user is a doctor
  const staffMember = user?.role === 'doctor' 
    ? staff.find(s => s.id === user.id) 
    : null;
  
  // User profile form state
  const [userForm, setUserForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: staffMember?.phone || '',
    address: staffMember?.address || '',
    specialization: staffMember?.specialization || '',
    qualification: staffMember?.qualification || '',
    bio: '',  // Bio isn't in the Staff type, so using empty string
  });

  // Update form when user or staff data changes
  useEffect(() => {
    if (user) {
      setUserForm(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    }
    
    if (staffMember) {
      setUserForm(prev => ({
        ...prev,
        phone: staffMember.phone || prev.phone,
        address: staffMember.address || prev.address,
        specialization: staffMember.specialization || prev.specialization,
        qualification: staffMember.qualification || prev.qualification,
        // bio is not in the Staff type, so keeping prev.bio
      }));
    }
  }, [user, staffMember]);

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    appointments: true,
    messages: false,
    updates: true,
  });
  
  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
  });
  
  // Theme options
  const themeOptions = [
    { name: 'Blue', value: 'blue', color: '#1976d2' },
    { name: 'Purple', value: 'purple', color: '#9c27b0' },
    { name: 'Green', value: 'green', color: '#2e7d32' },
    { name: 'Red', value: 'red', color: '#d32f2f' },
    { name: 'Orange', value: 'orange', color: '#ed6c02' },
    { name: 'Cyan', value: 'cyan', color: '#0288d1' },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleToggleTheme = () => {
    setCurrentTheme(currentTheme === 'light' ? 'dark' : 'light');
  };

  const handleColorSchemeChange = (scheme: string) => {
    setCurrentColorScheme(scheme);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    // Update user profile in Redux state
    if (user) {
      dispatch(updateUserProfile({
        id: user.id,
        name: userForm.name,
        email: userForm.email,
      }));
      
      // If user is a doctor, also update staff record
      if (user.role === 'doctor' && staffMember) {
        dispatch(updateStaff({
          ...staffMember,
          name: userForm.name,
          email: userForm.email,
          phone: userForm.phone,
          address: userForm.address,
          specialization: userForm.specialization,
          qualification: userForm.qualification,
          // Note: bio is not used since it's not in the Staff type
        }));
      }
    }
    
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserForm({
      ...userForm,
      [name]: value,
    });
  };

  const handleNotificationToggle = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotificationSettings({
      ...notificationSettings,
      [name]: event.target.checked,
    });
  };

  const handleSecurityToggle = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSecuritySettings({
      ...securitySettings,
      [name]: event.target.checked,
    });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Settings
      </Typography>

      <Card sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="settings tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab 
              icon={<AccountIcon />} 
              label="Profile" 
              iconPosition="start" 
            />
            <Tab 
              icon={<PaletteIcon />} 
              label="Appearance" 
              iconPosition="start" 
            />
            <Tab 
              icon={<NotificationsActiveIcon />} 
              label="Notifications" 
              iconPosition="start" 
            />
            <Tab 
              icon={<SecurityIcon />} 
              label="Security" 
              iconPosition="start" 
            />
          </Tabs>
        </Box>

        {/* Profile Tab */}
        <TabPanel value={tabValue} index={0}>
          {saveSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Profile updated successfully!
            </Alert>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <IconButton
                  size="small"
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: '#fff',
                    '&:hover': { bgcolor: theme.palette.primary.dark },
                  }}
                >
                  <EditIcon fontSize="inherit" />
                </IconButton>
              }
            >
              <Avatar
                alt={user?.name}
                src={user?.profileImage}
                sx={{ width: 100, height: 100 }}
              />
            </Badge>
            <Box sx={{ ml: 3 }}>
              <Typography variant="h6">{user?.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            {!isEditing ? (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleEditProfile}
              >
                Edit Profile
              </Button>
            ) : (
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveProfile}
              >
                Save Changes
              </Button>
            )}
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Full Name"
                name="name"
                value={userForm.name}
                onChange={handleInputChange}
                fullWidth
                disabled={!isEditing}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                name="email"
                value={userForm.email}
                onChange={handleInputChange}
                fullWidth
                disabled={!isEditing}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Phone"
                name="phone"
                value={userForm.phone}
                onChange={handleInputChange}
                fullWidth
                disabled={!isEditing}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Address"
                name="address"
                value={userForm.address}
                onChange={handleInputChange}
                fullWidth
                disabled={!isEditing}
                margin="normal"
              />
            </Grid>
            
            {user?.role === 'doctor' && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Specialization"
                    name="specialization"
                    value={userForm.specialization}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!isEditing}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Qualification"
                    name="qualification"
                    value={userForm.qualification}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!isEditing}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Professional Bio"
                    name="bio"
                    value={userForm.bio}
                    onChange={handleInputChange}
                    fullWidth
                    multiline
                    rows={4}
                    disabled={!isEditing}
                    margin="normal"
                  />
                </Grid>
              </>
            )}
          </Grid>
        </TabPanel>

        {/* Appearance Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>Theme</Typography>
          <FormControlLabel
            control={
              <Switch
                checked={currentTheme === 'dark'}
                onChange={handleToggleTheme}
                color="primary"
              />
            }
            label={currentTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            {currentTheme === 'dark' ? (
              <DarkModeIcon color="action" sx={{ mr: 1 }} />
            ) : (
              <LightModeIcon color="warning" sx={{ mr: 1 }} />
            )}
            <Typography variant="body2">
              {currentTheme === 'dark'
                ? 'Dark mode reduces eye strain in low light environments.'
                : 'Light mode is best for readability in well-lit environments.'}
            </Typography>
          </Box>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Color Scheme</Typography>
          <Grid container spacing={1} sx={{ mt: 1 }}>
            {themeOptions.map((option) => (
              <Grid item key={option.value}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: option.color,
                    cursor: 'pointer',
                    border: currentColorScheme === option.color ? '2px solid black' : 'none',
                    '&:hover': {
                      opacity: 0.8,
                    },
                  }}
                  onClick={() => handleColorSchemeChange(option.color)}
                />
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Notifications Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>Notification Preferences</Typography>
          
          <FormControlLabel
            control={
              <Switch
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                color="primary"
              />
            }
            label="Enable Notifications"
          />
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>Notification Channels</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  disabled={!notificationsEnabled}
                  color="primary"
                />
              }
              label="Email"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={smsNotifications}
                  onChange={(e) => setSmsNotifications(e.target.checked)}
                  disabled={!notificationsEnabled}
                  color="primary"
                />
              }
              label="SMS"
            />
          </Box>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>Notification Types</Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={notificationSettings.appointments}
                    onChange={handleNotificationToggle('appointments')}
                    disabled={!notificationsEnabled}
                  />
                }
                label="Appointment Reminders"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={notificationSettings.messages}
                    onChange={handleNotificationToggle('messages')}
                    disabled={!notificationsEnabled}
                  />
                }
                label="New Messages"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={notificationSettings.updates}
                    onChange={handleNotificationToggle('updates')}
                    disabled={!notificationsEnabled}
                  />
                }
                label="System Updates"
              />
            </FormGroup>
          </Box>
        </TabPanel>

        {/* Security Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>Account Security</Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>Two-Factor Authentication</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={securitySettings.twoFactorEnabled}
                  onChange={handleSecurityToggle('twoFactorEnabled')}
                  color="primary"
                />
              }
              label="Enable Two-Factor Authentication"
            />
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Adds an extra layer of security to your account by requiring a verification code in addition to your password.
            </Typography>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="subtitle1" gutterBottom>Change Password</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Current Password"
                type="password"
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="New Password"
                type="password"
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Confirm New Password"
                type="password"
                fullWidth
                margin="normal"
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Update Password
          </Button>
        </TabPanel>
      </Card>
    </Box>
  );
};

export default Settings; 