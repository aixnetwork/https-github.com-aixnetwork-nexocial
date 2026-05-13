
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLoader from './components/AppLoader';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ContentStudio from './pages/ContentStudio';
import Campaigns from './pages/Campaigns';
import ReviewQueue from './pages/Compliance';
import Community from './pages/Community';
import Settings from './pages/Settings';
import CalendarPage from './pages/Calendar';
import MonitorPage from './pages/Monitor';
import LandingPage from './pages/LandingPage';
import SuperAdmin from './pages/SuperAdmin';
import Trends from './pages/Trends';
import PricingPage from './pages/PricingPage';
import Onboarding from './pages/Onboarding';
import FeaturesPage from './pages/Features';
import ComparisonPage from './pages/Comparison';
import StrategyWarRoom from './pages/StrategyWarRoom';
import ResetPassword from './pages/ResetPassword';

// Route wrapper to redirect logged in users from Landing Page to Dashboard
const PublicRoute = ({ children }: { children?: React.ReactNode }) => {
    const { currentUser, authLoading } = useApp();
    if (authLoading) return null;
    if (currentUser) {
        if (currentUser.role === 'SuperAdmin') return <Navigate to="/admin" replace />;
        if (currentUser.onboardingCompleted === false) return <Navigate to="/onboarding" replace />;
        return <Navigate to="/dashboard" replace />;
    }
    return <>{children}</>;
};

// Route wrapper for onboarding
const OnboardingRoute = ({ children }: { children?: React.ReactNode }) => {
    const { currentUser, authLoading } = useApp();
    if (authLoading) return null;
    if (!currentUser) return <Navigate to="/" replace />;
    if (currentUser.onboardingCompleted) return <Navigate to="/dashboard" replace />;
    return <>{children}</>;
};

// Route wrapper for Super Admin
const AdminRoute = ({ children }: { children?: React.ReactNode }) => {
    const { currentUser, authLoading } = useApp();
    if (authLoading) return null;
    if (!currentUser || currentUser.role !== 'SuperAdmin') {
        return <Navigate to="/" replace />;
    }
    return <>{children}</>;
};

const AppRoutes = () => {
    const { authLoading } = useApp();

    if (authLoading) {
        return <AppLoader />;
    }

    return (
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
          <Route path="/features" element={<PublicRoute><FeaturesPage /></PublicRoute>} />
          <Route path="/comparison" element={<PublicRoute><ComparisonPage /></PublicRoute>} />
          <Route path="/pricing" element={<PublicRoute><PricingPage /></PublicRoute>} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Super Admin Dashboard */}
          <Route path="/admin" element={<AdminRoute><SuperAdmin /></AdminRoute>} />

          {/* Onboarding */}
          <Route path="/onboarding" element={<OnboardingRoute><Onboarding /></OnboardingRoute>} />

          {/* Authenticated App Routes */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/trends" element={<Trends />} />
            <Route path="/strategy" element={<StrategyWarRoom />} />
            <Route path="/studio" element={<ContentStudio />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/monitor" element={<MonitorPage />} />
            <Route path="/review" element={<ReviewQueue />} />
            <Route path="/inbox" element={<Community />} />
            <Route path="/settings" element={<Settings />} />
            {/* Catch-all for redirects */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
    );
}

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
};

export default App;
