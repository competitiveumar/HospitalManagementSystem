import { v4 as uuidv4 } from 'uuid';
import { 
  Patient, 
  Staff, 
  Appointment, 
  InventoryItem, 
  Bill, 
  MedicalRecord,
  Prescription,
  User,
  LabTest
} from '../types';

// Generate mock users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Dr. John Smith',
    email: 'john.smith@hospital.com',
    role: 'doctor',
    profileImage: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: '2',
    name: 'Nurse Sarah Johnson',
    email: 'sarah.johnson@hospital.com',
    role: 'nurse',
    profileImage: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    id: '3',
    name: 'Admin David Wilson',
    email: 'david.wilson@hospital.com',
    role: 'admin',
    profileImage: 'https://randomuser.me/api/portraits/men/3.jpg'
  },
  {
    id: '4',
    name: 'James Brown',
    email: 'james.brown@example.com',
    role: 'patient',
    profileImage: 'https://randomuser.me/api/portraits/men/4.jpg'
  },
  {
    id: '5',
    name: 'Emma Davis',
    email: 'emma.davis@hospital.com',
    role: 'receptionist',
    profileImage: 'https://randomuser.me/api/portraits/women/5.jpg'
  },
  {
    id: '6',
    name: 'Dr. Emily Carter',
    email: 'emily.carter@hospital.com',
    role: 'doctor',
    profileImage: 'https://randomuser.me/api/portraits/women/6.jpg'
  },
  {
    id: '7',
    name: 'Michael Rodriguez',
    email: 'michael.rodriguez@hospital.com',
    role: 'pharmacist',
    profileImage: 'https://randomuser.me/api/portraits/men/7.jpg'
  },
  {
    id: '8',
    name: 'Jessica Martinez',
    email: 'jessica.martinez@hospital.com',
    role: 'lab_technician',
    profileImage: 'https://randomuser.me/api/portraits/women/8.jpg'
  }
];

// Generate mock patients
export const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'James Brown',
    email: 'james.brown@example.com',
    phone: '555-123-4567',
    address: '123 Main St, London, UK',
    dateOfBirth: '1985-05-15',
    gender: 'male',
    bloodGroup: 'A+',
    registrationDate: '2023-01-10',
    profileImage: 'https://randomuser.me/api/portraits/men/4.jpg',
    medicalHistory: [
      {
        id: '101',
        date: '2023-02-15',
        diagnosis: 'Hypertension',
        treatment: 'Prescribed Lisinopril 10mg',
        prescriptions: [
          {
            id: '1001',
            medicationName: 'Lisinopril',
            dosage: '10mg',
            frequency: 'Once daily',
            duration: '30 days',
            notes: 'Take in the morning'
          }
        ],
        doctorId: '1',
        notes: 'Patient advised to reduce salt intake'
      }
    ],
    insuranceDetails: {
      providerName: 'NHS',
      policyNumber: 'NHS12345',
      coverageDetails: 'Full coverage',
      validUntil: '2024-12-31'
    },
    emergencyContact: {
      name: 'Mary Brown',
      relationship: 'Spouse',
      phone: '555-987-6543',
      address: '123 Main St, London, UK'
    }
  },
  {
    id: '2',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phone: '555-234-5678',
    address: '456 Oak St, Birmingham, UK',
    dateOfBirth: '1990-08-22',
    gender: 'female',
    bloodGroup: 'O-',
    registrationDate: '2023-02-05',
    profileImage: 'https://randomuser.me/api/portraits/women/10.jpg',
    medicalHistory: [
      {
        id: '102',
        date: '2023-03-10',
        diagnosis: 'Acute Bronchitis',
        treatment: 'Prescribed antibiotics and rest',
        prescriptions: [
          {
            id: '1002',
            medicationName: 'Amoxicillin',
            dosage: '500mg',
            frequency: 'Twice daily',
            duration: '7 days',
            notes: 'Take with food'
          }
        ],
        doctorId: '6',
        notes: 'Follow-up in one week'
      }
    ],
    insuranceDetails: {
      providerName: 'Bupa',
      policyNumber: 'BUPA67890',
      coverageDetails: 'Partial coverage',
      validUntil: '2023-12-31'
    },
    emergencyContact: {
      name: 'Robert Johnson',
      relationship: 'Father',
      phone: '555-876-5432',
      address: '789 Pine St, Birmingham, UK'
    }
  },
  {
    id: '3',
    name: 'Robert Davis',
    email: 'robert.davis@example.com',
    phone: '555-345-6789',
    address: '789 Pine St, Manchester, UK',
    dateOfBirth: '1978-11-30',
    gender: 'male',
    bloodGroup: 'B+',
    registrationDate: '2023-01-15',
    profileImage: 'https://randomuser.me/api/portraits/men/11.jpg',
    medicalHistory: [
      {
        id: '103',
        date: '2023-02-20',
        diagnosis: 'Type 2 Diabetes',
        treatment: 'Prescribed Metformin',
        prescriptions: [
          {
            id: '1003',
            medicationName: 'Metformin',
            dosage: '500mg',
            frequency: 'Twice daily',
            duration: '90 days',
            notes: 'Take with meals'
          }
        ],
        doctorId: '1',
        notes: 'Advised dietary changes and regular exercise'
      }
    ],
    insuranceDetails: {
      providerName: 'Aviva',
      policyNumber: 'AVIVA45678',
      coverageDetails: 'Full coverage',
      validUntil: '2024-06-30'
    },
    emergencyContact: {
      name: 'Susan Davis',
      relationship: 'Spouse',
      phone: '555-765-4321',
      address: '789 Pine St, Manchester, UK'
    }
  }
];

// Generate mock staff
export const mockStaff: Staff[] = [
  {
    id: '1',
    name: 'Dr. John Smith',
    email: 'john.smith@hospital.com',
    phone: '555-111-2222',
    address: '101 Hospital Rd, London, UK',
    role: 'doctor',
    department: 'Cardiology',
    joinDate: '2020-01-15',
    qualification: 'MD, Cardiology',
    specialization: 'Interventional Cardiology',
    experience: '10 years',
    profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
    schedule: [
      {
        day: 'monday',
        startTime: '09:00',
        endTime: '17:00'
      },
      {
        day: 'wednesday',
        startTime: '09:00',
        endTime: '17:00'
      },
      {
        day: 'friday',
        startTime: '09:00',
        endTime: '17:00'
      }
    ],
    salary: 95000
  },
  {
    id: '2',
    name: 'Nurse Sarah Johnson',
    email: 'sarah.johnson@hospital.com',
    phone: '555-222-3333',
    address: '202 Nurse Ave, London, UK',
    role: 'nurse',
    department: 'Cardiology',
    joinDate: '2021-03-10',
    qualification: 'BSN, Nursing',
    experience: '5 years',
    profileImage: 'https://randomuser.me/api/portraits/women/2.jpg',
    schedule: [
      {
        day: 'monday',
        startTime: '08:00',
        endTime: '16:00'
      },
      {
        day: 'tuesday',
        startTime: '08:00',
        endTime: '16:00'
      },
      {
        day: 'thursday',
        startTime: '08:00',
        endTime: '16:00'
      },
      {
        day: 'friday',
        startTime: '08:00',
        endTime: '16:00'
      }
    ],
    salary: 52000
  },
  {
    id: '3',
    name: 'Admin David Wilson',
    email: 'david.wilson@hospital.com',
    phone: '555-333-4444',
    address: '303 Admin Blvd, London, UK',
    role: 'admin',
    department: 'Administration',
    joinDate: '2019-05-20',
    qualification: 'MBA, Healthcare Management',
    experience: '8 years',
    profileImage: 'https://randomuser.me/api/portraits/men/3.jpg',
    schedule: [
      {
        day: 'monday',
        startTime: '09:00',
        endTime: '17:00'
      },
      {
        day: 'tuesday',
        startTime: '09:00',
        endTime: '17:00'
      },
      {
        day: 'wednesday',
        startTime: '09:00',
        endTime: '17:00'
      },
      {
        day: 'thursday',
        startTime: '09:00',
        endTime: '17:00'
      },
      {
        day: 'friday',
        startTime: '09:00',
        endTime: '17:00'
      }
    ],
    salary: 75000
  },
  {
    id: '5',
    name: 'Emma Davis',
    email: 'emma.davis@hospital.com',
    phone: '555-555-6666',
    address: '505 Reception St, London, UK',
    role: 'receptionist',
    department: 'Front Desk',
    joinDate: '2022-01-10',
    qualification: 'BA, Communication',
    experience: '3 years',
    profileImage: 'https://randomuser.me/api/portraits/women/5.jpg',
    schedule: [
      {
        day: 'monday',
        startTime: '08:00',
        endTime: '16:00'
      },
      {
        day: 'tuesday',
        startTime: '08:00',
        endTime: '16:00'
      },
      {
        day: 'wednesday',
        startTime: '08:00',
        endTime: '16:00'
      },
      {
        day: 'thursday',
        startTime: '08:00',
        endTime: '16:00'
      },
      {
        day: 'friday',
        startTime: '08:00',
        endTime: '16:00'
      }
    ],
    salary: 42000
  },
  {
    id: '6',
    name: 'Dr. Emily Carter',
    email: 'emily.carter@hospital.com',
    phone: '555-666-7777',
    address: '606 Doctor Ln, London, UK',
    role: 'doctor',
    department: 'Paediatrics',
    joinDate: '2020-08-15',
    qualification: 'MD, Paediatrics',
    specialization: 'Neonatology',
    experience: '7 years',
    profileImage: 'https://randomuser.me/api/portraits/women/6.jpg',
    schedule: [
      {
        day: 'tuesday',
        startTime: '09:00',
        endTime: '17:00'
      },
      {
        day: 'thursday',
        startTime: '09:00',
        endTime: '17:00'
      },
      {
        day: 'saturday',
        startTime: '10:00',
        endTime: '14:00'
      }
    ],
    salary: 90000
  },
  {
    id: '7',
    name: 'Michael Rodriguez',
    email: 'michael.rodriguez@hospital.com',
    phone: '555-777-8888',
    address: '707 Pharmacy Rd, London, UK',
    role: 'pharmacist',
    department: 'Pharmacy',
    joinDate: '2021-05-10',
    qualification: 'PharmD',
    experience: '6 years',
    profileImage: 'https://randomuser.me/api/portraits/men/7.jpg',
    schedule: [
      {
        day: 'monday',
        startTime: '09:00',
        endTime: '17:00'
      },
      {
        day: 'wednesday',
        startTime: '09:00',
        endTime: '17:00'
      },
      {
        day: 'friday',
        startTime: '09:00',
        endTime: '17:00'
      }
    ],
    salary: 65000
  },
  {
    id: '8',
    name: 'Jessica Martinez',
    email: 'jessica.martinez@hospital.com',
    phone: '555-888-9999',
    address: '808 Lab Ave, London, UK',
    role: 'lab_technician',
    department: 'Laboratory',
    joinDate: '2022-03-15',
    qualification: 'BS, Medical Laboratory Science',
    experience: '4 years',
    profileImage: 'https://randomuser.me/api/portraits/women/8.jpg',
    schedule: [
      {
        day: 'tuesday',
        startTime: '08:00',
        endTime: '16:00'
      },
      {
        day: 'wednesday',
        startTime: '08:00',
        endTime: '16:00'
      },
      {
        day: 'thursday',
        startTime: '08:00',
        endTime: '16:00'
      },
      {
        day: 'friday',
        startTime: '08:00',
        endTime: '16:00'
      }
    ],
    salary: 55000
  }
];

// Generate mock appointments
export const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    doctorId: '1',
    date: '2023-06-15',
    time: '10:00',
    status: 'confirmed',
    type: 'consultation',
    reason: 'Regular check-up for hypertension'
  },
  {
    id: '2',
    patientId: '2',
    doctorId: '6',
    date: '2023-06-16',
    time: '11:30',
    status: 'scheduled',
    type: 'follow-up',
    reason: 'Follow-up on bronchitis treatment'
  },
  {
    id: '3',
    patientId: '3',
    doctorId: '1',
    date: '2023-06-16',
    time: '14:00',
    status: 'confirmed',
    type: 'consultation',
    reason: 'Diabetes management review'
  },
  {
    id: '4',
    patientId: '1',
    doctorId: '1',
    date: '2023-05-10',
    time: '09:30',
    status: 'completed',
    type: 'consultation',
    notes: "Patient's blood pressure is under control"
  },
  {
    id: '5',
    patientId: '2',
    doctorId: '6',
    date: '2023-05-05',
    time: '13:00',
    status: 'completed',
    type: 'emergency',
    notes: 'Patient diagnosed with acute bronchitis'
  },
  {
    id: '6',
    patientId: '3',
    doctorId: '1',
    date: '2023-06-22',
    time: '10:30',
    status: 'scheduled',
    type: 'follow-up',
    reason: 'Review recent lab results'
  },
  {
    id: '7',
    patientId: '2',
    doctorId: '6',
    date: '2023-06-25',
    time: '15:00',
    status: 'scheduled',
    type: 'consultation',
    reason: 'Chronic cough evaluation'
  }
];

// Generate mock inventory items
export const mockInventoryItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    category: 'medicine',
    quantity: 500,
    unitPrice: 0.15,
    supplier: 'MedSupply Ltd',
    reorderLevel: 100,
    expiryDate: '2024-06-30',
    location: 'Pharmacy Storage A1',
    description: 'For pain relief and fever reduction',
    image: 'https://www.medicines.org.uk/emc/product/6334/smpc/images/1'
  },
  {
    id: '2',
    name: 'Digital Thermometer',
    category: 'equipment',
    quantity: 50,
    unitPrice: 12.99,
    supplier: 'MedEquip Co',
    reorderLevel: 10,
    location: 'Supplies Room B2',
    description: 'Digital thermometer for temperature measurement',
    image: 'https://m.media-amazon.com/images/I/61KrYHp1LDL._AC_SL1500_.jpg'
  },
  {
    id: '3',
    name: 'Surgical Gloves (Box)',
    category: 'supplies',
    quantity: 200,
    unitPrice: 8.50,
    supplier: 'SafeHands Inc',
    reorderLevel: 50,
    location: 'Supplies Room C3',
    description: 'Latex-free surgical gloves, 100 per box',
    image: 'https://m.media-amazon.com/images/I/71lJL-bNLQL._AC_SL1500_.jpg'
  },
  {
    id: '4',
    name: 'Amoxicillin 250mg',
    category: 'medicine',
    quantity: 300,
    unitPrice: 0.25,
    supplier: 'MedSupply Ltd',
    reorderLevel: 75,
    expiryDate: '2024-03-15',
    location: 'Pharmacy Storage A2',
    description: 'Antibiotic for bacterial infections',
    image: 'https://www.medicines.org.uk/emc/product/3748/smpc/images/1'
  },
  {
    id: '5',
    name: 'Blood Pressure Monitor',
    category: 'equipment',
    quantity: 25,
    unitPrice: 65.00,
    supplier: 'MedEquip Co',
    reorderLevel: 5,
    location: 'Equipment Room D1',
    description: 'Digital automatic blood pressure monitor',
    image: 'https://m.media-amazon.com/images/I/61MKIqgcGIL._AC_SL1500_.jpg'
  },
  {
    id: '6',
    name: 'Gauze Bandages',
    category: 'supplies',
    quantity: 400,
    unitPrice: 2.25,
    supplier: 'SafeHands Inc',
    reorderLevel: 100,
    location: 'Supplies Room C1',
    description: 'Sterile gauze bandages for wound dressing',
    image: 'https://m.media-amazon.com/images/I/71ovcFa8CML._AC_SL1500_.jpg'
  },
  {
    id: '7',
    name: 'Insulin Vials',
    category: 'medicine',
    quantity: 80,
    unitPrice: 35.00,
    supplier: 'DiabetCare',
    reorderLevel: 20,
    expiryDate: '2023-12-15',
    location: 'Refrigerated Storage R1',
    description: 'Standard insulin for diabetic patients',
    image: 'https://www.medicines.org.uk/emc/product/6931/smpc/images/1'
  }
];

// Generate mock bills
export const mockBills: Bill[] = [
  {
    id: '1',
    patientId: '1',
    date: '2023-05-10',
    items: [
      {
        id: '101',
        description: 'Cardiology Consultation',
        quantity: 1,
        unitPrice: 150.00,
        amount: 150.00,
        category: 'consultation'
      },
      {
        id: '102',
        description: 'Blood Pressure Test',
        quantity: 1,
        unitPrice: 50.00,
        amount: 50.00,
        category: 'lab_test'
      },
      {
        id: '103',
        description: 'Lisinopril 10mg',
        quantity: 30,
        unitPrice: 1.25,
        amount: 37.50,
        category: 'medication'
      }
    ],
    totalAmount: 237.50,
    paymentStatus: 'paid',
    paymentMethod: 'insurance',
    insuranceCoverage: 200.00,
    patientPayable: 37.50,
    tax: 0
  },
  {
    id: '2',
    patientId: '2',
    date: '2023-05-05',
    items: [
      {
        id: '201',
        description: 'Emergency Consultation',
        quantity: 1,
        unitPrice: 200.00,
        amount: 200.00,
        category: 'consultation'
      },
      {
        id: '202',
        description: 'Chest X-Ray',
        quantity: 1,
        unitPrice: 120.00,
        amount: 120.00,
        category: 'procedure'
      },
      {
        id: '203',
        description: 'Amoxicillin 500mg',
        quantity: 14,
        unitPrice: 2.00,
        amount: 28.00,
        category: 'medication'
      }
    ],
    totalAmount: 348.00,
    paymentStatus: 'partially_paid',
    paymentMethod: 'card',
    insuranceCoverage: 200.00,
    patientPayable: 148.00,
    discount: 20.00,
    tax: 0
  },
  {
    id: '3',
    patientId: '3',
    date: '2023-04-20',
    items: [
      {
        id: '301',
        description: 'Cardiology Consultation',
        quantity: 1,
        unitPrice: 150.00,
        amount: 150.00,
        category: 'consultation'
      },
      {
        id: '302',
        description: 'Blood Sugar Test',
        quantity: 1,
        unitPrice: 40.00,
        amount: 40.00,
        category: 'lab_test'
      },
      {
        id: '303',
        description: 'Metformin 500mg',
        quantity: 60,
        unitPrice: 0.75,
        amount: 45.00,
        category: 'medication'
      }
    ],
    totalAmount: 235.00,
    paymentStatus: 'paid',
    paymentMethod: 'cash',
    patientPayable: 235.00,
    tax: 0
  }
];

// Generate mock lab tests
export const mockLabTests: LabTest[] = [
  {
    id: '1',
    patientId: '1',
    doctorId: '1',
    testType: 'Blood Pressure',
    requestDate: '2023-05-10',
    status: 'completed',
    results: 'Systolic: 140mmHg, Diastolic: 90mmHg',
    resultDate: '2023-05-10',
    technicianId: '8',
    notes: 'Slightly elevated, continue monitoring'
  },
  {
    id: '2',
    patientId: '2',
    doctorId: '6',
    testType: 'Chest X-Ray',
    requestDate: '2023-05-05',
    status: 'completed',
    results: 'Signs of acute bronchitis observed. No pneumonia detected.',
    resultDate: '2023-05-05',
    technicianId: '8',
    notes: 'Patient to return for follow-up in 2 weeks'
  },
  {
    id: '3',
    patientId: '3',
    doctorId: '1',
    testType: 'Blood Sugar (Fasting)',
    requestDate: '2023-04-20',
    status: 'completed',
    results: '140 mg/dL',
    resultDate: '2023-04-20',
    technicianId: '8',
    notes: 'Above normal range. Consultation with doctor advised.'
  },
  {
    id: '4',
    patientId: '1',
    doctorId: '1',
    testType: 'Lipid Profile',
    requestDate: '2023-06-15',
    status: 'requested',
    notes: 'Patient to come fasting in the morning'
  },
  {
    id: '5',
    patientId: '3',
    doctorId: '1',
    testType: 'HbA1c',
    requestDate: '2023-06-16',
    status: 'in_progress',
    technicianId: '8',
    notes: 'Sample collected, awaiting results'
  }
]; 