import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Color Palette - Modern Premium Light Theme
const colors = {
  background: {
    primary: '#ffffff',
    secondary: '#fafafa',
    elevated: '#ffffff',
    card: '#ffffff',
    glass: 'rgba(255, 255, 255, 0.85)',
    navbar: 'rgba(255, 255, 255, 0.9)',
  },
  accent: {
    primary: '#6d28d9',
    primaryHover: '#5b21b6',
    secondary: '#0d9488',
    gradient: 'linear-gradient(135deg, #6d28d9 0%, #0d9488 100%)',
    gradientReverse: 'linear-gradient(135deg, #0d9488 0%, #6d28d9 100%)',
    brandGradient: 'linear-gradient(135deg, #18181b 0%, #71717a 50%, #18181b 100%)',
  },
  text: {
    primary: '#18181b',
    secondary: '#52525b',
    muted: '#a1a1aa',
  },
  border: {
    light: '#f4f4f5',
    medium: '#e4e4e7',
    accent: 'rgba(109, 40, 217, 0.2)',
  },
  surface: {
    hover: 'rgba(0, 0, 0, 0.03)',
    active: 'rgba(0, 0, 0, 0.05)',
  },
  shadow: {
    card: '0 1px 2px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.03)',
    elevated: '0 8px 24px rgba(0, 0, 0, 0.06)',
    hover: '0 16px 40px rgba(0, 0, 0, 0.08)',
  },
  overlay: {
    image: 'linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, transparent 60%)',
  },
};

// Base Theme Configuration
let theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: colors.background.primary,
      paper: colors.background.elevated,
    },
    primary: {
      main: colors.accent.primary,
      light: '#8b5cf6',
      dark: '#4c1d95',
      contrastText: '#ffffff',
    },
    secondary: {
      main: colors.accent.secondary,
      light: '#14b8a6',
      dark: '#0f766e',
      contrastText: '#ffffff',
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
    },
    divider: colors.border.light,
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontFamily: '"Space Grotesk", "Inter", -apple-system, sans-serif',
      fontWeight: 800,
      letterSpacing: '-0.04em',
      lineHeight: 1.05,
    },
    h2: {
      fontFamily: '"Space Grotesk", "Inter", -apple-system, sans-serif',
      fontWeight: 750,
      letterSpacing: '-0.03em',
      lineHeight: 1.1,
    },
    h3: {
      fontFamily: '"Space Grotesk", "Inter", -apple-system, sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.025em',
      lineHeight: 1.2,
    },
    h4: {
      fontFamily: '"Space Grotesk", "Inter", -apple-system, sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.25,
    },
    h5: {
      fontFamily: '"Space Grotesk", "Inter", -apple-system, sans-serif',
      fontWeight: 650,
      letterSpacing: '-0.015em',
      lineHeight: 1.35,
    },
    h6: {
      fontFamily: '"Space Grotesk", "Inter", -apple-system, sans-serif',
      fontWeight: 650,
      letterSpacing: '-0.01em',
      lineHeight: 1.4,
    },
    subtitle1: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      fontWeight: 500,
      letterSpacing: '-0.005em',
      lineHeight: 1.5,
    },
    subtitle2: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      fontWeight: 550,
      letterSpacing: '-0.005em',
      lineHeight: 1.5,
    },
    body1: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      fontWeight: 420,
      letterSpacing: '-0.01em',
      lineHeight: 1.75,
    },
    body2: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      fontWeight: 420,
      letterSpacing: '-0.005em',
      lineHeight: 1.7,
    },
    button: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      fontWeight: 600,
      letterSpacing: '-0.005em',
      textTransform: 'none',
    },
    caption: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      fontWeight: 450,
      letterSpacing: '0',
      lineHeight: 1.5,
    },
    overline: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      fontWeight: 600,
      letterSpacing: '0.06em',
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
          color: '#ffffff',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '12px 28px',
          fontSize: '0.95rem',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        containedPrimary: {
          background: colors.accent.primary,
          boxShadow: '0 2px 8px rgba(109, 40, 217, 0.15)',
          color: '#ffffff',
          '&:hover': {
            boxShadow: '0 4px 14px rgba(109, 40, 217, 0.22)',
            transform: 'translateY(-2px)',
            background: colors.accent.primaryHover,
          },
        },
        containedSecondary: {
          backgroundColor: colors.background.secondary,
          border: `1px solid ${colors.border.medium}`,
          boxShadow: 'none',
          color: colors.text.primary,
          '&:hover': {
            backgroundColor: '#f4f4f5',
            borderColor: colors.accent.secondary,
            boxShadow: '0 0 12px rgba(13, 148, 136, 0.1)',
            transform: 'translateY(-2px)',
          },
        },
        outlined: {
          borderColor: colors.border.medium,
          color: colors.text.primary,
          '&:hover': {
            borderColor: colors.accent.primary,
            backgroundColor: 'rgba(109, 40, 217, 0.04)',
            transform: 'translateY(-2px)',
          },
        },
        text: {
          color: colors.accent.primary,
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '8px',
            left: '28px',
            width: '0%',
            height: '1.5px',
            backgroundColor: colors.accent.primary,
            transition: 'width 0.3s ease-in-out',
          },
          '&:hover': {
            backgroundColor: 'transparent',
            transform: 'translateY(-1px)',
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
          backgroundImage: 'none',
          border: `1px solid ${colors.border.light}`,
          borderRadius: 16,
          boxShadow: colors.shadow.card,
          transition:
            'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-3px)',
            borderColor: colors.border.medium,
            boxShadow: colors.shadow.hover,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.15s ease, color 0.15s ease',
          '&:hover': {
            backgroundColor: 'rgba(109, 40, 217, 0.06)',
            color: colors.accent.primary,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 550,
        },
        filled: {
          backgroundColor: colors.background.secondary,
          color: colors.accent.primary,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.background.navbar,
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
