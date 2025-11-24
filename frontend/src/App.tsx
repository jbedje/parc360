import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import VehicleDetails from './pages/VehicleDetails';
import Drivers from './pages/Drivers';
import DriverDetails from './pages/DriverDetails';
import Maintenance from './pages/Maintenance';
import MaintenanceDetails from './pages/MaintenanceDetails';
import Fuel from './pages/Fuel';
import Trips from './pages/Trips';
import Documents from './pages/Documents';
import Reports from './pages/Reports';
import VehicleReport from './pages/reports/VehicleReport';
import MaintenanceReport from './pages/reports/MaintenanceReport';
import FuelReport from './pages/reports/FuelReport';
import DriversReport from './pages/reports/DriversReport';
import CostsReport from './pages/reports/CostsReport';
import Users from './pages/Users';
import Insurances from './pages/Insurances';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import Layout from './components/Layout';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="vehicles" element={<Vehicles />} />
            <Route path="vehicles/:id" element={<VehicleDetails />} />
            <Route path="drivers" element={<Drivers />} />
            <Route path="drivers/:id" element={<DriverDetails />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="maintenance/:id" element={<MaintenanceDetails />} />
            <Route path="fuel" element={<Fuel />} />
            <Route path="trips" element={<Trips />} />
            <Route path="documents" element={<Documents />} />
            <Route path="reports" element={<Reports />} />
            <Route path="reports/vehicles" element={<VehicleReport />} />
            <Route path="reports/maintenance" element={<MaintenanceReport />} />
            <Route path="reports/fuel" element={<FuelReport />} />
            <Route path="reports/drivers" element={<DriversReport />} />
            <Route path="reports/costs" element={<CostsReport />} />
            <Route path="users" element={<Users />} />
            <Route path="insurances" element={<Insurances />} />
            <Route path="settings" element={<Settings />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
