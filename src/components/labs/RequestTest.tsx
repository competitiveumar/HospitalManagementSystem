import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  FormHelperText,
  Divider,
  Alert,
  SelectChangeEvent,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { addLabTest } from '../../store/slices/labTestsSlice';
import { v4 as uuidv4 } from 'uuid';
import Grid from '../common/Grid';

// Common lab test types for selection
const commonTestTypes = [
  'Blood Pressure',
  'Blood Sugar (Fasting)',
  'Blood Sugar (Post-Prandial)',
  'Complete Blood Count (CBC)',
  'Lipid Profile',
  'Liver Function Test',
  'Kidney Function Test',
  'Thyroid Function Test',
  'HbA1c',
  'Chest X-Ray',
  'Urinalysis',
  'Electrocardiogram (ECG)',
  'COVID-19 PCR Test',
];

const RequestTest: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const patients = useAppSelector((state) => state.patients.patients);
  const staff = useAppSelector((state) => state.staff.staff);
  const currentUser = useAppSelector((state) => state.auth.user);
  
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: currentUser?.role === 'doctor' ? currentUser.id : '',
    testType: '',
    requestDate: new Date().toISOString().split('T')[0],
    notes: '',
    status: 'requested' as 'requested' | 'in_progress' | 'completed',
  });
  
  const [customTestType, setCustomTestType] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  
  // Generic input change handler for both TextField and Select
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData({
        ...formData,
        [name]: value,
      });
      
      // Clear error when field is edited
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: '',
        });
      }
    }
  };
  
  // Specific handler for Select components
  const handleSelectChange = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name as string]: value,
    });
    
    // Clear error when field is edited
    if (name && errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };
  
  const handleTestTypeChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    
    if (value === 'custom') {
      setFormData({
        ...formData,
        testType: '',
      });
    } else {
      setFormData({
        ...formData,
        testType: value,
      });
      setCustomTestType('');
    }
    
    if (errors.testType) {
      setErrors({
        ...errors,
        testType: '',
      });
    }
  };
  
  const handleCustomTestTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomTestType(e.target.value);
    
    setFormData({
      ...formData,
      testType: e.target.value,
    });
    
    if (errors.testType) {
      setErrors({
        ...errors,
        testType: '',
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.patientId) newErrors.patientId = 'Patient is required';
    if (!formData.doctorId) newErrors.doctorId = 'Doctor is required';
    if (!formData.testType) newErrors.testType = 'Test type is required';
    if (!formData.requestDate) newErrors.requestDate = 'Request date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      dispatch(addLabTest(formData));
      setSubmitted(true);
      
      // Reset form after submission
      setTimeout(() => {
        navigate('/lab-tests');
      }, 1500);
    }
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
          Request Laboratory Test
        </Typography>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/lab-tests')}
        >
          Back to Tests
        </Button>
      </Box>
      
      {submitted && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Test request submitted successfully! Redirecting...
        </Alert>
      )}
      
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.patientId}>
                <InputLabel id="patient-label">Patient</InputLabel>
                <Select
                  labelId="patient-label"
                  name="patientId"
                  value={formData.patientId}
                  label="Patient"
                  onChange={handleSelectChange}
                >
                  {patients.map(patient => (
                    <MenuItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.patientId && <FormHelperText>{errors.patientId}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.doctorId}>
                <InputLabel id="doctor-label">Doctor</InputLabel>
                <Select
                  labelId="doctor-label"
                  name="doctorId"
                  value={formData.doctorId}
                  label="Doctor"
                  onChange={handleSelectChange}
                  disabled={currentUser?.role === 'doctor'}
                >
                  {staff
                    .filter(s => s.role === 'doctor')
                    .map(doctor => (
                      <MenuItem key={doctor.id} value={doctor.id}>
                        Dr. {doctor.name}
                      </MenuItem>
                    ))}
                </Select>
                {errors.doctorId && <FormHelperText>{errors.doctorId}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.testType}>
                <InputLabel id="test-type-label">Test Type</InputLabel>
                <Select
                  labelId="test-type-label"
                  value={formData.testType || 'custom'}
                  label="Test Type"
                  onChange={handleTestTypeChange}
                >
                  {commonTestTypes.map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                  <MenuItem value="custom">Other (specify)</MenuItem>
                </Select>
                {errors.testType && <FormHelperText>{errors.testType}</FormHelperText>}
              </FormControl>
            </Grid>
            
            {(formData.testType === '' || customTestType) && (
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Custom Test Type"
                  value={customTestType}
                  onChange={handleCustomTestTypeChange}
                  fullWidth
                  error={!!errors.testType}
                  helperText={errors.testType}
                />
              </Grid>
            )}
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="requestDate"
                label="Request Date"
                type="date"
                value={formData.requestDate}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.requestDate}
                helperText={errors.requestDate}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="notes"
                label="Additional Notes"
                value={formData.notes}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={3}
                placeholder="Any specific instructions or observations"
              />
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSubmit}
              disabled={submitted}
            >
              Submit Test Request
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RequestTest; 