import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import PWAInstall from './components/common/PWAInstall';

// Basic Pages
import PartnerLoginPage from './pages/PartnerLoginPage';
import RegisterPage from './pages/RegisterPage';

// Lazy Loaded Pages
const PartnerDashboard = lazy(() => import('./pages/partner/Dashboard'));
const AddListing = lazy(() => import('./pages/partner/AddListing'));
const ManageListings = lazy(() => import('./pages/partner/ManageListings'));
const EditListing = lazy(() => import('./pages/partner/EditListing'));
const PartnerAnalytics = lazy(() => import('./pages/partner/Analytics'));
const PartnerProfile = lazy(() => import('./pages/partner/Profile'));
const ManageBookings = lazy(() => import('./pages/partner/ManageBookings'));

// Loading Screen Component
const LoadingScreen = () => (
  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8f9fa', color: '#E60000', fontWeight: 'bold' }}>
    <div className="loading-spinner" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #E60000', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    <p style={{ marginTop: '15px' }}>Loading Partner Portal...</p>
    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

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
        <Suspense fallback={<LoadingScreen />}>
          <AppRoutes />
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
