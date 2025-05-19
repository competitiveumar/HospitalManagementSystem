import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Divider,
  useTheme,
} from '@mui/material';
import { format } from 'date-fns';
import { useAppSelector } from '../../hooks/reduxHooks';

const RecentAppointments: React.FC = () => {
  const theme = useTheme();
  const { appointments } = useAppSelector((state) => state.appointments);
  const { patients } = useAppSelector((state) => state.patients);
  const { staff } = useAppSelector((state) => state.staff);
  
  // Sort appointments by date and time (most recent first)
  const sortedAppointments = [...appointments]
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 5); // Take only the 5 most recent appointments

  // Get status color
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

  // Format appointment date and time
  const formatAppointmentDateTime = (date: string, time: string) => {
    try {
      const dateObj = new Date(`${date}T${time}`);
      return format(dateObj, 'dd MMM yyyy, HH:mm');
    } catch (error) {
      return `${date} ${time}`;
    }
  };

  // Get patient name by ID
  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.name : 'Unknown Patient';
  };

  // Get patient avatar by ID
  const getPatientAvatar = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient?.profileImage;
  };

  // Get doctor name by ID
  const getDoctorName = (doctorId: string) => {
    const doctor = staff.find(s => s.id === doctorId);
    return doctor ? doctor.name : 'Unknown Doctor';
  };

  return (
    <Box>
      {sortedAppointments.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          No recent appointments available
        </Typography>
      ) : (
        <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
          {sortedAppointments.map((appointment, index) => (
            <React.Fragment key={appointment.id}>
              <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar 
                    alt={getPatientName(appointment.patientId)} 
                    src={getPatientAvatar(appointment.patientId)} 
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" component="span" fontWeight={500}>
                      {getPatientName(appointment.patientId)}
                    </Typography>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography variant="body2" color="text.secondary" component="span">
                        {`With Dr. ${getDoctorName(appointment.doctorId).split(' ')[1]}`}
                      </Typography>
                      <br />
                      <Typography variant="body2" color="text.secondary" component="span">
                        {formatAppointmentDateTime(appointment.date, appointment.time)}
                      </Typography>
                    </React.Fragment>
                  }
                />
                <Chip
                  label={appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  size="small"
                  sx={{
                    backgroundColor: `${getStatusColor(appointment.status)}20`,
                    color: getStatusColor(appointment.status),
                    fontWeight: 500,
                    borderRadius: 1,
                  }}
                />
              </ListItem>
              {index < sortedAppointments.length - 1 && (
                <Divider variant="inset" component="li" />
              )}
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
};

export default RecentAppointments; 