import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import AdminLoginPage from './pages/AdminLoginPage';
import SetupAdmin from './pages/SetupAdmin';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminListings from './pages/admin/Listings';
import AdminReviews from './pages/admin/Reviews';
import AdminComplaints from './pages/admin/Complaints';
import AdminAnalytics from './pages/admin/Analytics';
import PWAInstall from './components/common/PWAInstall';

const ProtectedRoute = ({ children }) => {
  const { user, userRole, loading } = useAuth();
  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (userRole !== 'admin') return <Navigate to="/login" replace />;
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<AdminLoginPage />} />
      <Route path="/setup-admin" element={<SetupAdmin />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/listings" element={<ProtectedRoute><AdminListings /></ProtectedRoute>} />
      <Route path="/admin/reviews" element={<ProtectedRoute><AdminReviews /></ProtectedRoute>} />
      <Route path="/admin/complaints" element={<ProtectedRoute><AdminComplaints /></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute><AdminAnalytics /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <PWAInstall />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
