/**
 * File: src/main.jsx
 * Updated: 2026-03-18
 *
 * Purpose:
 * - Application entry point
 * - Wraps app with all providers (Router, Auth, Toast)
 *
 * Changes:
 * - Added AuthProvider
 * - Added ToastProvider
 *
 * Connected Modules:
 * - App.jsx: Root component
 *
 * Dependencies:
 * - react-dom/client
 * - react-router-dom
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './components/UI/ToastContainer.jsx';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>
);