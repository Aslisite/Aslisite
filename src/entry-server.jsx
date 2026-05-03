import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import { DataProvider } from './context/DataContext.jsx';

export function render(url, initialData = null) {
  const helmetContext = {};

  const html = renderToString(
    <React.StrictMode>
      <DataProvider initialData={initialData}>
        <HelmetProvider context={helmetContext}>
          <StaticRouter location={url}>
            <App />
          </StaticRouter>
        </HelmetProvider>
      </DataProvider>
    </React.StrictMode>
  );

  return { html, helmet: helmetContext.helmet };
}
