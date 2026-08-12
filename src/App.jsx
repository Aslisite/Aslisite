import { lazy, Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import CssBaselineImport from '@mui/material/CssBaseline';
import { Routes, Route } from 'react-router-dom';
import theme from './theme/theme';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { ClickSpark, ScrollToTop } from './components/common';

const CssBaseline = CssBaselineImport.default || CssBaselineImport;

// Lazy-load route pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const NotFound = lazy(() => import('./pages/NotFound'));
const SheetAutomation = lazy(() => import('./pages/SheetAutomation'));

const PageLoader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
    <CircularProgress size={36} thickness={4} sx={{ color: '#7c3aed' }} />
  </Box>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <ClickSpark>
          <Box
            sx={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <ScrollToTop />
            <Navbar />
            <Box component="main" sx={{ flex: 1 }}>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogDetail />} />
                  <Route path="/services/:slug" element={<ServiceDetail />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/products/sheet-automation" element={<SheetAutomation />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </Box>
            <Footer />
          </Box>
        </ClickSpark>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
