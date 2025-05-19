import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Autocomplete,
  Divider,
  Paper,
  Alert,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { v4 as uuidv4 } from 'uuid';
import { addAppointment } from '../../store/slices/appointmentsSlice';
import { Appointment, Patient, Staff } from '../../types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { format, differenceInYears } from 'date-fns';
import placeholderImages from '../../assets/images/placeholder';

const appointmentTypes = [
  { value: 'consultation', label: 'Consultation' },
  { value: 'follow-up', label: 'Follow-up' },
  { value: 'emergency', label: 'Emergency' },
  { value: 'surgery', label: 'Surgery' },
  { value: 'test', label: 'Test/Check-up' },
];

// Create time slots from 8:00 AM to 6:00 PM
const timeSlots = Array.from({ length: 21 }, (_, i) => {
  const hour = Math.floor(i / 2) + 8;
  const minute = (i % 2) * 30;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour;
  return {
    value: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
    label: `${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`,
  };
});

const BookAppointment: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const patients = useAppSelector((state) => state.patients.patients);
  const doctors = useAppSelector((state) => 
    state.staff.staff.filter(staff => staff.role === 'doctor')
  );
  
  const [success, setSuccess] = useState(false);

  // Formik validation schema
  const validationSchema = Yup.object({
    patientId: Yup.string().required('Patient is required'),
    doctorId: Yup.string().required('Doctor is required'),
    date: Yup.date()
      .required('Date is required')
      .min(new Date(), 'Appointment date cannot be in the past'),
    time: Yup.string().required('Time is required'),
    type: Yup.string().required('Appointment type is required'),
    notes: Yup.string(),
    reason: Yup.string().required('Reason for appointment is required'),
  });

  // Formik form handling
  const formik = useFormik({
    initialValues: {
      patientId: '',
      doctorId: '',
      date: format(new Date().setHours(0, 0, 0, 0), 'yyyy-MM-dd'),
      time: '',
      type: '',
      notes: '',
      reason: '',
    },
    validationSchema,
    onSubmit: (values) => {
      const newAppointment: Appointment = {
        id: uuidv4(),
        patientId: values.patientId,
        doctorId: values.doctorId,
        date: values.date,
        time: values.time,
        status: 'scheduled',
        type: values.type as 'consultation' | 'follow-up' | 'emergency' | 'surgery' | 'test',
        notes: values.notes,
        reason: values.reason,
      };
      
      dispatch(addAppointment(newAppointment));
      setSuccess(true);
      
      // Reset form or navigate away after short delay
      setTimeout(() => {
        navigate('/appointments');
      }, 1500);
    },
  });

  // Get patient details for display
  const selectedPatient = patients.find(patient => patient.id === formik.values.patientId);
  
  // Get doctor details for display
  const selectedDoctor = doctors.find(doctor => doctor.id === formik.values.doctorId);

  const handleCancel = () => {
    navigate('/appointments');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Book New Appointment
      </Typography>
      
      {success && (
        <Alert severity="success" sx={{ mb: 4 }}>
          Appointment booked successfully! Redirecting...
        </Alert>
      )}
      
      <Grid container spacing={4}>
        <Box width={{ xs: '100%', md: '66.67%' }} px={2}>
          <Card>
            <CardContent>
              <form onSubmit={formik.handleSubmit}>
                <Typography variant="h6" gutterBottom>
                  Appointment Details
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={3}>
                  <Box width={{ xs: '100%', md: '50%' }} px={1.5}>
                    <FormControl fullWidth error={formik.touched.patientId && Boolean(formik.errors.patientId)}>
                      <Autocomplete
                        id="patientId"
                        options={patients}
                        getOptionLabel={(option) => option.name}
                        onChange={(e, value) => formik.setFieldValue('patientId', value ? value.id : '')}
                        renderInput={(params) => (
                          <TextField 
                            {...params} 
                            label="Select Patient" 
                            error={formik.touched.patientId && Boolean(formik.errors.patientId)}
                            helperText={formik.touched.patientId && formik.errors.patientId}
                          />
                        )}
                      />
                    </FormControl>
                  </Box>
                  
                  <Box width={{ xs: '100%', md: '50%' }} px={1.5}>
                    <FormControl fullWidth error={formik.touched.doctorId && Boolean(formik.errors.doctorId)}>
                      <Autocomplete
                        id="doctorId"
                        options={doctors}
                        getOptionLabel={(option) => `Dr. ${option.name} (${option.specialization || 'General'})`}
                        onChange={(e, value) => formik.setFieldValue('doctorId', value ? value.id : '')}
                        renderInput={(params) => (
                          <TextField 
                            {...params} 
                            label="Select Doctor" 
                            error={formik.touched.doctorId && Boolean(formik.errors.doctorId)}
                            helperText={formik.touched.doctorId && formik.errors.doctorId}
                          />
                        )}
                      />
                    </FormControl>
                  </Box>
                  
                  <Box width={{ xs: '100%', md: '50%' }} px={1.5}>
                    <TextField
                      fullWidth
                      id="date"
                      name="date"
                      label="Appointment Date"
                      type="date"
                      value={formik.values.date}
                      onChange={formik.handleChange}
                      error={formik.touched.date && Boolean(formik.errors.date)}
                      helperText={formik.touched.date && formik.errors.date}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Box>
                  
                  <Box width={{ xs: '100%', md: '50%' }} px={1.5}>
                    <FormControl 
                      fullWidth 
                      error={formik.touched.time && Boolean(formik.errors.time)}
                    >
                      <InputLabel id="time-label">Appointment Time</InputLabel>
                      <Select
                        labelId="time-label"
                        id="time"
                        name="time"
                        value={formik.values.time}
                        onChange={formik.handleChange}
                        label="Appointment Time"
                      >
                        {timeSlots.map(slot => (
                          <MenuItem key={slot.value} value={slot.value}>
                            {slot.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {formik.touched.time && formik.errors.time && (
                        <FormHelperText>{formik.errors.time}</FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                  
                  <Box width="100%" px={1.5}>
                    <FormControl 
                      fullWidth 
                      error={formik.touched.type && Boolean(formik.errors.type)}
                    >
                      <InputLabel id="type-label">Appointment Type</InputLabel>
                      <Select
                        labelId="type-label"
                        id="type"
                        name="type"
                        value={formik.values.type}
                        onChange={formik.handleChange}
                        label="Appointment Type"
                      >
                        {appointmentTypes.map(type => (
                          <MenuItem key={type.value} value={type.value}>
                            {type.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {formik.touched.type && formik.errors.type && (
                        <FormHelperText>{formik.errors.type}</FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                  
                  <Box width="100%" px={1.5}>
                    <TextField
                      fullWidth
                      id="reason"
                      name="reason"
                      label="Reason for Appointment"
                      value={formik.values.reason}
                      onChange={formik.handleChange}
                      error={formik.touched.reason && Boolean(formik.errors.reason)}
                      helperText={formik.touched.reason && formik.errors.reason}
                      multiline
                      rows={2}
                    />
                  </Box>
                  
                  <Box width="100%" px={1.5}>
                    <TextField
                      fullWidth
                      id="notes"
                      name="notes"
                      label="Additional Notes"
                      value={formik.values.notes}
                      onChange={formik.handleChange}
                      error={formik.touched.notes && Boolean(formik.errors.notes)}
                      helperText={formik.touched.notes && formik.errors.notes}
                      multiline
                      rows={4}
                    />
                  </Box>
                </Grid>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                  <Button 
                    variant="outlined" 
                    onClick={handleCancel}
                    sx={{ mr: 2 }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="contained" 
                    type="submit"
                    disabled={formik.isSubmitting || success}
                  >
                    Book Appointment
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Box>
        
        <Box width={{ xs: '100%', md: '33.33%' }} px={2}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Appointment Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {selectedPatient && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Patient Information
                  </Typography>
                  <Box sx={{ 
                    p: 2, 
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                    borderRadius: 1,
                  }}>
                    <Typography variant="body2">
                      <strong>Name:</strong> {selectedPatient.name}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Age:</strong> {differenceInYears(new Date(), new Date(selectedPatient.dateOfBirth))} years
                    </Typography>
                    <Typography variant="body2">
                      <strong>Gender:</strong> {selectedPatient.gender.charAt(0).toUpperCase() + selectedPatient.gender.slice(1)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Blood Group:</strong> {selectedPatient.bloodGroup || 'Not specified'}
                    </Typography>
                  </Box>
                </Box>
              )}
              
              {selectedDoctor && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Doctor Information
                  </Typography>
                  <Box sx={{ 
                    p: 2, 
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                    borderRadius: 1,
                  }}>
                    <Typography variant="body2">
                      <strong>Name:</strong> Dr. {selectedDoctor.name}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Specialization:</strong> {selectedDoctor.specialization || 'General'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Department:</strong> {selectedDoctor.department}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Experience:</strong> {selectedDoctor.experience || 'Not specified'}
                    </Typography>
                  </Box>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <img 
                  src={placeholderImages.appointment} 
                  alt="Book appointment" 
                  style={{ 
                    maxWidth: '100%', 
                    height: 'auto',
                    borderRadius: '8px'
                  }} 
                />
              </Box>
              
              <Box sx={{ p: 2, bgcolor: theme.palette.primary.main, color: 'white', borderRadius: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  Important Notice
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Please arrive 15 minutes before your appointment time. Bring your ID and insurance card if applicable.
                  Cancellations should be made at least 24 hours in advance.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Grid>
    </Box>
  );
};

export default BookAppointment; 