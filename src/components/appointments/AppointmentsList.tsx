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
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
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
  EventNote as CalendarIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/reduxHooks';
import { format } from 'date-fns';
import placeholderImages from '../../assets/images/placeholder';
import Grid from '../common/Grid';

// Status colors
const statusColors = {
  scheduled: 'info',
  confirmed: 'primary',
  completed: 'success',
  cancelled: 'error',
  'no-show': 'warning',
};

const AppointmentsList: React.FC = () => {
  const navigate = useNavigate();
  const appointments = useAppSelector((state) => state.appointments.appointments);
  const patients = useAppSelector((state) => state.patients.patients);
  const staff = useAppSelector((state) => state.staff.staff);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, appointmentId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedAppointmentId(appointmentId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAppointmentId(null);
  };

  const handleView = () => {
    if (selectedAppointmentId) {
      navigate(`/appointments/${selectedAppointmentId}`);
    }
    handleMenuClose();
  };

  const handleEdit = () => {
    if (selectedAppointmentId) {
      navigate(`/appointments/edit/${selectedAppointmentId}`);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    // Would dispatch delete action here
    handleMenuClose();
  };

  const handleAddNew = () => {
    navigate('/appointments/book');
  };

  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
    setPage(1);
  };

  const handleDateFilterChange = (event: SelectChangeEvent) => {
    setDateFilter(event.target.value);
    setPage(1);
  };

  // Get the patient name for an appointment
  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.name : 'Unknown Patient';
  };

  // Get the doctor name for an appointment
  const getDoctorName = (doctorId: string) => {
    const doctor = staff.find(s => s.id === doctorId && s.role === 'doctor');
    return doctor ? doctor.name : 'Unknown Doctor';
  };

  // Calculate today's, yesterday's and tomorrow's date for filtering
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  // Filter appointments based on search term, status and date
  const filteredAppointments = appointments.filter((appointment) => {
    const patientName = getPatientName(appointment.patientId).toLowerCase();
    const doctorName = getDoctorName(appointment.doctorId).toLowerCase();
    const searchStr = searchTerm.toLowerCase();
    const matchesSearch = 
      patientName.includes(searchStr) || 
      doctorName.includes(searchStr) ||
      appointment.type.toLowerCase().includes(searchStr);
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter === 'today') {
      matchesDate = appointment.date === today;
    } else if (dateFilter === 'tomorrow') {
      matchesDate = appointment.date === tomorrow;
    } else if (dateFilter === 'yesterday') {
      matchesDate = appointment.date === yesterday;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Paginate results
  const paginatedAppointments = filteredAppointments.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const totalPages = Math.ceil(filteredAppointments.length / rowsPerPage);

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Appointments Management
      </Typography>

      <Card sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Box width={{ xs: '100%', md: '33.33%' }} px={1}>
            <TextField
              placeholder="Search appointments..."
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
          </Box>
          <Box width={{ xs: '100%', md: '25%' }} px={1}>
            <FormControl fullWidth size="small">
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                value={statusFilter}
                label="Status"
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="scheduled">Scheduled</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
                <MenuItem value="no-show">No Show</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box width={{ xs: '100%', md: '25%' }} px={1}>
            <FormControl fullWidth size="small">
              <InputLabel id="date-filter-label">Date</InputLabel>
              <Select
                labelId="date-filter-label"
                value={dateFilter}
                label="Date"
                onChange={handleDateFilterChange}
              >
                <MenuItem value="all">All Dates</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="tomorrow">Tomorrow</MenuItem>
                <MenuItem value="yesterday">Yesterday</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box width={{ xs: '100%', md: '16.67%' }} px={1} display="flex" justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddNew}
              fullWidth
              sx={{ height: '100%' }}
            >
              New Appointment
            </Button>
          </Box>
        </Grid>

        <TableContainer component={Paper} elevation={0}>
          <Table aria-label="appointments table">
            <TableHead>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Doctor</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedAppointments.map((appointment) => {
                const patientName = getPatientName(appointment.patientId);
                const doctorName = getDoctorName(appointment.doctorId);
                
                return (
                  <TableRow key={appointment.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          src={placeholderImages.patient} 
                          alt={patientName} 
                          sx={{ mr: 2 }}
                        />
                        <Typography variant="body2">{patientName}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          src={placeholderImages.doctor} 
                          alt={doctorName} 
                          sx={{ mr: 2 }}
                        />
                        <Typography variant="body2">{doctorName}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {format(new Date(appointment.date), 'dd MMM yyyy')}
                    </TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>
                      <Chip 
                        label={appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)} 
                        size="small"
                        color="default"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1).replace('-', ' ')} 
                        size="small"
                        color={statusColors[appointment.status] as any}
                        variant="filled"
                        icon={
                          appointment.status === 'completed' ? <CheckIcon fontSize="small" /> : 
                          appointment.status === 'cancelled' ? <CloseIcon fontSize="small" /> :
                          appointment.status === 'confirmed' ? <CalendarIcon fontSize="small" /> :
                          undefined
                        }
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        onClick={(event) => handleMenuOpen(event, appointment.id)}
                        size="small"
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
              {paginatedAppointments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" sx={{ py: 2 }}>
                      No appointments found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Showing {paginatedAppointments.length} of {filteredAppointments.length} appointments
          </Typography>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handleChangePage}
            color="primary"
            size="small"
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
          Cancel Appointment
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default AppointmentsList; 