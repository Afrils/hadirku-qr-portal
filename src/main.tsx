
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initCapacitor } from './capacitor';

// Initialize Capacitor and database if we're on a browser or native platform
const initializeApp = async () => {
  if (typeof window !== 'undefined') {
    await initCapacitor();
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
