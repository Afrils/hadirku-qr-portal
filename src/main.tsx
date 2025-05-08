
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initCapacitor } from './capacitor';

// Initialize Capacitor if we're on a native platform
if (typeof window !== 'undefined') {
  initCapacitor();
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
