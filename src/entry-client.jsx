import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import { DataProvider } from './context/DataContext.jsx';
import './index.css';

const rootElement = document.getElementById('root');

// Grab initial data injected during SSG
const initialData = window.__INITIAL_DATA__ || null;

const app = (
  <React.StrictMode>
    <DataProvider initialData={initialData}>
      <HelmetProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </DataProvider>
  </React.StrictMode>
);

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}
