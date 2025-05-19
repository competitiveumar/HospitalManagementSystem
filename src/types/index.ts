// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'nurse' | 'patient' | 'receptionist' | 'pharmacist' | 'lab_technician';
  profileImage?: string;
}

// Patient Types
export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  bloodGroup?: string;
  medicalHistory?: MedicalRecord[];
  insuranceDetails?: InsuranceDetails;
  emergencyContact?: EmergencyContact;
  registrationDate: string;
  profileImage?: string;
}

export interface MedicalRecord {
  id: string;
  date: string;
  diagnosis: string;
  treatment: string;
  prescriptions: Prescription[];
  doctorId: string;
  notes?: string;
}

export interface Prescription {
  id: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
}

export interface InsuranceDetails {
  providerName: string;
  policyNumber: string;
  coverageDetails: string;
  validUntil: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  address?: string;
}

// Staff Types
export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: 'doctor' | 'nurse' | 'receptionist' | 'admin' | 'pharmacist' | 'lab_technician';
  department: string;
  joinDate: string;
  qualification?: string;
  specialization?: string;
  experience?: string;
  schedule?: WorkSchedule[];
  salary?: number;
  profileImage?: string;
}

export interface WorkSchedule {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string;
  endTime: string;
}

// Appointment Types
export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  type: 'consultation' | 'follow-up' | 'emergency' | 'surgery' | 'test';
  notes?: string;
  reason?: string;
}

// Inventory Types
export interface InventoryItem {
  id: string;
  name: string;
  category: 'medicine' | 'equipment' | 'supplies' | 'other';
  quantity: number;
  unitPrice: number;
  supplier: string;
  reorderLevel: number;
  expiryDate?: string;
  location?: string;
  description?: string;
  image?: string;
}

// Billing Types
export interface Bill {
  id: string;
  patientId: string;
  date: string;
  items: BillItem[];
  totalAmount: number;
  paymentStatus: 'pending' | 'partially_paid' | 'paid';
  paymentMethod?: 'cash' | 'card' | 'insurance' | 'online';
  insuranceCoverage?: number;
  patientPayable?: number;
  discount?: number;
  tax?: number;
}

export interface BillItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  category: 'consultation' | 'medication' | 'procedure' | 'lab_test' | 'room_charge' | 'other';
}

// Lab Test Types
export interface LabTest {
  id: string;
  patientId: string;
  doctorId: string;
  testType: string;
  requestDate: string;
  status: 'requested' | 'in_progress' | 'completed';
  results?: string;
  resultDate?: string;
  technicianId?: string;
  notes?: string;
}

// Authentication Types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// UI Types
export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  userId?: string;
}

// Form States
export interface FormState {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
}

// Dashboard Analytics
export interface DashboardStats {
  totalPatients: number;
  totalAppointmentsToday: number;
  totalDoctors: number;
  revenueThisMonth: number;
  inventoryAlerts: number;
  pendingBills: number;
}

// Chart Data Types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    fill?: boolean;
  }[];
} 