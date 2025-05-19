import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Patient, MedicalRecord } from '../../types';
import { mockPatients } from '../../utils/mockData';
import { v4 as uuidv4 } from 'uuid';

interface PatientsState {
  patients: Patient[];
  selectedPatient: Patient | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PatientsState = {
  patients: mockPatients,
  selectedPatient: null,
  isLoading: false,
  error: null,
};

const patientsSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    fetchPatientsStart: (state: PatientsState) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchPatientsSuccess: (state: PatientsState, action: PayloadAction<Patient[]>) => {
      state.patients = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    fetchPatientsFailure: (state: PatientsState, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    selectPatient: (state: PatientsState, action: PayloadAction<string>) => {
      state.selectedPatient = state.patients.find((patient: Patient) => patient.id === action.payload) || null;
    },
    clearSelectedPatient: (state: PatientsState) => {
      state.selectedPatient = null;
    },
    addPatient: (state: PatientsState, action: PayloadAction<Omit<Patient, 'id'>>) => {
      const newPatient: Patient = {
        ...action.payload,
        id: uuidv4(),
        registrationDate: new Date().toISOString().split('T')[0]
      };
      state.patients.push(newPatient);
    },
    updatePatient: (state: PatientsState, action: PayloadAction<Patient>) => {
      const index = state.patients.findIndex((patient: Patient) => patient.id === action.payload.id);
      if (index !== -1) {
        state.patients[index] = action.payload;
        if (state.selectedPatient && state.selectedPatient.id === action.payload.id) {
          state.selectedPatient = action.payload;
        }
      }
    },
    deletePatient: (state: PatientsState, action: PayloadAction<string>) => {
      state.patients = state.patients.filter((patient: Patient) => patient.id !== action.payload);
      if (state.selectedPatient && state.selectedPatient.id === action.payload) {
        state.selectedPatient = null;
      }
    },
    addMedicalRecord: (state: PatientsState, action: PayloadAction<{ patientId: string; record: Omit<MedicalRecord, 'id'> }>) => {
      const { patientId, record } = action.payload;
      const patient = state.patients.find((p: Patient) => p.id === patientId);
      
      if (patient) {
        const newRecord: MedicalRecord = {
          ...record,
          id: uuidv4()
        };
        
        if (!patient.medicalHistory) {
          patient.medicalHistory = [];
        }
        
        patient.medicalHistory.push(newRecord);
        
        if (state.selectedPatient && state.selectedPatient.id === patientId) {
          state.selectedPatient = patient;
        }
      }
    },
    updateMedicalRecord: (state: PatientsState, action: PayloadAction<{ patientId: string; record: MedicalRecord }>) => {
      const { patientId, record } = action.payload;
      const patient = state.patients.find((p: Patient) => p.id === patientId);
      
      if (patient && patient.medicalHistory) {
        const recordIndex = patient.medicalHistory.findIndex((r: MedicalRecord) => r.id === record.id);
        
        if (recordIndex !== -1) {
          patient.medicalHistory[recordIndex] = record;
          
          if (state.selectedPatient && state.selectedPatient.id === patientId) {
            state.selectedPatient = patient;
          }
        }
      }
    },
    deleteMedicalRecord: (state: PatientsState, action: PayloadAction<{ patientId: string; recordId: string }>) => {
      const { patientId, recordId } = action.payload;
      const patient = state.patients.find((p: Patient) => p.id === patientId);
      
      if (patient && patient.medicalHistory) {
        patient.medicalHistory = patient.medicalHistory.filter((r: MedicalRecord) => r.id !== recordId);
        
        if (state.selectedPatient && state.selectedPatient.id === patientId) {
          state.selectedPatient = patient;
        }
      }
    }
  }
});

export const { 
  fetchPatientsStart,
  fetchPatientsSuccess,
  fetchPatientsFailure,
  selectPatient,
  clearSelectedPatient,
  addPatient,
  updatePatient,
  deletePatient,
  addMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord
} = patientsSlice.actions;

export default patientsSlice.reducer; 