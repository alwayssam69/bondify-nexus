
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster as SonnerToaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthContextProvider } from './contexts/AuthContext';
import Routes from './pages/Routes';

// Create a new instance of QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1
    }
  }
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="match-ui-theme">
        <AuthContextProvider>
          <Router>
            <Routes />
          </Router>
          <SonnerToaster position="top-right" closeButton richColors />
          <Toaster />
        </AuthContextProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
