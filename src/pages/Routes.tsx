
import { Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute from './ProtectedRoute';
import Loader from '@/components/ui/loader';

// Auth Pages
const Login = lazy(() => import('./Login'));
const Register = lazy(() => import('./Register'));
const ForgotPassword = lazy(() => import('./ForgotPassword'));
const ResetPassword = lazy(() => import('./ResetPassword'));
const Onboarding = lazy(() => import('./Onboarding'));

// Main Pages
const Index = lazy(() => import('./Index'));
const Dashboard = lazy(() => import('./Dashboard'));
const Profile = lazy(() => import('./Profile'));
const Matches = lazy(() => import('./Matches'));
const DiscoverSwipe = lazy(() => import('./DiscoverSwipe'));
const Chat = lazy(() => import('./Chat'));
const Settings = lazy(() => import('./Settings'));
const NotificationCenter = lazy(() => import('./NotificationCenter'));

// Information Pages
const About = lazy(() => import('./About'));
const Privacy = lazy(() => import('./Privacy'));
const Terms = lazy(() => import('./Terms'));
const Help = lazy(() => import('./Help'));
const Safety = lazy(() => import('./Safety'));
const Community = lazy(() => import('./Community'));
const Contact = lazy(() => import('./Contact'));
const Careers = lazy(() => import('./Careers'));
const Blog = lazy(() => import('./Blog'));
const Press = lazy(() => import('./Press'));
const Cookie = lazy(() => import('./Cookie'));
const Accessibility = lazy(() => import('./Accessibility'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Information Pages */}
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/help" element={<Help />} />
        <Route path="/safety" element={<Safety />} />
        <Route path="/community" element={<Community />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/press" element={<Press />} />
        <Route path="/cookie" element={<Cookie />} />
        <Route path="/accessibility" element={<Accessibility />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/discover" element={<DiscoverSwipe />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<NotificationCenter />} />
          <Route path="/onboarding" element={<Onboarding />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
