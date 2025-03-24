
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <div className="z-header sticky top-0">
          <AppHeader />
        </div>
        <main className="flex-1 pt-2">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/profile/:id" element={<Profile />} /> {/* Using Profile component for public profile */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          </Routes>
        </main>
        <FloatingNavigation />
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
