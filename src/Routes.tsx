
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';

// Layouts
import AppLayout from '@/components/layout/AppLayout';

// Pages
import Index from '@/pages/Index';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import Dashboard from '@/pages/Dashboard';
import ProfilePage from '@/pages/ProfilePage';
import MatchesPage from '@/pages/MatchesPage';
import NotFoundPage from '@/pages/NotFoundPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/register',
    element: <RegisterPage />
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'profile',
        element: <ProfilePage />
      },
      {
        path: 'profile/:username',
        element: <ProfilePage />
      },
      {
        path: 'matches',
        element: <MatchesPage />
      },
      {
        path: 'messages',
        element: <div className="container mx-auto p-4">Messages Feature Coming Soon</div>
      }
    ]
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
]);

const Routes = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
};

export default Routes;
