import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { colors } from '../../theme/theme';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.background.primary,
          }}
        >
          <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
            <Typography variant="h3" sx={{ color: colors.text.primary, mb: 2, fontWeight: 700 }}>
              Oops! Something went wrong.
            </Typography>
            <Typography variant="body1" sx={{ color: colors.text.secondary, mb: 4 }}>
              We&apos;re sorry, but an unexpected error occurred while loading this page.
            </Typography>
            <Button
              variant="contained"
              onClick={() => window.location.reload()}
              sx={{
                background: colors.accent.gradient,
                color: '#fff',
                px: 4,
                py: 1.5,
                fontWeight: 600,
                '&:hover': {
                  opacity: 0.9,
                },
              }}
            >
              Reload Page
            </Button>
          </Container>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
