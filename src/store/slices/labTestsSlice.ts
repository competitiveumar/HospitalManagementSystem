import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LabTest } from '../../types';
import { mockLabTests } from '../../utils/mockData';
import { v4 as uuidv4 } from 'uuid';

interface LabTestsState {
  tests: LabTest[];
  selectedTest: LabTest | null;
  filteredTests: LabTest[];
  pendingTests: LabTest[];
  isLoading: boolean;
  error: string | null;
}

const initialState: LabTestsState = {
  tests: mockLabTests,
  selectedTest: null,
  filteredTests: mockLabTests,
  pendingTests: mockLabTests.filter(test => test.status !== 'completed'),
  isLoading: false,
  error: null,
};

const labTestsSlice = createSlice({
  name: 'labTests',
  initialState,
  reducers: {
    fetchLabTestsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchLabTestsSuccess: (state, action: PayloadAction<LabTest[]>) => {
      state.tests = action.payload;
      state.filteredTests = action.payload;
      state.pendingTests = action.payload.filter(test => test.status !== 'completed');
      state.isLoading = false;
      state.error = null;
    },
    fetchLabTestsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    selectLabTest: (state, action: PayloadAction<string>) => {
      state.selectedTest = state.tests.find(test => test.id === action.payload) || null;
    },
    clearSelectedLabTest: (state) => {
      state.selectedTest = null;
    },
    addLabTest: (state, action: PayloadAction<Omit<LabTest, 'id'>>) => {
      const newTest: LabTest = {
        ...action.payload,
        id: uuidv4(),
      };
      state.tests.push(newTest);
      state.filteredTests = state.tests;
      
      if (newTest.status !== 'completed') {
        state.pendingTests.push(newTest);
      }
    },
    updateLabTest: (state, action: PayloadAction<LabTest>) => {
      const index = state.tests.findIndex(test => test.id === action.payload.id);
      if (index !== -1) {
        state.tests[index] = action.payload;
        state.filteredTests = state.tests;
        state.pendingTests = state.tests.filter(test => test.status !== 'completed');
        
        if (state.selectedTest && state.selectedTest.id === action.payload.id) {
          state.selectedTest = action.payload;
        }
      }
    },
    deleteLabTest: (state, action: PayloadAction<string>) => {
      state.tests = state.tests.filter(test => test.id !== action.payload);
      state.filteredTests = state.tests;
      state.pendingTests = state.tests.filter(test => test.status !== 'completed');
      
      if (state.selectedTest && state.selectedTest.id === action.payload) {
        state.selectedTest = null;
      }
    },
    updateLabTestStatus: (state, action: PayloadAction<{ testId: string; status: LabTest['status']; results?: string; resultDate?: string; technicianId?: string }>) => {
      const { testId, status, results, resultDate, technicianId } = action.payload;
      const test = state.tests.find(t => t.id === testId);
      
      if (test) {
        test.status = status;
        
        if (results !== undefined) {
          test.results = results;
        }
        
        if (resultDate !== undefined) {
          test.resultDate = resultDate;
        }
        
        if (technicianId !== undefined) {
          test.technicianId = technicianId;
        }
        
        state.filteredTests = state.tests;
        state.pendingTests = state.tests.filter(test => test.status !== 'completed');
        
        if (state.selectedTest && state.selectedTest.id === testId) {
          state.selectedTest = test;
        }
      }
    },
    filterLabTestsByPatient: (state, action: PayloadAction<string>) => {
      const patientId = action.payload;
      state.filteredTests = state.tests.filter(test => test.patientId === patientId);
    },
    filterLabTestsByDoctor: (state, action: PayloadAction<string>) => {
      const doctorId = action.payload;
      state.filteredTests = state.tests.filter(test => test.doctorId === doctorId);
    },
    filterLabTestsByStatus: (state, action: PayloadAction<LabTest['status']>) => {
      const status = action.payload;
      state.filteredTests = state.tests.filter(test => test.status === status);
    },
    filterLabTestsByType: (state, action: PayloadAction<string>) => {
      const testType = action.payload;
      state.filteredTests = state.tests.filter(test => test.testType.toLowerCase().includes(testType.toLowerCase()));
    },
    filterLabTestsByDate: (state, action: PayloadAction<{ startDate: string; endDate: string }>) => {
      const { startDate, endDate } = action.payload;
      state.filteredTests = state.tests.filter(test => test.requestDate >= startDate && test.requestDate <= endDate);
    },
    resetLabTestFilters: (state) => {
      state.filteredTests = state.tests;
    },
  },
});

export const {
  fetchLabTestsStart,
  fetchLabTestsSuccess,
  fetchLabTestsFailure,
  selectLabTest,
  clearSelectedLabTest,
  addLabTest,
  updateLabTest,
  deleteLabTest,
  updateLabTestStatus,
  filterLabTestsByPatient,
  filterLabTestsByDoctor,
  filterLabTestsByStatus,
  filterLabTestsByType,
  filterLabTestsByDate,
  resetLabTestFilters,
} = labTestsSlice.actions;

export default labTestsSlice.reducer; 