
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
import PublicProfile from './pages/Profile'; // Temporarily using Profile page as a fallback

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <AppHeader />
        <main className="flex-1">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Onboarding />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/profile/:id" element={<Profile />} /> {/* Using Profile component for now */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
