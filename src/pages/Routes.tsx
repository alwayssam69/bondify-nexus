
import React from 'react';
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
import Profile from '@/pages/Profile'; // Import Profile directly 
import UserSearchPage from '@/pages/UserSearchPage'; // Direct import for search page

// Lazy loaded components for non-critical routes
const ResetPassword = React.lazy(() => import('@/pages/ResetPassword'));
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const Matches = React.lazy(() => import('@/pages/Matches'));
const Chat = React.lazy(() => import('@/pages/Chat'));
const NotificationCenter = React.lazy(() => import('@/pages/NotificationCenter'));
const DiscoverSwipe = React.lazy(() => import('@/pages/DiscoverSwipe'));
const Community = React.lazy(() => import('@/pages/Community'));
const QAForum = React.lazy(() => import('@/pages/QAForum'));
const NewsInsights = React.lazy(() => import('@/pages/NewsInsights'));
const Onboarding = React.lazy(() => import('@/pages/Onboarding'));
const About = React.lazy(() => import('@/pages/About'));
const Help = React.lazy(() => import('@/pages/Help'));
const Safety = React.lazy(() => import('@/pages/Safety'));
const Terms = React.lazy(() => import('@/pages/Terms'));
const Privacy = React.lazy(() => import('@/pages/Privacy'));
const Cookie = React.lazy(() => import('@/pages/Cookie'));
const Accessibility = React.lazy(() => import('@/pages/Accessibility'));
const Careers = React.lazy(() => import('@/pages/Careers'));
const Press = React.lazy(() => import('@/pages/Press'));
const Contact = React.lazy(() => import('@/pages/Contact'));
const Blog = React.lazy(() => import('@/pages/Blog'));

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <Spinner size="lg" />
  </div>
);

const Routes: React.FC = () => {
  const { user } = useAuth();

  return (
    <React.Suspense fallback={<LoadingFallback />}>
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
    </React.Suspense>
  );
};

export default Routes;
