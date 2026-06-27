import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import NavigationBar from './components/common/Navbar';
import PrivateRoute from './components/common/PrivateRoute';
import AdminRoute from './components/common/AdminRoute';

// IMPORT ALL COMPONENTS
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Property Components
import PropertyList from './components/properties/PropertyList';
import PropertyForm from './components/properties/PropertyForm';
import MyProperties from './components/properties/MyProperties';

// Appointment Components
import Appointments from './components/appointments/Appointments';
import AppointmentForm from './components/appointments/AppointmentForm';

// Transaction Components
import TransactionList from './components/transactions/TransactionList';
import MyTransactions from './components/transactions/MyTransactions';

// Sales Components
import SalesList from './components/transactions/SalesList';

// User Components
import Profile from './components/user/Profile';
import Settings from './components/user/Settings';

// Admin Components
import AdminDashboard from './components/admin/Dashboard';
import AdminUsers from './components/admin/Users';
import AdminProperties from './components/admin/Properties';
import AdminAppointments from './components/admin/Appointments';
import AdminTransactions from './components/admin/Transactions';
import AdminSales from './components/admin/Sales';
import AdminReports from './components/admin/Reports';

// Test Components
import TestApi from './components/TestApi';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Layout component that conditionally renders navbar
const AppLayout = ({ children }) => {
  const location = useLocation();
  
  // More robust check for auth pages
  const isAuthPage = 
    location.pathname === '/' || 
    location.pathname === '/login' || 
    location.pathname === '/register';
  
  // Debug logs
  console.log('📍 Current path:', location.pathname);
  console.log('🔐 Is auth page:', isAuthPage);
  console.log('📋 Rendering navbar:', !isAuthPage);
  
  return (
    <div className="d-flex flex-column min-vh-100">
      {!isAuthPage && <NavigationBar />}
      <main className="flex-grow-1 bg-light">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppLayout>
          <Routes>
            {/* ========== PUBLIC ROUTES ========== */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* ========== PROTECTED ROUTES ========== */}
            <Route
              path="/properties"
              element={
                <PrivateRoute>
                  <PropertyList />
                </PrivateRoute>
              }
            />
            <Route
              path="/properties/new"
              element={
                <PrivateRoute>
                  <PropertyForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/properties/edit/:id"
              element={
                <PrivateRoute>
                  <PropertyForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-properties"
              element={
                <PrivateRoute>
                  <MyProperties />
                </PrivateRoute>
              }
            />
            
            <Route
              path="/appointments"
              element={
                <PrivateRoute>
                  <Appointments />
                </PrivateRoute>
              }
            />
            <Route
              path="/appointments/new/:propertyId"
              element={
                <PrivateRoute>
                  <AppointmentForm />
                </PrivateRoute>
              }
            />
            
            <Route
              path="/transactions"
              element={
                <PrivateRoute>
                  <TransactionList />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-transactions"
              element={
                <PrivateRoute>
                  <MyTransactions />
                </PrivateRoute>
              }
            />
            
            <Route
              path="/sales"
              element={
                <PrivateRoute>
                  <SalesList />
                </PrivateRoute>
              }
            />
            
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }
            />
            
            {/* ========== ADMIN ROUTES ========== */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/properties"
              element={
                <AdminRoute>
                  <AdminProperties />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/appointments"
              element={
                <AdminRoute>
                  <AdminAppointments />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/transactions"
              element={
                <AdminRoute>
                  <AdminTransactions />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/sales"
              element={
                <AdminRoute>
                  <AdminSales />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <AdminRoute>
                  <AdminReports />
                </AdminRoute>
              }
            />
            
            {/* ========== TEST ROUTES ========== */}
            <Route path="/test" element={<TestApi />} />
            
            {/* ========== 404 - NOT FOUND ========== */}
            <Route path="/404" element={<div className="text-center py-5"><h2>404 - Page Not Found</h2></div>} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </AppLayout>
      </AuthProvider>
    </Router>
  );
}

export default App;