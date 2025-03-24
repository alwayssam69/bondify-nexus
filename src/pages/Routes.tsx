
import React, { lazy, Suspense } from 'react';
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/contexts/AuthContext';

// Regular imports for critical routes
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from './ProtectedRoute';
import Profile from '@/pages/Profile'; // Import Profile directly for more reliability

// Lazy loaded components for non-critical routes
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Matches = lazy(() => import('@/pages/Matches'));
const Chat = lazy(() => import('@/pages/Chat'));
const NotificationCenter = lazy(() => import('@/pages/NotificationCenter'));
const DiscoverSwipe = lazy(() => import('@/pages/DiscoverSwipe'));
const Community = lazy(() => import('@/pages/Community'));
const QAForum = lazy(() => import('@/pages/QAForum'));
const NewsInsights = lazy(() => import('@/pages/NewsInsights'));
const UserSearchPage = lazy(() => import('@/pages/UserSearchPage'));
const Onboarding = lazy(() => import('@/pages/Onboarding'));
const About = lazy(() => import('@/pages/About'));
const Help = lazy(() => import('@/pages/Help'));
const Safety = lazy(() => import('@/pages/Safety'));
const Terms = lazy(() => import('@/pages/Terms'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const Cookie = lazy(() => import('@/pages/Cookie'));
const Accessibility = lazy(() => import('@/pages/Accessibility'));
const Careers = lazy(() => import('@/pages/Careers'));
const Press = lazy(() => import('@/pages/Press'));
const Contact = lazy(() => import('@/pages/Contact'));
const Blog = lazy(() => import('@/pages/Blog'));

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <Spinner size="lg" />
  </div>
);

const Routes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Suspense fallback={<LoadingFallback />}>
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
    </Suspense>
  );
};

export default Routes;
