
import React from 'react';
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
    <>
      <Routes />
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
