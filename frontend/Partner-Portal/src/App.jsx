import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import PartnerLoginPage from './pages/PartnerLoginPage';
import RegisterPage from './pages/RegisterPage';

// Partner Pages
import PartnerDashboard from './pages/partner/Dashboard';
import AddListing from './pages/partner/AddListing';
import ManageListings from './pages/partner/ManageListings';
import EditListing from './pages/partner/EditListing';
import PartnerAnalytics from './pages/partner/Analytics';
import PartnerProfile from './pages/partner/Profile';
import ManageBookings from './pages/partner/ManageBookings';
import PWAInstall from './components/common/PWAInstall';

const ProtectedRoute = ({ children }) => {
  const { user, userRole, loading } = useAuth();
  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (userRole !== 'partner') return <Navigate to="/login" replace />;
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<PartnerLoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Partner Routes */}
      <Route path="/partner" element={<ProtectedRoute><PartnerDashboard /></ProtectedRoute>} />
      <Route path="/partner/add-listing" element={<ProtectedRoute><AddListing /></ProtectedRoute>} />
      <Route path="/partner/listings" element={<ProtectedRoute><ManageListings /></ProtectedRoute>} />
      <Route path="/partner/bookings" element={<ProtectedRoute><ManageBookings /></ProtectedRoute>} />
      <Route path="/partner/listings/edit/:id" element={<ProtectedRoute><EditListing /></ProtectedRoute>} />
      <Route path="/partner/analytics" element={<ProtectedRoute><PartnerAnalytics /></ProtectedRoute>} />
      <Route path="/partner/profile" element={<ProtectedRoute><PartnerProfile /></ProtectedRoute>} />

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
