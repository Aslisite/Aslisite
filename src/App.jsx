import React, { Suspense } from 'react';
import { Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import CssBaselineImport from '@mui/material/CssBaseline';
import { Routes, Route } from 'react-router-dom';
import theme from './theme/theme';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

const Home = React.lazy(() => import('./pages/Home'));
const Blog = React.lazy(() => import('./pages/Blog'));
const BlogDetail = React.lazy(() => import('./pages/BlogDetail'));

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
            <Suspense fallback={<Box sx={{ minHeight: '100vh' }} />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
              </Routes>
            </Suspense>
          </Box>
          <Footer />
        </Box>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
