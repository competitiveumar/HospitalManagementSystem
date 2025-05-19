import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Divider,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Alert,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { LabTest } from '../../types';
import { selectLabTest, clearSelectedLabTest } from '../../store/slices/labTestsSlice';
import Grid from '../common/Grid';

// Status colors for displaying in the UI
const statusColors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  requested: 'warning',
  in_progress: 'info',
  completed: 'success',
};

const ViewTest: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { testId } = useParams<{ testId: string }>();
  
  const selectedTest = useAppSelector((state) => state.labTests.selectedTest);
  const patients = useAppSelector((state) => state.patients.patients);
  const staff = useAppSelector((state) => state.staff.staff);
  
  useEffect(() => {
    if (testId) {
      dispatch(selectLabTest(testId));
    }
    
    return () => {
      dispatch(clearSelectedLabTest());
    };
  }, [dispatch, testId]);
  
  // Get patient data
  const getPatient = (patientId: string) => {
    return patients.find(p => p.id === patientId);
  };
  
  // Get doctor data
  const getDoctor = (doctorId: string) => {
    return staff.find(s => s.id === doctorId);
  };
  
  // Get technician data
  const getTechnician = (technicianId?: string) => {
    if (!technicianId) return null;
    return staff.find(s => s.id === technicianId);
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  if (!selectedTest) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <Typography>Loading test details...</Typography>
      </Box>
    );
  }
  
  const patient = getPatient(selectedTest.patientId);
  const doctor = getDoctor(selectedTest.doctorId);
  const technician = getTechnician(selectedTest.technicianId);
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/lab-tests')}
        >
          Back to Tests
        </Button>
        
        {selectedTest.status === 'completed' && (
          <Box>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
              sx={{ mr: 1 }}
            >
              Print
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              sx={{ mr: 1 }}
            >
              Download PDF
            </Button>
            <Button
              variant="outlined"
              startIcon={<EmailIcon />}
            >
              Email Results
            </Button>
          </Box>
        )}
      </Box>
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h5">Lab Test Report</Typography>
            <Chip
              label={selectedTest.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              color={statusColors[selectedTest.status]}
            />
          </Box>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: 'bold', width: '40%' }}>
                        Test ID
                      </TableCell>
                      <TableCell>{selectedTest.id}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: 'bold' }}>
                        Test Type
                      </TableCell>
                      <TableCell>{selectedTest.testType}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: 'bold' }}>
                        Request Date
                      </TableCell>
                      <TableCell>{new Date(selectedTest.requestDate).toLocaleDateString()}</TableCell>
                    </TableRow>
                    {selectedTest.resultDate && (
                      <TableRow>
                        <TableCell component="th" sx={{ fontWeight: 'bold' }}>
                          Result Date
                        </TableCell>
                        <TableCell>{new Date(selectedTest.resultDate).toLocaleDateString()}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: 'bold', width: '40%' }}>
                        Patient Name
                      </TableCell>
                      <TableCell>{patient?.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: 'bold' }}>
                        Requesting Doctor
                      </TableCell>
                      <TableCell>Dr. {doctor?.name}</TableCell>
                    </TableRow>
                    {technician && (
                      <TableRow>
                        <TableCell component="th" sx={{ fontWeight: 'bold' }}>
                          Lab Technician
                        </TableCell>
                        <TableCell>{technician.name}</TableCell>
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: 'bold' }}>
                        Patient Email
                      </TableCell>
                      <TableCell>{patient?.email}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
          
          {selectedTest.status !== 'completed' ? (
            <Alert severity="info" sx={{ mt: 3 }}>
              This test is still {selectedTest.status === 'requested' ? 'awaiting processing' : 'in progress'}. Results will be available once completed.
            </Alert>
          ) : (
            <>
              <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                Test Results
              </Typography>
              <Paper variant="outlined" sx={{ p: 3, bgcolor: 'background.default' }}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                  {selectedTest.results}
                </Typography>
              </Paper>
              
              {selectedTest.notes && (
                <>
                  <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                    Additional Notes
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 3, bgcolor: 'background.default' }}>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                      {selectedTest.notes}
                    </Typography>
                  </Paper>
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ViewTest; 