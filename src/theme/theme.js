import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Color Palette - Liquid Architect Dark Theme
const colors = {
  background: {
    primary: '#0a0a0f',
    secondary: '#12121a',
    elevated: '#1a1a25',
    card: '#161620',
  },
  accent: {
    primary: '#00d4ff',      // Electric Blue
    primaryHover: '#33ddff',
    secondary: '#7c3aed',    // Purple
    gradient: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)',
    gradientReverse: 'linear-gradient(135deg, #7c3aed 0%, #00d4ff 100%)',
  },
  text: {
    primary: '#ffffff',
    secondary: '#a0a0b0',
    muted: '#6b6b7b',
  },
  border: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.15)',
  },
};

// Base Theme Configuration
let theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: colors.background.primary,
      paper: colors.background.elevated,
    },
    primary: {
      main: colors.accent.primary,
      light: colors.accent.primaryHover,
      dark: '#00a8cc',
      contrastText: '#0a0a0f',
    },
    secondary: {
      main: colors.accent.secondary,
      light: '#9f67f0',
      dark: '#5b21b6',
      contrastText: '#ffffff',
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
    },
    divider: colors.border.light,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
      lineHeight: 1.1,
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: 1.2,
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '0',
      lineHeight: 1.35,
    },
    h5: {
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 500,
      lineHeight: 1.4,
    },
    subtitle1: {
      fontWeight: 500,
      letterSpacing: '0.01em',
      lineHeight: 1.5,
    },
    subtitle2: {
      fontWeight: 500,
      letterSpacing: '0.01em',
      lineHeight: 1.5,
    },
    body1: {
      fontWeight: 400,
      letterSpacing: '0',
      lineHeight: 1.6,
    },
    body2: {
      fontWeight: 400,
      letterSpacing: '0',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.02em',
      textTransform: 'none',
    },
    caption: {
      fontWeight: 400,
      letterSpacing: '0.02em',
      lineHeight: 1.5,
    },
    overline: {
      fontWeight: 600,
      letterSpacing: '0.08em',
      lineHeight: 1.5,
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
        },
        html: {
          scrollBehavior: 'smooth',
        },
        body: {
          backgroundColor: colors.background.primary,
          color: colors.text.primary,
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        '::selection': {
          backgroundColor: colors.accent.primary,
          color: colors.background.primary,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '12px 28px',
          fontSize: '1rem',
          transition: 'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        containedPrimary: {
          background: colors.accent.gradient,
          boxShadow: '0 4px 20px rgba(0, 212, 255, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 30px rgba(0, 212, 255, 0.4)',
            transform: 'translateY(-2px)',
          },
        },
        containedSecondary: {
          backgroundColor: colors.background.elevated,
          border: `1px solid ${colors.border.medium}`,
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: colors.background.card,
            borderColor: colors.accent.primary,
            boxShadow: '0 4px 20px rgba(0, 212, 255, 0.15)',
          },
        },
        outlined: {
          borderColor: colors.border.medium,
          '&:hover': {
            borderColor: colors.accent.primary,
            backgroundColor: 'rgba(0, 212, 255, 0.05)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: colors.background.card,
          border: `1px solid ${colors.border.light}`,
          borderRadius: 16,
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            borderColor: colors.border.medium,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.2s ease, color 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(0, 212, 255, 0.1)',
            color: colors.accent.primary,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
        filled: {
          backgroundColor: colors.background.elevated,
          color: colors.accent.primary,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(10, 10, 15, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${colors.border.light}`,
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        maxWidthXl: {
          maxWidth: '1400px !important',
        },
      },
    },
  },
});

// Apply responsive font sizes
theme = responsiveFontSizes(theme, {
  breakpoints: ['xs', 'sm', 'md', 'lg', 'xl'],
  disableAlign: false,
  factor: 2,
  variants: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2'],
});

// Export custom colors for use in components
export { colors };

export default theme;
