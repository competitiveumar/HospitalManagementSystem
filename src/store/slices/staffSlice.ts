import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Staff, WorkSchedule } from '../../types';
import { mockStaff } from '../../utils/mockData';
import { v4 as uuidv4 } from 'uuid';

interface StaffState {
  staff: Staff[];
  selectedStaff: Staff | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: StaffState = {
  staff: mockStaff,
  selectedStaff: null,
  isLoading: false,
  error: null,
};

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    fetchStaffStart: (state: StaffState) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchStaffSuccess: (state: StaffState, action: PayloadAction<Staff[]>) => {
      state.staff = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    fetchStaffFailure: (state: StaffState, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    selectStaff: (state: StaffState, action: PayloadAction<string>) => {
      state.selectedStaff = state.staff.find((staff: Staff) => staff.id === action.payload) || null;
    },
    clearSelectedStaff: (state: StaffState) => {
      state.selectedStaff = null;
    },
    addStaff: (state: StaffState, action: PayloadAction<Omit<Staff, 'id'>>) => {
      const newStaff: Staff = {
        ...action.payload,
        id: uuidv4(),
        schedule: action.payload.schedule || [],
      };
      state.staff.push(newStaff);
    },
    updateStaff: (state: StaffState, action: PayloadAction<Staff>) => {
      const index = state.staff.findIndex((staff: Staff) => staff.id === action.payload.id);
      if (index !== -1) {
        state.staff[index] = action.payload;
        if (state.selectedStaff && state.selectedStaff.id === action.payload.id) {
          state.selectedStaff = action.payload;
        }
      }
    },
    deleteStaff: (state: StaffState, action: PayloadAction<string>) => {
      state.staff = state.staff.filter((staff: Staff) => staff.id !== action.payload);
      if (state.selectedStaff && state.selectedStaff.id === action.payload) {
        state.selectedStaff = null;
      }
    },
    updateStaffSchedule: (state: StaffState, action: PayloadAction<{ staffId: string; schedule: WorkSchedule[] }>) => {
      const { staffId, schedule } = action.payload;
      const staffMember = state.staff.find((s: Staff) => s.id === staffId);
      
      if (staffMember) {
        staffMember.schedule = schedule;
        
        if (state.selectedStaff && state.selectedStaff.id === staffId) {
          state.selectedStaff = staffMember;
        }
      }
    },
    filterStaffByRole: (state: StaffState, action: PayloadAction<Staff['role']>) => {
      const role = action.payload;
      state.staff = mockStaff.filter((s: Staff) => s.role === role);
    },
    filterStaffByDepartment: (state: StaffState, action: PayloadAction<string>) => {
      const department = action.payload;
      state.staff = mockStaff.filter((s: Staff) => s.department === department);
    },
    resetStaffFilters: (state: StaffState) => {
      state.staff = mockStaff;
    },
  },
});

export const {
  fetchStaffStart,
  fetchStaffSuccess,
  fetchStaffFailure,
  selectStaff,
  clearSelectedStaff,
  addStaff,
  updateStaff,
  deleteStaff,
  updateStaffSchedule,
  filterStaffByRole,
  filterStaffByDepartment,
  resetStaffFilters,
} = staffSlice.actions;

export default staffSlice.reducer; 