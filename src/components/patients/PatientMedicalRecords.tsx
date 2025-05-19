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
  Button,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Chip,
  Tooltip,
  SelectChangeEvent,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Visibility as ViewIcon,
  MedicalServices as MedicalIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { MedicalRecord, Patient, Prescription } from '../../types';
import { addMedicalRecord, updateMedicalRecord, deleteMedicalRecord, selectPatient } from '../../store/slices/patientsSlice';
import { v4 as uuidv4 } from 'uuid';
import Grid from '../common/Grid';

const PatientMedicalRecords: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { patientId } = useParams<{ patientId: string }>();
  
  const patients = useAppSelector((state) => state.patients.patients);
  const selectedPatient = useAppSelector((state) => state.patients.selectedPatient);
  const currentUser = useAppSelector((state) => state.auth.user);
  const staff = useAppSelector((state) => state.staff.staff);
  
  const [recordDialogOpen, setRecordDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<MedicalRecord | null>(null);
  const [newRecord, setNewRecord] = useState<Omit<MedicalRecord, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    diagnosis: '',
    treatment: '',
    prescriptions: [],
    doctorId: currentUser?.id || '',
    notes: '',
  });
  const [newPrescription, setNewPrescription] = useState<Omit<Prescription, 'id'>>({
    medicationName: '',
    dosage: '',
    frequency: '',
    duration: '',
    notes: '',
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (patientId) {
      dispatch(selectPatient(patientId));
    }
  }, [dispatch, patientId]);

  // Reset form errors when changing fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setNewRecord({
        ...newRecord,
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

  const handlePrescriptionChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setNewPrescription({
        ...newPrescription,
        [name]: value,
      });
    }
  };

  const handleAddPrescription = () => {
    const prescription: Prescription = {
      ...newPrescription,
      id: uuidv4(),
    };
    
    setNewRecord({
      ...newRecord,
      prescriptions: [...newRecord.prescriptions, prescription],
    });
    
    // Reset prescription form
    setNewPrescription({
      medicationName: '',
      dosage: '',
      frequency: '',
      duration: '',
      notes: '',
    });
  };

  const handleRemovePrescription = (id: string) => {
    setNewRecord({
      ...newRecord,
      prescriptions: newRecord.prescriptions.filter(p => p.id !== id),
    });
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!newRecord.diagnosis.trim()) newErrors.diagnosis = 'Diagnosis is required';
    if (!newRecord.treatment.trim()) newErrors.treatment = 'Treatment is required';
    if (!newRecord.date) newErrors.date = 'Date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenAddDialog = () => {
    setIsEditing(false);
    setCurrentRecord(null);
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      diagnosis: '',
      treatment: '',
      prescriptions: [],
      doctorId: currentUser?.id || '',
      notes: '',
    });
    setErrors({});
    setRecordDialogOpen(true);
  };

  const handleOpenEditDialog = (record: MedicalRecord) => {
    setIsEditing(true);
    setCurrentRecord(record);
    setNewRecord({
      date: record.date,
      diagnosis: record.diagnosis,
      treatment: record.treatment,
      prescriptions: [...record.prescriptions],
      doctorId: record.doctorId,
      notes: record.notes || '',
    });
    setErrors({});
    setRecordDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setRecordDialogOpen(false);
  };

  const handleSaveRecord = () => {
    if (!patientId || !validateForm()) return;
    
    if (isEditing && currentRecord) {
      dispatch(updateMedicalRecord({
        patientId,
        record: {
          id: currentRecord.id,
          ...newRecord
        }
      }));
    } else {
      dispatch(addMedicalRecord({
        patientId,
        record: newRecord
      }));
    }
    
    handleCloseDialog();
  };

  const handleDeleteRecord = (recordId: string) => {
    if (patientId && window.confirm('Are you sure you want to delete this medical record?')) {
      dispatch(deleteMedicalRecord({
        patientId,
        recordId
      }));
    }
  };

  // Get doctor name by ID
  const getDoctorName = (doctorId: string) => {
    const doctor = staff.find(s => s.id === doctorId);
    return doctor ? doctor.name : 'Unknown Doctor';
  };

  // Add handleSelectChange function after the handleInputChange function
  const handleSelectChange = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
    const { name, value } = event.target;
    if (name) {
      setNewRecord({
        ...newRecord,
        [name]: value,
      });
    }
  };

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
        <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
          Medical Records: {selectedPatient.name}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          Add New Record
        </Button>
      </Box>

      {!selectedPatient.medicalHistory || selectedPatient.medicalHistory.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <MedicalIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No Medical Records
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            There are no medical records for this patient yet.
          </Typography>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={handleOpenAddDialog}>
            Add First Record
          </Button>
        </Card>
      ) : (
        <Box>
          {selectedPatient.medicalHistory.map((record) => (
            <Accordion key={record.id} sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Grid container alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {new Date(record.date).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">{record.diagnosis}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Dr. {getDoctorName(record.doctorId)}
                    </Typography>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Diagnosis:</Typography>
                    <Typography variant="body1" paragraph>{record.diagnosis}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Treatment:</Typography>
                    <Typography variant="body1" paragraph>{record.treatment}</Typography>
                  </Grid>
                  
                  {record.notes && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2">Notes:</Typography>
                      <Typography variant="body1" paragraph>{record.notes}</Typography>
                    </Grid>
                  )}
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Prescriptions:</Typography>
                    {record.prescriptions && record.prescriptions.length > 0 ? (
                      <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Medication</TableCell>
                              <TableCell>Dosage</TableCell>
                              <TableCell>Frequency</TableCell>
                              <TableCell>Duration</TableCell>
                              <TableCell>Notes</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {record.prescriptions.map((prescription) => (
                              <TableRow key={prescription.id}>
                                <TableCell>{prescription.medicationName}</TableCell>
                                <TableCell>{prescription.dosage}</TableCell>
                                <TableCell>{prescription.frequency}</TableCell>
                                <TableCell>{prescription.duration}</TableCell>
                                <TableCell>{prescription.notes}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No prescriptions added.
                      </Typography>
                    )}
                  </Grid>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenEditDialog(record)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteRecord(record.id)}
                  >
                    Delete
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}

      {/* Add/Edit Medical Record Dialog */}
      <Dialog 
        open={recordDialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {isEditing ? 'Edit Medical Record' : 'Add New Medical Record'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="date"
                label="Date"
                type="date"
                value={newRecord.date}
                onChange={handleInputChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                error={!!errors.date}
                helperText={errors.date}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="doctor-label">Doctor</InputLabel>
                <Select
                  labelId="doctor-label"
                  name="doctorId"
                  value={newRecord.doctorId}
                  label="Doctor"
                  onChange={handleSelectChange}
                >
                  {staff
                    .filter(s => s.role === 'doctor')
                    .map(doctor => (
                      <MenuItem key={doctor.id} value={doctor.id}>
                        Dr. {doctor.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="diagnosis"
                label="Diagnosis"
                value={newRecord.diagnosis}
                onChange={handleInputChange}
                fullWidth
                required
                error={!!errors.diagnosis}
                helperText={errors.diagnosis}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="treatment"
                label="Treatment"
                value={newRecord.treatment}
                onChange={handleInputChange}
                fullWidth
                required
                multiline
                rows={2}
                error={!!errors.treatment}
                helperText={errors.treatment}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="notes"
                label="Notes"
                value={newRecord.notes}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={2}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>
                <Chip label="Prescriptions" />
              </Divider>
            </Grid>
            
            {/* Existing Prescriptions */}
            {newRecord.prescriptions.length > 0 && (
              <Grid item xs={12}>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Medication</TableCell>
                        <TableCell>Dosage</TableCell>
                        <TableCell>Frequency</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell>Notes</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {newRecord.prescriptions.map((prescription) => (
                        <TableRow key={prescription.id}>
                          <TableCell>{prescription.medicationName}</TableCell>
                          <TableCell>{prescription.dosage}</TableCell>
                          <TableCell>{prescription.frequency}</TableCell>
                          <TableCell>{prescription.duration}</TableCell>
                          <TableCell>{prescription.notes}</TableCell>
                          <TableCell align="right">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleRemovePrescription(prescription.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            )}
            
            {/* Add Prescription Form */}
            <Grid item xs={12} sm={6}>
              <TextField
                name="medicationName"
                label="Medication Name"
                value={newPrescription.medicationName}
                onChange={handlePrescriptionChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="dosage"
                label="Dosage"
                value={newPrescription.dosage}
                onChange={handlePrescriptionChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="frequency"
                label="Frequency"
                value={newPrescription.frequency}
                onChange={handlePrescriptionChange}
                fullWidth
                placeholder="e.g., Twice daily"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="duration"
                label="Duration"
                value={newPrescription.duration}
                onChange={handlePrescriptionChange}
                fullWidth
                placeholder="e.g., 7 days"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="notes"
                label="Notes"
                value={newPrescription.notes}
                onChange={handlePrescriptionChange}
                fullWidth
                placeholder="e.g., Take with food"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleAddPrescription}
                disabled={!newPrescription.medicationName || !newPrescription.dosage}
                startIcon={<AddIcon />}
              >
                Add Prescription
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveRecord} variant="contained" color="primary">
            {isEditing ? 'Update Record' : 'Save Record'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientMedicalRecords; 