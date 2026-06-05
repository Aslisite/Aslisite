import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Color Palette - Charcoal Ivory Olive Theme
const colors = {
  background: {
    primary: '#0b0d10',
    secondary: '#11151a',
    elevated: '#151a20',
    card: '#11161b',
  },
  accent: {
    primary: '#8ba36a',
    primaryHover: '#9db57b',
    secondary: '#6f7d54',
    gradient: 'linear-gradient(135deg, #8ba36a 0%, #c8d2b0 100%)',
    gradientReverse: 'linear-gradient(135deg, #c8d2b0 0%, #8ba36a 100%)',
  },
  text: {
    primary: '#f5f1e8',
    secondary: 'rgba(245, 241, 232, 0.76)',
    muted: 'rgba(245, 241, 232, 0.58)',
  },
  border: {
    light: 'rgba(245, 241, 232, 0.09)',
    medium: 'rgba(245, 241, 232, 0.14)',
    accent: 'rgba(139, 163, 106, 0.35)',
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
      dark: '#6f7d54',
      contrastText: '#0b0d10',
    },
    secondary: {
      main: colors.accent.secondary,
      light: '#8f9b78',
      dark: '#556143',
      contrastText: '#f5f1e8',
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
      fontFamily: '"Sora", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 800,
      letterSpacing: '0',
      lineHeight: 1.1,
    },
    h2: {
      fontFamily: '"Sora", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 700,
      letterSpacing: '0',
      lineHeight: 1.2,
    },
    h3: {
      fontFamily: '"Sora", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
      letterSpacing: '0',
      lineHeight: 1.3,
    },
    h4: {
      fontFamily: '"Sora", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
      letterSpacing: '0',
      lineHeight: 1.35,
    },
    h5: {
      fontFamily: '"Sora", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
      letterSpacing: '0',
      lineHeight: 1.4,
    },
    h6: {
      fontFamily: '"Sora", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
      letterSpacing: '0',
      lineHeight: 1.45,
    },
    subtitle1: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 500,
      letterSpacing: '0.01em',
      lineHeight: 1.55,
    },
    subtitle2: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 500,
      letterSpacing: '0.01em',
      lineHeight: 1.55,
    },
    body1: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 400,
      letterSpacing: '0',
      lineHeight: 1.7,
    },
    body2: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 400,
      letterSpacing: '0',
      lineHeight: 1.7,
    },
    button: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
      letterSpacing: '0.01em',
      textTransform: 'none',
    },
    caption: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 400,
      letterSpacing: '0.01em',
      lineHeight: 1.45,
    },
    overline: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
      letterSpacing: '0.09em',
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
          borderRadius: 12,
          padding: '12px 28px',
          fontSize: '1rem',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #8ba36a 0%, #c8d2b0 100%)',
          boxShadow: '0 4px 20px rgba(139, 163, 106, 0.28)',
          color: '#0b0d10',
          '&:hover': {
            boxShadow: '0 8px 25px rgba(139, 163, 106, 0.34)',
            transform: 'translateY(-3px)',
          },
        },
        containedSecondary: {
          backgroundColor: 'rgba(245, 241, 232, 0.03)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(245, 241, 232, 0.14)',
          boxShadow: 'none',
          color: '#f5f1e8',
          '&:hover': {
            backgroundColor: 'rgba(245, 241, 232, 0.06)',
            borderColor: '#9db57b',
            boxShadow: '0 0 15px rgba(139, 163, 106, 0.16)',
            transform: 'translateY(-3px)',
          },
        },
        outlined: {
          borderColor: 'rgba(245, 241, 232, 0.16)',
          color: '#f5f1e8',
          '&:hover': {
            borderColor: '#8ba36a',
            backgroundColor: 'rgba(139, 163, 106, 0.08)',
            transform: 'translateY(-3px)',
          },
        },
        text: {
          color: '#8ba36a',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '8px',
            left: '28px',
            width: '0%',
            height: '2px',
            backgroundColor: '#8ba36a',
            transition: 'width 0.3s ease-in-out',
          },
          '&:hover': {
            backgroundColor: 'transparent',
            transform: 'translateY(-2px)',
            '&::after': {
              width: 'calc(100% - 56px)',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: colors.background.card,
          backgroundImage:
            'linear-gradient(180deg, rgba(245, 241, 232, 0.035) 0%, rgba(245, 241, 232, 0) 58%)',
          border: `1px solid ${colors.border.light}`,
          borderRadius: 16,
          transition:
            'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.28s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            borderColor: colors.border.accent,
            boxShadow: '0 18px 36px rgba(0, 0, 0, 0.34)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.2s ease, color 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(139, 163, 106, 0.1)',
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
          backgroundColor: 'rgba(11, 13, 16, 0.84)',
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
