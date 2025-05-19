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
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  Add as AddIcon,
  GetApp as ExportIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { LabTest } from '../../types';
import { filterLabTestsByStatus, filterLabTestsByType, resetLabTestFilters } from '../../store/slices/labTestsSlice';
import Grid from '../common/Grid';

const statusColors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  requested: 'warning',
  in_progress: 'info',
  completed: 'success',
};

const AllTests: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const labTests = useAppSelector((state) => state.labTests.filteredTests);
  const patients = useAppSelector((state) => state.patients.patients);
  const staff = useAppSelector((state) => state.staff.staff);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('');

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

  // Get technician name from ID
  const getTechnicianName = (technicianId?: string) => {
    if (!technicianId) return 'Not Assigned';
    const technician = staff.find(s => s.id === technicianId);
    return technician ? technician.name : 'Unknown Technician';
  };

  useEffect(() => {
    // Reset filters on component mount
    dispatch(resetLabTestFilters());
  }, [dispatch]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, testId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedTestId(testId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTestId(null);
  };

  const handleView = () => {
    if (selectedTestId) {
      navigate(`/lab-tests/view/${selectedTestId}`);
    }
    handleMenuClose();
  };

  const handleEdit = () => {
    if (selectedTestId) {
      navigate(`/lab-tests/edit/${selectedTestId}`);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    // Would dispatch delete action here
    handleMenuClose();
  };

  const handleAddNew = () => {
    navigate('/lab-tests/request');
  };

  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    const status = event.target.value;
    setStatusFilter(status);
    
    if (status === 'all') {
      dispatch(resetLabTestFilters());
    } else {
      dispatch(filterLabTestsByStatus(status as LabTest['status']));
    }
    
    setPage(1);
  };

  const handleTypeFilterChange = (event: SelectChangeEvent) => {
    const type = event.target.value;
    setTypeFilter(type);
    
    if (type === '') {
      dispatch(resetLabTestFilters());
    } else {
      dispatch(filterLabTestsByType(type));
    }
    
    setPage(1);
  };

  const handleExportData = () => {
    const dataToExport = filteredTests.map(test => ({
      ID: test.id,
      Patient: getPatientName(test.patientId),
      Doctor: getDoctorName(test.doctorId),
      TestType: test.testType,
      RequestDate: test.requestDate,
      Status: test.status,
      Technician: getTechnicianName(test.technicianId),
      ResultDate: test.resultDate || 'N/A',
    }));
    
    // Convert to CSV
    const headers = Object.keys(dataToExport[0]).join(',');
    const csv = dataToExport.map(row => Object.values(row).join(',')).join('\n');
    const csvData = `${headers}\n${csv}`;
    
    // Create download link
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `lab_tests_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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

  // Get unique test types for filter dropdown
  const testTypes = Array.from(new Set(labTests.map(test => test.testType)));

  // Paginate results
  const paginatedTests = filteredTests.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const totalPages = Math.ceil(filteredTests.length / rowsPerPage);

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Laboratory Tests
      </Typography>

      <Card sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={4}>
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
          <Grid item xs={12} md={3}>
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
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="type-filter-label">Test Type</InputLabel>
              <Select
                labelId="type-filter-label"
                value={typeFilter}
                label="Test Type"
                onChange={handleTypeFilterChange}
              >
                <MenuItem value="">All Types</MenuItem>
                {testTypes.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddNew}
              fullWidth
              size="small"
            >
              Request Test
            </Button>
          </Grid>
        </Grid>

        <TableContainer component={Paper} elevation={0}>
          <Table aria-label="lab tests table">
            <TableHead>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Test Type</TableCell>
                <TableCell>Doctor</TableCell>
                <TableCell>Request Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Technician</TableCell>
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
                  <TableCell>{getTechnicianName(test.technicianId)}</TableCell>
                  <TableCell>{test.resultDate ? new Date(test.resultDate).toLocaleDateString() : '-'}</TableCell>
                  <TableCell align="right">
                    <IconButton 
                      onClick={(event) => handleMenuOpen(event, test.id)}
                      size="small"
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedTests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body2" sx={{ py: 2 }}>
                      No lab tests found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ExportIcon />}
            size="small"
            onClick={handleExportData}
            disabled={filteredTests.length === 0}
          >
            Export
          </Button>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handleChangePage}
            color="primary"
          />
        </Box>
      </Card>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleView}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          View Details
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default AllTests; 