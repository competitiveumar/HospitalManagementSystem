import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  InputAdornment,
  Card,
  Button,
  Chip,
  Pagination,
  Menu,
  MenuItem,
  ListItemIcon,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { LabTest } from '../../types';
import { updateLabTestStatus, filterLabTestsByStatus } from '../../store/slices/labTestsSlice';
import Grid from '../common/Grid';

// Status colors for displaying in the UI
const statusColors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  requested: 'warning',
  in_progress: 'info',
  completed: 'success',
};

const TestResults: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const labTests = useAppSelector((state) => state.labTests.filteredTests);
  const patients = useAppSelector((state) => state.patients.patients);
  const staff = useAppSelector((state) => state.staff.staff);
  const currentUser = useAppSelector((state) => state.auth.user);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Dialog state for entering test results
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
  const [resultData, setResultData] = useState({
    results: '',
    resultDate: new Date().toISOString().split('T')[0],
    notes: '',
  });
  
  // Initially filter to show pending tests
  useEffect(() => {
    // Show all tests by default
    dispatch(filterLabTestsByStatus('in_progress'));
    setStatusFilter('in_progress');
  }, [dispatch]);
  
  // Get patient name from ID
  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.name : 'Unknown Patient';
  };
  
  // Get doctor name from ID
  const getDoctorName = (doctorId: string) => {
    const doctor = staff.find(s => s.id === doctorId);
    return doctor ? doctor.name : 'Unknown Doctor';
  };
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };
  
  const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };
  
  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    const status = event.target.value;
    setStatusFilter(status);
    
    if (status === 'all') {
      // Reset filters
      dispatch({ type: 'labTests/resetLabTestFilters' });
    } else {
      dispatch(filterLabTestsByStatus(status as LabTest['status']));
    }
    
    setPage(1);
  };
  
  const handleOpenResultDialog = (test: LabTest) => {
    setSelectedTest(test);
    setResultData({
      results: test.results || '',
      resultDate: test.resultDate || new Date().toISOString().split('T')[0],
      notes: test.notes || '',
    });
    setResultDialogOpen(true);
  };
  
  const handleCloseResultDialog = () => {
    setResultDialogOpen(false);
    setSelectedTest(null);
  };
  
  const handleResultInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setResultData({
        ...resultData,
        [name]: value,
      });
    }
  };
  
  const handleSaveResults = () => {
    if (selectedTest) {
      dispatch(updateLabTestStatus({
        testId: selectedTest.id,
        status: 'completed',
        results: resultData.results,
        resultDate: resultData.resultDate,
        technicianId: currentUser?.id,
      }));
      
      handleCloseResultDialog();
    }
  };
  
  // Filter tests based on search term
  const filteredTests = labTests.filter((test) => {
    const searchStr = searchTerm.toLowerCase();
    const patientName = getPatientName(test.patientId).toLowerCase();
    const doctorName = getDoctorName(test.doctorId).toLowerCase();
    const testType = test.testType.toLowerCase();
    
    return (
      patientName.includes(searchStr) ||
      doctorName.includes(searchStr) ||
      testType.includes(searchStr)
    );
  });
  
  // Paginate results
  const paginatedTests = filteredTests.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  
  const totalPages = Math.ceil(filteredTests.length / rowsPerPage);
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Test Results
      </Typography>
      
      <Card sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={6}>
            <TextField
              placeholder="Search tests..."
              value={searchTerm}
              onChange={handleSearchChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                value={statusFilter}
                label="Status"
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="requested">Requested</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        <TableContainer component={Paper} elevation={0}>
          <Table aria-label="lab test results table">
            <TableHead>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Test Type</TableCell>
                <TableCell>Doctor</TableCell>
                <TableCell>Request Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Result Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTests.map((test) => (
                <TableRow key={test.id} hover>
                  <TableCell>{getPatientName(test.patientId)}</TableCell>
                  <TableCell>{test.testType}</TableCell>
                  <TableCell>Dr. {getDoctorName(test.doctorId)}</TableCell>
                  <TableCell>{new Date(test.requestDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={test.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      color={statusColors[test.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {test.resultDate ? new Date(test.resultDate).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell align="right">
                    {test.status === 'requested' && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                          dispatch(updateLabTestStatus({
                            testId: test.id,
                            status: 'in_progress',
                            technicianId: currentUser?.id,
                          }));
                        }}
                      >
                        Start Process
                      </Button>
                    )}
                    {test.status === 'in_progress' && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="success"
                        onClick={() => handleOpenResultDialog(test)}
                      >
                        Enter Results
                      </Button>
                    )}
                    {test.status === 'completed' && (
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => navigate(`/lab-tests/view/${test.id}`)}
                      >
                        <ViewIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {paginatedTests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" sx={{ py: 2 }}>
                      No lab tests found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handleChangePage}
            color="primary"
          />
        </Box>
      </Card>
      
      {/* Test Result Dialog */}
      <Dialog 
        open={resultDialogOpen} 
        onClose={handleCloseResultDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Enter Test Results
        </DialogTitle>
        <DialogContent>
          {selectedTest && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Patient: {getPatientName(selectedTest.patientId)}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Test: {selectedTest.testType}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Requested by: Dr. {getDoctorName(selectedTest.doctorId)}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  name="resultDate"
                  label="Result Date"
                  type="date"
                  value={resultData.resultDate}
                  onChange={handleResultInputChange}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  name="results"
                  label="Test Results"
                  value={resultData.results}
                  onChange={handleResultInputChange}
                  fullWidth
                  required
                  multiline
                  rows={4}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  name="notes"
                  label="Additional Notes"
                  value={resultData.notes}
                  onChange={handleResultInputChange}
                  fullWidth
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResultDialog}>Cancel</Button>
          <Button onClick={handleSaveResults} variant="contained" color="primary">
            Save Results
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TestResults; 