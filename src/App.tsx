
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AppHeader from './components/AppHeader';
import { Toaster } from '@/components/ui/toaster';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Matches from './pages/Matches';
import Chat from './pages/Chat';
import Onboarding from './pages/Onboarding';
import ProtectedRoute from './components/auth/ProtectedRoute';
import FloatingNavigation from './components/FloatingNavigation';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import NewsInsightsPage from './pages/NewsInsights';
import Notifications from './pages/Notifications';

// Component to conditionally render FloatingNavigation
const ConditionalFloatingNav = () => {
  const location = useLocation();
  const hideNavPaths = ['/login', '/register', '/onboarding'];
  const shouldShowNav = !hideNavPaths.includes(location.pathname);
  
  return shouldShowNav ? <FloatingNavigation /> : null;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <div className="z-40 sticky top-0">
          <AppHeader />
        </div>
        <main className="flex-1 pt-2">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/profile/:id" element={<Profile />} /> {/* Public profile */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/news" element={<ProtectedRoute><NewsInsightsPage /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <ConditionalFloatingNav />
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
