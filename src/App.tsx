import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline';
import 'react-toastify/dist/ReactToastify.css';

import store from './store';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './components/dashboard/Dashboard';
import Settings from './components/settings/Settings';
import PatientsList from './components/patients/PatientsList';
import PatientMedicalRecords from './components/patients/PatientMedicalRecords';
import ViewPatient from './components/patients/ViewPatient';
import AppointmentsList from './components/appointments/AppointmentsList';
import BookAppointment from './components/appointments/BookAppointment';
import InventoryList from './components/inventory/InventoryList';
import AddEditInventoryItem from './components/inventory/AddEditInventoryItem';
import AllTests from './components/labs/AllTests';
import RequestTest from './components/labs/RequestTest';
import TestResults from './components/labs/TestResults';
import ViewTest from './components/labs/ViewTest';
import { useAppSelector } from './hooks/reduxHooks';

// Main App wrapper that provides store
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <CssBaseline />
      <AppRoutes />
    </Provider>
  );
};

// App routes component
const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} 
        />
        
        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/patients"
          element={
            <ProtectedRoute>
              <Layout>
                <PatientsList />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/patients/:patientId"
          element={
            <ProtectedRoute>
              <Layout>
                <ViewPatient />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/patients/records/:patientId"
          element={
            <ProtectedRoute>
              <Layout>
                <PatientMedicalRecords />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/patients/records"
          element={
            <ProtectedRoute>
              <Layout>
                <PatientsList />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <Layout>
                <AppointmentsList />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/appointments/book"
          element={
            <ProtectedRoute>
              <Layout>
                <BookAppointment />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/lab-tests"
          element={
            <ProtectedRoute>
              <Layout>
                <AllTests />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/lab-tests/request"
          element={
            <ProtectedRoute>
              <Layout>
                <RequestTest />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/lab-tests/results"
          element={
            <ProtectedRoute>
              <Layout>
                <TestResults />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/lab-tests/view/:testId"
          element={
            <ProtectedRoute>
              <Layout>
                <ViewTest />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <Layout>
                <InventoryList />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/inventory/add"
          element={
            <ProtectedRoute>
              <Layout>
                <AddEditInventoryItem />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/inventory/edit/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <AddEditInventoryItem />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        {/* Redirect to login for any unknown routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
