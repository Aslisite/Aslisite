import React, { Suspense } from 'react';
import { Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import CssBaselineImport from '@mui/material/CssBaseline';
import theme from './theme/theme';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

const Services = React.lazy(() => import('./components/Services'));
const Stats = React.lazy(() => import('./components/Stats'));
const FAQ = React.lazy(() => import('./components/FAQ'));
const Contact = React.lazy(() => import('./components/Contact'));

const CssBaseline = CssBaselineImport.default || CssBaselineImport;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Navbar />
          <Box component="main" sx={{ flex: 1 }}>
            <Hero />
            <Suspense fallback={<Box sx={{ minHeight: '100vh' }} />}>
              <Services />
              <Stats />
              <FAQ />
              <Contact />
            </Suspense>
          </Box>
          <Footer />
        </Box>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
