import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import StudentLoginPage from './pages/StudentLoginPage';
import RegisterPage from './pages/RegisterPage';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import SearchResults from './pages/student/SearchResults';
import PGDetails from './pages/student/PGDetails';
import Favorites from './pages/student/Favorites';
import Complaints from './pages/student/Complaints';
import StudentProfile from './pages/student/Profile';
import MyReviews from './pages/student/MyReviews';

const ProtectedRoute = ({ children }) => {
  const { user, userRole, loading } = useAuth();
  if (loading) return <div className="loading-screen">Loading...</div>;
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
      <Route path="/student/search" element={<ProtectedRoute><SearchResults /></ProtectedRoute>} />
      <Route path="/student/pg/:id" element={<ProtectedRoute><PGDetails /></ProtectedRoute>} />
      <Route path="/student/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
      <Route path="/student/complaints" element={<ProtectedRoute><Complaints /></ProtectedRoute>} />
      <Route path="/student/profile" element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />
      <Route path="/student/reviews" element={<ProtectedRoute><MyReviews /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
