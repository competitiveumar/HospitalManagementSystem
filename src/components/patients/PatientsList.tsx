import React, { useState } from 'react';
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
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  Card,
  Button,
  Pagination,
  Menu,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  FormHelperText,
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  Add as AddIcon,
  GetApp as ExportIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { Patient } from '../../types';
import { addPatient } from '../../store/slices/patientsSlice';
import { v4 as uuidv4 } from 'uuid';
import Grid from '../common/Grid';

const PatientsList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const patients = useAppSelector((state) => state.patients.patients);
  const currentUser = useAppSelector((state) => state.auth.user);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  
  // Add new patient dialog
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newPatient, setNewPatient] = useState<Omit<Patient, 'id'>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    gender: 'male',
    registrationDate: new Date().toISOString().split('T')[0],
    bloodGroup: '',
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, patientId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedPatientId(patientId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPatientId(null);
  };

  const handleView = () => {
    if (selectedPatientId) {
      navigate(`/patients/${selectedPatientId}`);
    }
    handleMenuClose();
  };

  const handleEdit = () => {
    if (selectedPatientId) {
      navigate(`/patients/edit/${selectedPatientId}`);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    // Would dispatch delete action here
    handleMenuClose();
  };

  const handleAddNew = () => {
    setAddDialogOpen(true);
  };

  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
    setNewPatient({
      name: '',
      email: '',
      phone: '',
      address: '',
      dateOfBirth: '',
      gender: 'male',
      registrationDate: new Date().toISOString().split('T')[0],
      bloodGroup: '',
    });
    setErrors({});
  };

  const handlePatientInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setNewPatient({
        ...newPatient,
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

  const handleGenderChange = (event: SelectChangeEvent) => {
    setNewPatient({
      ...newPatient,
      gender: event.target.value as 'male' | 'female' | 'other',
    });
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!newPatient.name.trim()) newErrors.name = 'Name is required';
    if (!newPatient.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(newPatient.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!newPatient.phone.trim()) newErrors.phone = 'Phone is required';
    if (!newPatient.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddPatient = () => {
    if (validateForm()) {
      dispatch(addPatient(newPatient));
      handleAddDialogClose();
    }
  };

  const handleExportData = () => {
    const dataToExport = filteredPatients.map(patient => ({
      ID: patient.id,
      Name: patient.name,
      Email: patient.email,
      Phone: patient.phone,
      Gender: patient.gender,
      DateOfBirth: patient.dateOfBirth,
      BloodGroup: patient.bloodGroup || 'N/A',
      RegistrationDate: patient.registrationDate
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
    a.setAttribute('download', `patients_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Filter patients based on search term
  const filteredPatients = patients.filter((patient) => {
    const searchStr = searchTerm.toLowerCase();
    return (
      patient.name.toLowerCase().includes(searchStr) ||
      patient.email.toLowerCase().includes(searchStr) ||
      patient.phone.toLowerCase().includes(searchStr)
    );
  });

  // Paginate results
  const paginatedPatients = filteredPatients.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const totalPages = Math.ceil(filteredPatients.length / rowsPerPage);

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Patients Management
      </Typography>

      <Card sx={{ p: 2, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <TextField
            placeholder="Search patients..."
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ minWidth: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            size="small"
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              size="small"
            >
              Filter
            </Button>
            <Button
              variant="outlined"
              startIcon={<ExportIcon />}
              size="small"
              onClick={handleExportData}
              disabled={filteredPatients.length === 0}
            >
              Export
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddNew}
              size="small"
            >
              Add Patient
            </Button>
          </Box>
        </Box>

        <TableContainer component={Paper} elevation={0}>
          <Table aria-label="patients table">
            <TableHead>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Registration Date</TableCell>
                <TableCell>Blood Group</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedPatients.map((patient) => (
                <TableRow key={patient.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        src={patient.profileImage} 
                        alt={patient.name} 
                        sx={{ mr: 2 }}
                      />
                      <Typography variant="body2">{patient.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)} 
                      size="small"
                      color={patient.gender === 'male' ? 'primary' : 'secondary'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{patient.phone}</TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell>{new Date(patient.registrationDate).toLocaleDateString()}</TableCell>
                  <TableCell>{patient.bloodGroup || 'N/A'}</TableCell>
                  <TableCell align="right">
                    <IconButton 
                      onClick={(event) => handleMenuOpen(event, patient.id)}
                      size="small"
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedPatients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" sx={{ py: 2 }}>
                      No patients found
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

      {/* Add Patient Dialog */}
      <Dialog 
        open={addDialogOpen} 
        onClose={handleAddDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Patient</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Full Name"
                value={newPatient.name}
                onChange={handlePatientInputChange}
                fullWidth
                required
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="email"
                label="Email"
                type="email"
                value={newPatient.email}
                onChange={handlePatientInputChange}
                fullWidth
                required
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="phone"
                label="Phone"
                value={newPatient.phone}
                onChange={handlePatientInputChange}
                fullWidth
                required
                error={!!errors.phone}
                helperText={errors.phone}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  name="gender"
                  value={newPatient.gender}
                  label="Gender"
                  onChange={handleGenderChange}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="dateOfBirth"
                label="Date of Birth"
                type="date"
                value={newPatient.dateOfBirth}
                onChange={handlePatientInputChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                error={!!errors.dateOfBirth}
                helperText={errors.dateOfBirth}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="bloodGroup"
                label="Blood Group"
                value={newPatient.bloodGroup}
                onChange={handlePatientInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="address"
                label="Address"
                value={newPatient.address}
                onChange={handlePatientInputChange}
                fullWidth
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Cancel</Button>
          <Button onClick={handleAddPatient} variant="contained">Add Patient</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientsList; 