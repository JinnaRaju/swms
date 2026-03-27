import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ComplaintProvider } from './context/ComplaintContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import StatusTrackingPage from './pages/StatusTrackingPage';
import ComplaintPage from './pages/ComplaintPage';
import HistoryPage from './pages/HistoryPage';
import HelpSupportPage from './pages/HelpSupportPage';
import AwardPage from './pages/AwardPage';
import SettingsPage from './pages/SettingsPage';
import MainLayout from './components/MainLayout';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ComplaintProvider>
            <HashRouter>
              <AppRoutes />
            </HashRouter>
          </ComplaintProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

// A wrapper for routes that require authentication.
// If the user is not logged in, they are redirected to the login page.
const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
};

// A wrapper for public routes (like login/signup) that authenticated users shouldn't access.
// If the user is logged in, they are redirected to the main dashboard.
const PublicRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const { user } = useAuth();
    return user ? <Navigate to="/dashboard" /> : children;
}

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes accessible to everyone, but redirect if logged in */}
      <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><SignUpPage /></PublicRoute>} />

      {/* Private routes, accessible only to authenticated users */}
      <Route path="/dashboard" element={<PrivateRoute><MainLayout><DashboardPage /></MainLayout></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><MainLayout><ProfilePage /></MainLayout></PrivateRoute>} />
      <Route path="/status" element={<PrivateRoute><MainLayout><StatusTrackingPage /></MainLayout></PrivateRoute>} />
      <Route path="/complaint" element={<PrivateRoute><MainLayout><ComplaintPage /></MainLayout></PrivateRoute>} />
      <Route path="/history" element={<PrivateRoute><MainLayout><HistoryPage /></MainLayout></PrivateRoute>} />
      <Route path="/support" element={<PrivateRoute><MainLayout><HelpSupportPage /></MainLayout></PrivateRoute>} />
      <Route path="/awards" element={<PrivateRoute><MainLayout><AwardPage /></MainLayout></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><MainLayout><SettingsPage /></MainLayout></PrivateRoute>} />

      {/* A catch-all route to handle any undefined paths. 
          It redirects to the main page (login), which PrivateRoute will then correctly
          gatekeep, sending unauthenticated users to the login page. */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;