
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initCapacitor } from './capacitor';
import { supabase, initializeDatabase } from './services/supabaseClient';
import { toast } from './components/ui/sonner';

// Initialize Capacitor and database if we're on a browser or native platform
const initializeApp = async () => {
  if (typeof window !== 'undefined') {
    await initCapacitor();
  }

  // Initialize database connection
  try {
    const result = await initializeDatabase();
    if (!result.success) {
      console.warn('Database initialization had issues:', result.error);
      toast.error('Terdapat masalah saat menginisialisasi database. Beberapa fitur mungkin tidak berfungsi.');
    }
  } catch (error) {
    console.error('Failed to initialize database:', error);
    // We'll continue and let the app handle database errors as needed
  }

  // Make sure we have a valid root element
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error("Root element not found");
  } else {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
};

// Start the application
initializeApp().catch(err => {
  console.error("Error initializing application:", err);
});
