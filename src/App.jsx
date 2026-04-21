import { Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import CssBaselineImport from '@mui/material/CssBaseline';
import theme from './theme/theme';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Stats from './components/Stats';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';

const CssBaseline = CssBaselineImport.default || CssBaselineImport;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
          <Services />
          <Stats />
          <FAQ />
          <Contact />
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default App;
