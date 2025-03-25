
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './Routes';
import { initializeStorage } from './utils/supabase-storage';
import { Toaster } from 'sonner';

// Initialize storage buckets
initializeStorage()
  .then(success => {
    if (success) {
      console.log('Storage initialized successfully');
    } else {
      console.warn('Failed to initialize storage');
    }
  })
  .catch(error => {
    console.error('Error initializing storage:', error);
  });

function App() {
  return (
    <BrowserRouter>
      <Routes />
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  );
}

export default App;
