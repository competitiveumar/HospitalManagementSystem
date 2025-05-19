import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Appointment } from '../../types';
import { mockAppointments } from '../../utils/mockData';
import { v4 as uuidv4 } from 'uuid';

interface AppointmentsState {
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  filteredAppointments: Appointment[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AppointmentsState = {
  appointments: mockAppointments,
  selectedAppointment: null,
  filteredAppointments: mockAppointments,
  isLoading: false,
  error: null,
};

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    fetchAppointmentsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchAppointmentsSuccess: (state, action: PayloadAction<Appointment[]>) => {
      state.appointments = action.payload;
      state.filteredAppointments = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    fetchAppointmentsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    selectAppointment: (state, action: PayloadAction<string>) => {
      state.selectedAppointment = state.appointments.find(appointment => appointment.id === action.payload) || null;
    },
    clearSelectedAppointment: (state) => {
      state.selectedAppointment = null;
    },
    addAppointment: (state, action: PayloadAction<Omit<Appointment, 'id'>>) => {
      const newAppointment: Appointment = {
        ...action.payload,
        id: uuidv4(),
      };
      state.appointments.push(newAppointment);
      state.filteredAppointments = state.appointments;
    },
    updateAppointment: (state, action: PayloadAction<Appointment>) => {
      const index = state.appointments.findIndex(appointment => appointment.id === action.payload.id);
      if (index !== -1) {
        state.appointments[index] = action.payload;
        state.filteredAppointments = state.appointments;
        if (state.selectedAppointment && state.selectedAppointment.id === action.payload.id) {
          state.selectedAppointment = action.payload;
        }
      }
    },
    deleteAppointment: (state, action: PayloadAction<string>) => {
      state.appointments = state.appointments.filter(appointment => appointment.id !== action.payload);
      state.filteredAppointments = state.appointments;
      if (state.selectedAppointment && state.selectedAppointment.id === action.payload) {
        state.selectedAppointment = null;
      }
    },
    filterAppointmentsByDate: (state, action: PayloadAction<string>) => {
      const date = action.payload;
      state.filteredAppointments = state.appointments.filter(appointment => appointment.date === date);
    },
    filterAppointmentsByDoctor: (state, action: PayloadAction<string>) => {
      const doctorId = action.payload;
      state.filteredAppointments = state.appointments.filter(appointment => appointment.doctorId === doctorId);
    },
    filterAppointmentsByPatient: (state, action: PayloadAction<string>) => {
      const patientId = action.payload;
      state.filteredAppointments = state.appointments.filter(appointment => appointment.patientId === patientId);
    },
    filterAppointmentsByStatus: (state, action: PayloadAction<Appointment['status']>) => {
      const status = action.payload;
      state.filteredAppointments = state.appointments.filter(appointment => appointment.status === status);
    },
    resetAppointmentFilters: (state) => {
      state.filteredAppointments = state.appointments;
    },
  },
});

export const {
  fetchAppointmentsStart,
  fetchAppointmentsSuccess,
  fetchAppointmentsFailure,
  selectAppointment,
  clearSelectedAppointment,
  addAppointment,
  updateAppointment,
  deleteAppointment,
  filterAppointmentsByDate,
  filterAppointmentsByDoctor,
  filterAppointmentsByPatient,
  filterAppointmentsByStatus,
  resetAppointmentFilters,
} = appointmentsSlice.actions;

export default appointmentsSlice.reducer; 