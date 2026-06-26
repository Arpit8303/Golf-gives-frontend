import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Charities from './pages/Charities';
import CharityProfile from './pages/CharityProfile';
import DrawResults from './pages/DrawResults';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const { fetchMe, isLoading } = useAuthStore();

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-bg">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-surface border-t-accent-green"></div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/charities" element={<Charities />} />
        <Route path="/charities/:id" element={<CharityProfile />} />
        <Route path="/results" element={<DrawResults />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </div>
  );
}
