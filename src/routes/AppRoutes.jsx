import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Layouts
import { PublicLayout } from '../layouts/PublicLayout';
import { UserDashboardLayout } from '../layouts/UserDashboardLayout';
import { AdminDashboardLayout } from '../layouts/AdminDashboardLayout';

// Public Pages
import { Landing } from '../pages/public/Landing';
import { Login } from '../pages/public/Login';
import { Signup } from '../pages/public/Signup';
import { PrivacyPolicy } from '../pages/public/PrivacyPolicy';
import { DepositDetails } from '../pages/public/DepositDetails';
import { Terms as PublicTerms } from '../pages/public/Terms';

// User Dashboard Pages
import { UserDashboard } from '../pages/user/UserDashboard';
import { AvailableCars } from '../pages/user/AvailableCars';
import { MyBookings } from '../pages/user/MyBookings';
import { Terms as UserTerms } from '../pages/user/Terms';
import { Profile as UserProfile } from '../pages/user/Profile';

// Admin Dashboard Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { Bookings as AdminBookings } from '../pages/admin/Bookings';
import { Vehicles as AdminVehicles } from '../pages/admin/Vehicles';
import { Customers as AdminCustomers } from '../pages/admin/Customers';
import { Pricing as AdminPricing } from '../pages/admin/Pricing';
import { Calendar as AdminCalendar } from '../pages/admin/Calendar';
import { Terms as AdminTerms } from '../pages/admin/Terms';
import { Settings as AdminSettings } from '../pages/admin/Settings';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/deposit-details" element={<DepositDetails />} />
        <Route path="/terms" element={<PublicTerms />} />
      </Route>

      {/* User Protected Routes */}
      <Route
        path="/user"
        element={
          <ProtectedRoute requiredRole="user">
            <UserDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/user/dashboard" replace />} />
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="cars" element={<AvailableCars />} />
        <Route path="bookings" element={<MyBookings />} />
        <Route path="terms" element={<UserTerms />} />
        <Route path="profile" element={<UserProfile />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="vehicles" element={<AdminVehicles />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="pricing" element={<AdminPricing />} />
        <Route path="calendar" element={<AdminCalendar />} />
        <Route path="terms" element={<AdminTerms />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Catch-all Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
