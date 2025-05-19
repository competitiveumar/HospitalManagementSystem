# Hospital Management System

A comprehensive React-based Hospital Management System that helps hospitals run their operations smoothly. This application includes modules for patient management, appointment scheduling, inventory management, staff management, billing, reporting, and analytics.

## Features

- **Dashboard**: Get a comprehensive overview of hospital operations with key metrics
- **Patient Management**: Manage patient records, medical history, and prescriptions
- **Staff Management**: Manage doctors, nurses, and administrative staff
- **Appointment Scheduling**: Book and manage appointments for consultations and procedures
- **Inventory Management**: Track medicines, equipment, and supplies with low-stock alerts
- **Billing**: Generate and manage bills for services provided to patients
- **Laboratory Management**: Request and track lab tests and results
- **Reporting & Analytics**: View visualisations and reports for data-driven decisions

## Technologies Used

- **Frontend**: React, TypeScript, Material-UI
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **Forms**: Formik, Yup validation
- **Data Visualisation**: Recharts
- **Date/Time Handling**: date-fns
- **Notifications**: React Toastify

## Project Structure

- `src/components`: All React components organised by feature
- `src/store`: Redux store, slices, and actions
- `src/hooks`: Custom React hooks
- `src/types`: TypeScript type definitions
- `src/utils`: Utility functions and shared resources
- `src/assets`: Static assets like images

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- npm or yarn

To run the tests:
```
npm test
```

To run tests without watch mode:
```
npm test -- --watchAll=false
```

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/competitiveumar/HospitalManagementSystem.git
   ```

2. Navigate to the project directory
   ```bash
   cd hospitalmanagementsystem-main
   ```

3. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

4. Start the development server
   ```bash
   npm start
   # or
   yarn start
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Demo Credentials

For demonstration purposes, you can use any of these credentials to log in:

- **Doctor**: john.smith@hospital.com / password
- **Nurse**: sarah.johnson@hospital.com / password
- **Admin**: david.wilson@hospital.com / password
- **Patient**: james.brown@example.com / password
- **Receptionist**: emma.davis@hospital.com / password

## Key Learning Outcomes

- Data handling and manipulation with Redux Toolkit
- Component design and structure in React
- Advanced routing with protected routes
- Effective state management
- Integrating charts and data visualisation
- Building responsive UIs with Material-UI


## Advanced Features

1. **Role-Based Access Control**: Different interfaces and permissions for administrators, doctors, nurses, and patients
2. **Advanced Reporting & Data Visualisation**: Visual representation of key metrics
3. **Automated Billing with Insurance Claim Simulation**: Generate itemised bills based on services
4. **Real-Time Notifications**: Instant alerts for updates and changes
5. **Document Upload and Management**: Store and retrieve patient documents

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Material-UI](https://mui.com/) for the UI components
- [Redux Toolkit](https://redux-toolkit.js.org/) for state management
- [React Router](https://reactrouter.com/) for routing
- [Recharts](https://recharts.org/) for data visualisation

This project was created as a learning exercise and is not intended for production use in actual medical facilities.
