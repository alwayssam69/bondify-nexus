
import React from 'react';
import { Routes as RouterRoutes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';

// Layouts
import AppLayout from '@/components/layout/AppLayout';

// Pages
import Index from '@/pages/Index';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import MatchesPage from '@/pages/MatchesPage';
import NotFoundPage from '@/pages/NotFoundPage';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import ProtectedRoute from '@/pages/ProtectedRoute';
import DiscoverSwipe from '@/pages/DiscoverSwipe';
import Community from '@/pages/Community';
import QAForum from '@/pages/QAForum';
import NewsInsights from '@/pages/NewsInsights';
import Chat from '@/pages/Chat';
import NotificationCenter from '@/pages/NotificationCenter';
import UserSearchPage from '@/pages/UserSearchPage';

const Routes = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

// Separate component for the routes to ensure AuthProvider is available
const AppRoutes = () => {
  const location = useLocation();

  return (
    <RouterRoutes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="/notifications" element={<NotificationCenter />} />
          <Route path="/discover" element={<DiscoverSwipe />} />
          <Route path="/community" element={<Community />} />
          <Route path="/qa-forum" element={<QAForum />} />
          <Route path="/news" element={<NewsInsights />} />
          <Route path="/search" element={<UserSearchPage />} />
        </Route>
      </Route>
      
      {/* Catch-all for 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </RouterRoutes>
  );
};

export default Routes;
