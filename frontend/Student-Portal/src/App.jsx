import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import PWAInstall from './components/common/PWAInstall';

// Basic Pages (Small, can stay direct)
import StudentLoginPage from './pages/StudentLoginPage';
import RegisterPage from './pages/RegisterPage';

// Lazy Loaded Pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const StudentDashboard = lazy(() => import('./pages/student/Dashboard'));
const SearchResults = lazy(() => import('./pages/student/SearchResults'));
const PGDetails = lazy(() => import('./pages/student/PGDetails'));
const Favorites = lazy(() => import('./pages/student/Favorites'));
const Complaints = lazy(() => import('./pages/student/Complaints'));
const StudentProfile = lazy(() => import('./pages/student/Profile'));
const MyReviews = lazy(() => import('./pages/student/MyReviews'));
const Payments = lazy(() => import('./pages/student/Payments'));
const Bookings = lazy(() => import('./pages/student/Bookings'));
const Support = lazy(() => import('./pages/student/Support'));
const PaymentGateway = lazy(() => import('./pages/student/PaymentGateway'));

// Global Loading Spinner for Suspense
const LoadingSpinner = () => (
  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f3f3f3', gap: '20px' }}>
    <div style={{ position: 'relative', width: '72px', height: '72px' }}>
      <div style={{ width: '72px', height: '72px', borderRadius: '50%', border: '4px solid #fff', borderTop: '4px solid #E60000', animation: 'spin 0.9s linear infinite' }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '22px' }}>🏠</div>
    </div>
    <div style={{ fontSize: '20px', fontWeight: 900 }}>Hostel<span style={{ color: '#E60000' }}>Pass</span></div>
    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, userRole, loading } = useAuth();
  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f3f3f3', gap: '20px' }}>
      <div style={{ position: 'relative', width: '72px', height: '72px' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', border: '4px solid #fff', borderTop: '4px solid #E60000', animation: 'spin 0.9s linear infinite' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '22px' }}>🏠</div>
      </div>
      <div style={{ fontSize: '20px', fontWeight: 900 }}>Hostel<span style={{ color: '#E60000' }}>Pass</span></div>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (userRole !== 'student') return <Navigate to="/login" replace />;
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<StudentLoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Student Routes */}
      <Route path="/student" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/search-results" element={<SearchResults />} />
      <Route path="/student/pg/:id" element={<PGDetails />} />
      <Route path="/student/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
      <Route path="/student/complaints" element={<ProtectedRoute><Complaints /></ProtectedRoute>} />
      <Route path="/student/profile" element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />
      <Route path="/student/reviews" element={<ProtectedRoute><MyReviews /></ProtectedRoute>} />
      <Route path="/student/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
      <Route path="/student/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
      <Route path="/student/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
      <Route path="/student/pay" element={<ProtectedRoute><PaymentGateway /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <PWAInstall />
        <Suspense fallback={<LoadingSpinner />}>
          <AppRoutes />
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
