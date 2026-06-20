import { Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import CssBaselineImport from '@mui/material/CssBaseline';
import { Routes, Route } from 'react-router-dom';
import theme from './theme/theme';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import ServiceDetail from './pages/ServiceDetail';
import PrivacyPolicy from './pages/PrivacyPolicy';
import NotFound from './pages/NotFound';
import SheetAutomation from './pages/SheetAutomation';
import SheetAutomationWelcome from './pages/SheetAutomationWelcome';
import { ClickSpark, ScrollToTop } from './components/common';

const CssBaseline = CssBaselineImport.default || CssBaselineImport;

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
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/services/:slug" element={<ServiceDetail />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/products/sheet-automation" element={<SheetAutomation />} />
                <Route
                  path="/products/sheet-automation/welcome"
                  element={<SheetAutomationWelcome />}
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </ClickSpark>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
