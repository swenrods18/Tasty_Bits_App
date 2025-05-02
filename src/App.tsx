import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import CustomerDashboard from './pages/CustomerDashboard';
import ChefDashboard from './pages/ChefDashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './styles/main.css';

const ProtectedRoute: React.FC<{ 
  element: React.ReactNode; 
  allowedRole?: string;
}> = ({ element, allowedRole }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <>{element}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route 
            path="/customer" 
            element={
              <ProtectedRoute 
                element={<CustomerDashboard />} 
                allowedRole="customer" 
              />
            } 
          />
          <Route 
            path="/chef" 
            element={
              <ProtectedRoute 
                element={<ChefDashboard />} 
                allowedRole="chef" 
              />
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;