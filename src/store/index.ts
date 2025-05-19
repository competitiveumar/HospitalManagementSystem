import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import patientsReducer from './slices/patientsSlice';
import staffReducer from './slices/staffSlice';
import appointmentsReducer from './slices/appointmentsSlice';
import inventoryReducer from './slices/inventorySlice';
import billingReducer from './slices/billingSlice';
import labTestsReducer from './slices/labTestsSlice';
import uiReducer from './slices/uiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    patients: patientsReducer,
    staff: staffReducer,
    appointments: appointmentsReducer,
    inventory: inventoryReducer,
    billing: billingReducer,
    labTests: labTestsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store; 