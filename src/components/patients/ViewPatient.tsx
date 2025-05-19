import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Avatar,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
} from '@mui/material';
import {
  MedicalServices as MedicalIcon,
  Event as EventIcon,
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Home as AddressIcon,
  Cake as BirthdayIcon,
  Bloodtype as BloodIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { selectPatient } from '../../store/slices/patientsSlice';
import Grid from '../common/Grid';

const ViewPatient: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { patientId } = useParams<{ patientId: string }>();
  
  const selectedPatient = useAppSelector((state) => state.patients.selectedPatient);
  
  useEffect(() => {
    if (patientId) {
      dispatch(selectPatient(patientId));
    }
  }, [dispatch, patientId]);
  
  if (!selectedPatient) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <Typography>Loading patient details...</Typography>
      </Box>
    );
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/patients')}
        >
          Back to Patients
        </Button>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/patients/edit/${patientId}`)}
        >
          Edit Patient
        </Button>
      </Box>
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={2} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Avatar
                src={selectedPatient.profileImage}
                alt={selectedPatient.name}
                sx={{ width: 100, height: 100 }}
              />
            </Grid>
            <Grid item xs={12} sm={10}>
              <Typography variant="h4" gutterBottom>
                {selectedPatient.name}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Chip 
                  label={selectedPatient.gender.charAt(0).toUpperCase() + selectedPatient.gender.slice(1)} 
                  color={selectedPatient.gender === 'male' ? 'primary' : 'secondary'}
                  size="small"
                />
                {selectedPatient.bloodGroup && (
                  <Chip 
                    icon={<BloodIcon />}
                    label={`Blood Group: ${selectedPatient.bloodGroup}`}
                    variant="outlined"
                    size="small"
                  />
                )}
                <Chip 
                  icon={<TimeIcon />}
                  label={`Registered: ${new Date(selectedPatient.registrationDate).toLocaleDateString()}`}
                  variant="outlined"
                  size="small"
                />
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">{selectedPatient.phone}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">{selectedPatient.email}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <BirthdayIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {new Date(selectedPatient.dateOfBirth).toLocaleDateString()}
                      {' '}
                      ({new Date().getFullYear() - new Date(selectedPatient.dateOfBirth).getFullYear()} years)
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              
              {selectedPatient.address && (
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 1 }}>
                  <AddressIcon fontSize="small" sx={{ mr: 1, mt: 0.3, color: 'text.secondary' }} />
                  <Typography variant="body2">{selectedPatient.address}</Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      <Grid container spacing={3}>
        {/* Medical Records Summary */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                <MedicalIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Medical Records
              </Typography>
              <Button 
                variant="contained" 
                size="small"
                onClick={() => navigate(`/patients/records/${patientId}`)}
              >
                View All Records
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {!selectedPatient.medicalHistory || selectedPatient.medicalHistory.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                No medical records available
              </Typography>
            ) : (
              <List>
                {selectedPatient.medicalHistory.slice(0, 3).map((record) => (
                  <ListItem key={record.id} divider>
                    <ListItemIcon>
                      <MedicalIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={record.diagnosis}
                      secondary={`${new Date(record.date).toLocaleDateString()} - ${record.treatment.substring(0, 60)}${record.treatment.length > 60 ? '...' : ''}`}
                    />
                  </ListItem>
                ))}
                {selectedPatient.medicalHistory.length > 3 && (
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Button 
                      variant="text" 
                      size="small"
                      onClick={() => navigate(`/patients/records/${patientId}`)}
                    >
                      View {selectedPatient.medicalHistory.length - 3} more records
                    </Button>
                  </Box>
                )}
              </List>
            )}
          </Paper>
        </Grid>
        
        {/* Recent Appointments */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                <EventIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Recent Appointments
              </Typography>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => navigate('/appointments')}
              >
                View All
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
              No recent appointments found
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViewPatient; 