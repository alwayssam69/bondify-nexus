
import React from 'react';
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Profile from '@/pages/Profile';
import Dashboard from '@/pages/Dashboard';
import Matches from '@/pages/Matches';
import Chat from '@/pages/Chat';
import NotificationCenter from '@/pages/NotificationCenter';
import DiscoverSwipe from '@/pages/DiscoverSwipe';
import Community from '@/pages/Community';
import QAForum from '@/pages/QAForum';
import NewsInsights from '@/pages/NewsInsights';
import UserSearchPage from '@/pages/UserSearchPage';
import Onboarding from '@/pages/Onboarding';
import ProtectedRoute from './ProtectedRoute';
import About from '@/pages/About';
import Help from '@/pages/Help';
import Safety from '@/pages/Safety';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import Cookie from '@/pages/Cookie';
import Accessibility from '@/pages/Accessibility';
import Careers from '@/pages/Careers';
import Press from '@/pages/Press';
import Contact from '@/pages/Contact';
import Blog from '@/pages/Blog';
import NotFound from '@/pages/NotFound';
import { useAuth } from '@/contexts/AuthContext';

const Routes: React.FC = () => {
  const { user } = useAuth();

  return (
    <RouterRoutes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/onboarding" element={<Onboarding />} />

      {/* About/Info pages */}
      <Route path="/about" element={<About />} />
      <Route path="/help" element={<Help />} />
      <Route path="/safety" element={<Safety />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/cookie" element={<Cookie />} />
      <Route path="/accessibility" element={<Accessibility />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/press" element={<Press />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/blog" element={<Blog />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/:id" element={<Chat />} />
        <Route path="/notifications" element={<NotificationCenter />} />
        <Route path="/discover" element={<DiscoverSwipe />} />
        <Route path="/community" element={<Community />} />
        <Route path="/qa-forum" element={<QAForum />} />
        <Route path="/news" element={<NewsInsights />} />
        <Route path="/search" element={<UserSearchPage />} />
      </Route>

      {/* Catch-all for 404 */}
      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
  );
};

export default Routes;
