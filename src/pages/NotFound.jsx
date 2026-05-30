import { Box, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { colors } from '../theme/theme';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found | Aslisite</title>
        <meta name="robots" content="noindex" />
        <meta name="description" content="The page you are looking for does not exist." />
      </Helmet>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '70vh',
          textAlign: 'center',
          px: 3,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontWeight: 900,
            fontSize: { xs: '6rem', md: '10rem' },
            background: colors.accent.gradient,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1,
            mb: 2,
          }}
        >
          404
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: colors.text.primary,
            mb: 2,
          }}
        >
          Page Not Found
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: colors.text.secondary,
            maxWidth: '480px',
            mb: 5,
            lineHeight: 1.7,
          }}
        >
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s
          get you back on track.
        </Typography>
        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          size="large"
          sx={{
            px: 5,
            py: 1.5,
            fontWeight: 700,
            borderRadius: 2,
            background: colors.accent.gradient,
            '&:hover': {
              opacity: 0.9,
            },
          }}
        >
          Back to Home
        </Button>
      </Box>
    </>
  );
};

export default NotFound;
